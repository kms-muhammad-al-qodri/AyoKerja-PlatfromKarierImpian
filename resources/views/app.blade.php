<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    
    <!-- Primary SEO Meta Tags -->
    <title>AyoKerja — Platform Kecerdasan Karier AI & Job Matching</title>
    <meta name="title" content="AyoKerja — Platform Kecerdasan Karier AI & Job Matching" />
    <meta name="description" content="AyoKerja adalah platform kecerdasan karier berbasis AI terlengkap di Indonesia untuk analisis CV otomatis, pencocokan lowongan kerja (Job Matching), rekomendasi skill gap, simulator wawancara AI, dan pembangun CV profesional." />
    <meta name="keywords" content="AyoKerja, AI Career Intelligence, Analisis CV AI, Job Matching, Lowongan Kerja Indonesia, CV Builder, Simulator Wawancara AI, Career Roadmap, Cari Kerja AI, Rafatech" />
    <meta name="author" content="AyoKerja Team - Rafatech" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#060A1A" />
    <link rel="canonical" href="{{ url()->current() }}" />

    <!-- Favicon & App Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/ayokerja-logo.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/ayokerja-logo.png" />
    <link rel="shortcut icon" type="image/png" href="/assets/ayokerja-logo.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/ayokerja-logo.png" />

    <!-- Open Graph / Facebook / WhatsApp SEO -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:site_name" content="AyoKerja" />
    <meta property="og:title" content="AyoKerja — Platform Kecerdasan Karier AI & Job Matching" />
    <meta property="og:description" content="Tingkatkan peluang lolos kerja hingga 95% dengan AI. Analisis CV otomatis, dapatkan rekomendasi loker presisi, dan susun langkah karier impianmu." />
    <meta property="og:image" content="{{ asset('assets/ayokerja-logo.png') }}" />
    <meta property="og:locale" content="id_ID" />

    <!-- Twitter Card SEO -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="{{ url()->current() }}" />
    <meta name="twitter:title" content="AyoKerja — Platform Kecerdasan Karier AI & Job Matching" />
    <meta name="twitter:description" content="Tingkatkan peluang lolos kerja hingga 95% dengan AI. Analisis CV otomatis, dapatkan rekomendasi loker presisi, dan susun langkah karier impianmu." />
    <meta name="twitter:image" content="{{ asset('assets/ayokerja-logo.png') }}" />

    <!-- JSON-LD Structured Data Schema for Google Search -->
    <script type="application/ld+json">
    {!! json_encode([
      '@context' => 'https://schema.org',
      '@type' => 'SoftwareApplication',
      'name' => 'AyoKerja',
      'applicationCategory' => 'BusinessApplication',
      'operatingSystem' => 'Web Browser',
      'url' => url('/'),
      'image' => asset('assets/ayokerja-logo.png'),
      'description' => 'Platform AI untuk analisis CV, Job Matching, Simulasi Wawancara, dan Roadmap Karier.',
      'offers' => [
        '@type' => 'Offer',
        'price' => '0',
        'priceCurrency' => 'IDR'
      ]
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Comfortaa:wght@700&family=Fira+Code:wght@600&family=Inter:wght@400;600;700;800&family=Orbitron:wght@700;900&family=Outfit:wght@600;700;800&family=Playfair+Display:ital,wght@1,700&family=Plus+Jakarta+Sans:wght@700;800;900&family=Righteous&family=Space+Grotesk:wght@700&family=Syne:wght@700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead

    <style>
      /* Each page controls its own background; just ensure no white flash */
      html { background: #060A1A; }
      body {
        margin: 0;
        padding: 0;
        color: #F1F5F9;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: 'Inter', sans-serif;
        overflow-x: hidden;
      }
      *::selection { background: rgba(45,212,191,0.3); color: #2DD4BF; }
    </style>
  </head>
  <body>
    @inertia
  </body>
</html>
