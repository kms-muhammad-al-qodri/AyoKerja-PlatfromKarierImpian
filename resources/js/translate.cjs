const fs = require('fs');

const filePath = 'c:\\Users\\THINKPAD L390\\Downloads\\lomba-rafatech\\resources\\js\\Pages\\Landing.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

const enPath = 'c:\\Users\\THINKPAD L390\\Downloads\\lomba-rafatech\\resources\\js\\i18n\\locales\\en\\translation.json';
const idPath = 'c:\\Users\\THINKPAD L390\\Downloads\\lomba-rafatech\\resources\\js\\i18n\\locales\\id\\translation.json';

let enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
let idJson = JSON.parse(fs.readFileSync(idPath, 'utf-8'));

if (!enJson.landing) enJson.landing = {};
if (!idJson.landing) idJson.landing = {};

// 1. Update Stats at bottom
const statsReplacements = [
    {
        oldStr: "num: '4.9 / 5.0', label: 'Rating Kepuasan Pengguna', desc: 'Berdasarkan 2.400+ ulasan alumni & pencari kerja'",
        newStr: "num: '4.9 / 5.0', label: t('landing.stats.s1.label', 'Rating Kepuasan Pengguna'), desc: t('landing.stats.s1.desc', 'Berdasarkan 2.400+ ulasan alumni & pencari kerja')"
    },
    {
        oldStr: "num: '94%', label: 'Seleksi Success Rate', desc: 'Meningkatkan peluang lolos berkas & kualifikasi'",
        newStr: "num: '94%', label: t('landing.stats.s2.label', 'Seleksi Success Rate'), desc: t('landing.stats.s2.desc', 'Meningkatkan peluang lolos berkas & kualifikasi')"
    },
    {
        oldStr: "num: '2.400+', label: 'Karier Berhasil Dimulai', desc: 'Tersebar di startup, BUMN, & Fortune 500'",
        newStr: "num: '2.400+', label: t('landing.stats.s3.label', 'Karier Berhasil Dimulai'), desc: t('landing.stats.s3.desc', 'Tersebar di startup, BUMN, & Fortune 500')"
    },
    {
        oldStr: "num: '< 10 Detik', label: 'Kecepatan Analisis AI', desc: 'Hasil evaluasi ATS & rekomendasi karier instan'",
        newStr: "num: '< 10 Detik', label: t('landing.stats.s4.label', 'Kecepatan Analisis AI'), desc: t('landing.stats.s4.desc', 'Hasil evaluasi ATS & rekomendasi karier instan')"
    }
];

enJson.landing.stats = {
    s1: { label: 'User Satisfaction Rating', desc: 'Based on 2,400+ reviews from alumni & job seekers' },
    s2: { label: 'Selection Success Rate', desc: 'Boosts your chances of passing screening & qualifications' },
    s3: { label: 'Careers Successfully Started', desc: 'Spread across startups, SOEs & Fortune 500s' },
    s4: { label: 'AI Analysis Speed', desc: 'Instant ATS evaluation & career recommendations' }
};

for (const rep of statsReplacements) {
    content = content.replace(rep.oldStr, rep.newStr);
}

// 2. Update AI Experience Profile Card
const profileReplacements = [
    { oldStr: ">PROFIL KARIER<", newStr: ">{t('landing.profile.badge', 'PROFIL KARIER')}<" },
    { oldStr: ">Digital Marketing Specialist<", newStr: ">{t('landing.profile.role', 'Digital Marketing Specialist')}<" },
    { oldStr: ">Level Specialist<", newStr: ">{t('landing.profile.level', 'Level Specialist')}<" },
    { oldStr: ">SKILL UTAMA<", newStr: ">{t('landing.profile.mainSkill', 'SKILL UTAMA')}<" },
    { oldStr: ">SKOR PROFIL<", newStr: ">{t('landing.profile.profileScore', 'SKOR PROFIL')}<" },
    { oldStr: "label=\"Skill Teknis\"", newStr: "label={t('landing.profile.techSkill', 'Skill Teknis')}" },
    { oldStr: "label=\"Pengalaman\"", newStr: "label={t('landing.profile.experience', 'Pengalaman')}" },
    { oldStr: "label=\"Pendidikan\"", newStr: "label={t('landing.profile.education', 'Pendidikan')}" },
    { oldStr: ">Fondasi backend yang kuat dengan kemampuan full-stack berkembang. Fokus ke Docker dan cloud selanjutnya.<", newStr: ">{t('landing.profile.insight', 'Fondasi backend yang kuat dengan kemampuan full-stack berkembang. Fokus ke Docker dan cloud selanjutnya.')}<" },
    { oldStr: ">Arah Karier: <", newStr: ">{t('landing.profile.careerPath', 'Arah Karier: ')}<" },
    { oldStr: ">Backend → Full Stack<", newStr: ">{t('landing.profile.careerPathTarget', 'Backend → Full Stack')}<" }
];

enJson.landing.profile = {
    badge: 'CAREER PROFILE',
    role: 'Digital Marketing Specialist',
    level: 'Specialist Level',
    mainSkill: 'MAIN SKILLS',
    profileScore: 'PROFILE SCORE',
    techSkill: 'Technical Skills',
    experience: 'Experience',
    education: 'Education',
    insight: 'Strong backend foundation with growing full-stack capabilities. Focus on Docker and cloud next.',
    careerPath: 'Career Path: ',
    careerPathTarget: 'Backend → Full Stack'
};

for (const rep of profileReplacements) {
    content = content.replace(rep.oldStr, rep.newStr);
}

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf-8');
fs.writeFileSync(idPath, JSON.stringify(idJson, null, 2), 'utf-8');
fs.writeFileSync(filePath, content, 'utf-8');

console.log("Done phase 1 update!");
