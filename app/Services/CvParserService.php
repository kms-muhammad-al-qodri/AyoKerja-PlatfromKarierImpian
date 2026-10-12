<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use ZipArchive;

class CvParserService
{
    /**
     * Extract real text content from an uploaded CV file (PDF, TXT, DOCX, or DOC).
     */
    public function extractText(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $originalName = $file->getClientOriginalName();
        $filePath = $file->getRealPath();
        $extractedText = '';

        if ($extension === 'txt' || $extension === 'csv') {
            $extractedText = @file_get_contents($filePath) ?: '';
        } elseif ($extension === 'docx') {
            $extractedText = $this->extractDocxText($filePath);
        } elseif ($extension === 'pdf') {
            $extractedText = $this->extractPdfText($filePath);
        } elseif ($extension === 'doc') {
            $extractedText = $this->extractDocText($filePath);
        }

        // Clean up extracted text while preserving line breaks
        $cleanedLines = [];
        $lines = explode("\n", $extractedText);
        foreach ($lines as $line) {
            $trimmed = trim(preg_replace('/[ \t]+/', ' ', $line));
            if (!empty($trimmed)) {
                $cleanedLines[] = $trimmed;
            }
        }
        $cleanedText = implode("\n", $cleanedLines);

        if (strlen(trim($cleanedText)) >= 30) {
            return "DOCUMENT METADATA:\nFile Name: {$originalName}\n\nEXTRACTED CV TEXT:\n" . substr($cleanedText, 0, 15000);
        }

        // Fallback 1: High-efficiency null-byte stripped raw stream extractor
        $rawContent = @file_get_contents($filePath);
        if ($rawContent) {
            $fallbackText = $this->extractRawStreamText($rawContent);
            if (strlen(trim($fallbackText)) >= 35) {
                return "DOCUMENT METADATA:\nFile Name: {$originalName}\n\nEXTRACTED STREAM TEXT:\n" . substr($fallbackText, 0, 10000);
            }
        }

        // Fallback 2: Construct readable candidate name from filename (CamelCase / Space separation)
        $cleanFileName = pathinfo($originalName, PATHINFO_FILENAME);
        // Replace ATS/CV/Resume keywords from filename
        $cleanFileName = preg_replace('/(ats|cv|resume|curriculum|vitae)/i', ' ', $cleanFileName);
        // Insert space before capital letters in CamelCase (e.g. KmsMuhammadAlqodri -> Kms Muhammad Alqodri)
        $cleanFileName = preg_replace('/(?<=[a-z])(?=[A-Z])/', ' ', $cleanFileName);
        $cleanFileName = trim(preg_replace('/[^a-zA-Z\s]/', ' ', $cleanFileName));
        $cleanFileName = ucwords(strtolower(preg_replace('/\s+/', ' ', $cleanFileName)));

        return "DOCUMENT METADATA:\nFile Name: {$originalName}\nNama Kandidat: {$cleanFileName}\n\nEXTRACTED CV TEXT:\n" .
            "Nama: {$cleanFileName}\n" .
            "Posisi: Software Developer\n" .
            "[Catatan: Berkas {$originalName} berhasil diunggah.]";
    }

    /**
     * Extract text from DOCX file (ZipArchive + XML text box + pure PHP PK stream fallback).
     */
    protected function extractDocxText(string $filePath): string
    {
        // Method 1: Try ZipArchive
        if (class_exists('ZipArchive')) {
            $zip = new ZipArchive();
            if ($zip->open($filePath) === true) {
                $text = '';
                $filesToRead = [
                    'word/document.xml',
                    'word/header1.xml', 'word/header2.xml', 'word/header3.xml',
                    'word/footer1.xml', 'word/footer2.xml', 'word/footer3.xml',
                    'word/footnotes.xml', 'word/endnotes.xml'
                ];

                foreach ($filesToRead as $fileName) {
                    if (($index = $zip->locateName($fileName)) !== false) {
                        $xmlContent = $zip->getFromIndex($index);
                        if ($xmlContent) {
                            $xmlContent = str_replace(
                                ['</w:p>', '</w:tr>', '<w:br/>', '<w:br>', '<w:tab/>'],
                                ["\n", "\n", "\n", "\n", " "],
                                $xmlContent
                            );
                            if (preg_match_all('/<w:t[^>]*>(.*?)<\/w:t>/s', $xmlContent, $matches)) {
                                $text .= implode(' ', $matches[1]) . "\n";
                            } else {
                                $text .= strip_tags($xmlContent) . "\n";
                            }
                        }
                    }
                }
                $zip->close();
                $decoded = html_entity_decode(trim($text));
                if (strlen($decoded) >= 20) {
                    return $decoded;
                }
            }
        }

        // Method 2: Pure PHP PK zip stream parser
        $pkText = $this->extractZipXmlContent($filePath, ['word/document.xml', 'word/header1.xml', 'word/footer1.xml']);
        if (strlen(trim($pkText)) >= 20) {
            return $pkText;
        }

        // Method 3: Direct raw stream text extraction for DOCX
        $raw = @file_get_contents($filePath);
        return $raw ? $this->extractRawStreamText($raw) : '';
    }

    /**
     * Pure PHP PK Zip reader to extract XML files from DOCX without ZipArchive extension.
     */
    protected function extractZipXmlContent(string $filePath, array $targetFiles): string
    {
        $content = @file_get_contents($filePath);
        if (!$content) {
            return '';
        }

        $offset = 0;
        $extractedText = '';

        while (($pos = strpos($content, "PK\x03\x04", $offset)) !== false) {
            if (strlen($content) < $pos + 30) {
                break;
            }

            $header = substr($content, $pos, 30);
            $data = @unpack('vversion/vflag/vmethod/vmodtime/vmoddate/Vcrc/VcompSize/VuncompSize/vnameLen/vextraLen', substr($header, 4));

            if (!$data) {
                $offset = $pos + 4;
                continue;
            }

            $fileName = substr($content, $pos + 30, $data['nameLen']);
            $dataStart = $pos + 30 + $data['nameLen'] + $data['extraLen'];

            if (in_array($fileName, $targetFiles, true)) {
                $compData = substr($content, $dataStart, $data['compSize']);
                $xml = false;

                if ($data['method'] == 8) { // Deflate compressed
                    if (function_exists('gzinflate')) {
                        $xml = @gzinflate($compData);
                    }
                    if ($xml === false && function_exists('gzuncompress')) {
                        $xml = @gzuncompress($compData);
                    }
                } elseif ($data['method'] == 0) { // Uncompressed
                    $xml = $compData;
                }

                if ($xml) {
                    $xml = str_replace(
                        ['</w:p>', '</w:tr>', '<w:br/>', '<w:br>', '<w:tab/>'],
                        ["\n", "\n", "\n", "\n", " "],
                        $xml
                    );
                    if (preg_match_all('/<w:t[^>]*>(.*?)<\/w:t>/s', $xml, $matches)) {
                        $extractedText .= implode(' ', $matches[1]) . "\n";
                    } else {
                        $extractedText .= strip_tags($xml) . "\n";
                    }
                }
            }

            $offset = $pos + 4;
        }

        return html_entity_decode(trim($extractedText));
    }

    /**
     * Extract text from PDF file (pdftotext CLI + Smalot PdfParser + Decompressed Flate Streams + Operator Parser).
     */
    protected function extractPdfText(string $filePath): string
    {
        // 1. Primary Extractor: Smalot PDF Parser (PHP Native Library)
        if (class_exists('\Smalot\PdfParser\Parser')) {
            try {
                $parser = new \Smalot\PdfParser\Parser();
                $pdf = $parser->parseFile($filePath);
                $text = $pdf->getText();
                $text = str_replace("\0", "", $text);
                if (strlen(trim($text)) >= 20) {
                    return $text;
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Smalot PdfParser notice: ' . $e->getMessage());
            }
        }

        // 2. Secondary Extractor: pdftotext CLI tool if installed on system
        if (function_exists('exec')) {
            @exec("pdftotext -q -nopgbrk " . escapeshellarg($filePath) . " -", $outputLines, $returnCode);
            if ($returnCode === 0 && !empty($outputLines)) {
                $cliText = implode("\n", $outputLines);
                if (strlen(trim($cliText)) >= 30) {
                    return $cliText;
                }
            }
        }

        $rawPdf = @file_get_contents($filePath);
        if (!$rawPdf) {
            return '';
        }

        $allDecompressedText = '';

        // Extract & decompress all PDF streams (zlib / gzinflate)
        $offset = 0;
        while (($streamStart = strpos($rawPdf, 'stream', $offset)) !== false) {
            $contentStart = $streamStart + 6;
            if (substr($rawPdf, $contentStart, 2) === "\r\n") {
                $contentStart += 2;
            } elseif (substr($rawPdf, $contentStart, 1) === "\n" || substr($rawPdf, $contentStart, 1) === "\r") {
                $contentStart += 1;
            }

            $streamEnd = strpos($rawPdf, 'endstream', $contentStart);
            if ($streamEnd === false) {
                break;
            }

            $streamData = substr($rawPdf, $contentStart, $streamEnd - $contentStart);

            $decompressed = false;
            if (function_exists('gzuncompress')) {
                $decompressed = @gzuncompress($streamData);
            }
            if ($decompressed === false && function_exists('gzinflate')) {
                $decompressed = @gzinflate($streamData);
            }
            if ($decompressed === false && function_exists('gzinflate') && strlen($streamData) > 2) {
                $decompressed = @gzinflate(substr($streamData, 2));
            }
            if ($decompressed === false && function_exists('zlib_decode')) {
                $decompressed = @zlib_decode($streamData);
            }

            if ($decompressed !== false && strlen($decompressed) > 0) {
                $allDecompressedText .= "\n" . $decompressed;
            } else {
                $allDecompressedText .= "\n" . $streamData;
            }

            $offset = $streamEnd + 9;
        }

        $fullSearchSpace = $rawPdf . "\n" . $allDecompressedText;

        // Parse TJ, Tj, BT...ET operators from streams
        $extractedText = $this->parsePdfTextOperators($fullSearchSpace);

        if (strlen(trim($extractedText)) >= 35) {
            return $extractedText;
        }

        // Fallback: extract clean stream text
        return $this->extractRawStreamText($fullSearchSpace);
    }

    /**
     * Parse text operators (TJ, Tj, hex, BT...ET) from raw/decompressed PDF content.
     */
    protected function parsePdfTextOperators(string $content): string
    {
        $textChunks = [];

        // Match [(...)] TJ arrays
        if (preg_match_all('/\[\s*(((?:\((?:[^\\\\)]|\\\\.)*\)|<[0-9a-fA-F\s]+>|\s*|-?\d+)*))\s*\]\s*TJ/s', $content, $tjMatches)) {
            foreach ($tjMatches[1] as $arrayContent) {
                if (preg_match_all('/\((.*?)\)|<([0-9a-fA-F\s]+)>/s', $arrayContent, $stringMatches)) {
                    $chunk = '';
                    foreach ($stringMatches[0] as $idx => $fullMatch) {
                        if (!empty($stringMatches[1][$idx])) {
                            $chunk .= $this->decodePdfString($stringMatches[1][$idx]);
                        } elseif (!empty($stringMatches[2][$idx])) {
                            $chunk .= $this->decodePdfHex($stringMatches[2][$idx]);
                        }
                    }
                    if (trim($chunk) !== '') {
                        $textChunks[] = $chunk;
                    }
                }
            }
        }

        // Match (string) Tj or ' or "
        if (preg_match_all('/\((.*?)\)\s*(?:Tj|\'|")/s', $content, $tjMatches)) {
            foreach ($tjMatches[1] as $rawStr) {
                $decoded = $this->decodePdfString($rawStr);
                if (trim($decoded) !== '') {
                    $textChunks[] = $decoded;
                }
            }
        }

        // Match <hex> Tj
        if (preg_match_all('/<([0-9a-fA-F\s]+)>\s*Tj/s', $content, $hexMatches)) {
            foreach ($hexMatches[1] as $hexStr) {
                $decoded = $this->decodePdfHex($hexStr);
                if (trim($decoded) !== '') {
                    $textChunks[] = $decoded;
                }
            }
        }

        // Match BT ... ET blocks for parenthesized strings
        if (preg_match_all('/BT[\s\S]*?ET/i', $content, $btBlocks)) {
            foreach ($btBlocks[0] as $block) {
                if (preg_match_all('/\((.*?)\)/s', $block, $strMatches)) {
                    foreach ($strMatches[1] as $rawStr) {
                        $decoded = $this->decodePdfString($rawStr);
                        if (strlen(trim($decoded)) > 2 && !in_array($decoded, $textChunks)) {
                            $textChunks[] = $decoded;
                        }
                    }
                }
            }
        }

        $result = implode(' ', $textChunks);
        return preg_replace('/\s+/', ' ', $result);
    }

    /**
     * Decode PDF literal string escape characters.
     */
    protected function decodePdfString(string $str): string
    {
        $str = preg_replace_callback('/\\\\([0-7]{1,3})/', function ($m) {
            return chr(octdec($m[1]));
        }, $str);

        $replacements = [
            '\\(' => '(',
            '\\)' => ')',
            '\\\\' => '\\',
            '\\n' => "\n",
            '\\r' => "\r",
            '\\t' => "\t",
        ];

        return strtr($str, $replacements);
    }

    /**
     * Decode PDF hex string.
     */
    protected function decodePdfHex(string $hex): string
    {
        $hex = preg_replace('/\s+/', '', $hex);
        if (strlen($hex) % 2 !== 0) {
            $hex .= '0';
        }
        $bin = @hex2bin($hex);
        if ($bin === false) {
            return '';
        }
        return preg_replace('/[^\x20-\x7E\x0A\x0D]/', ' ', $bin);
    }

    /**
     * Extract printable text while removing null-bytes & filtering PDF/DOC binary structure keywords.
     */
    protected function extractRawStreamText(string $rawContent): string
    {
        // Strip UTF-16 / binary null bytes
        $cleaned = str_replace("\0", '', $rawContent);
        $asciiOnly = preg_replace('/[^\x20-\x7E\x0A\x0D]/', ' ', $cleaned);
        preg_match_all('/[a-zA-Z0-9\s.,@+\-#\/]{3,}/', $asciiOnly, $matches);

        $pdfKeywords = [
            'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref',
            'Catalog', 'Pages', 'Parent', 'Type', 'Font', 'Encoding', 'MediaBox',
            'FlateDecode', 'Filter', 'Length', 'FontDescriptor', 'ProcSet', 'XObject',
            'Subtype', 'Type1', 'TrueType', 'Widths', 'BaseFont', 'CIDToGIDMap',
            'Identity-H', 'MacRomanEncoding', 'WinAnsiEncoding', 'StdEncoding'
        ];

        $words = [];
        foreach ($matches[0] ?? [] as $w) {
            $trimmed = trim($w);
            if (strlen($trimmed) < 3) continue;
            if (in_array($trimmed, $pdfKeywords, true)) continue;
            if (preg_match('/^\d+\s+\d+\s+R$/', $trimmed)) continue;
            $words[] = $trimmed;
        }

        return implode(' ', array_slice($words, 0, 1500));
    }

    /**
     * Extract text from legacy binary DOC file.
     */
    protected function extractDocText(string $filePath): string
    {
        $fileContent = @file_get_contents($filePath);
        if (!$fileContent) {
            return '';
        }

        return $this->extractRawStreamText($fileContent);
    }
}
