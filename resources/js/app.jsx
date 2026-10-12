import '../css/app.css';
import './i18n'; // 🌐 Init i18next global — multi-language support
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'AyoKerja';

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : `${appName} — AI Career Intelligence Platform`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#06b6d4',
    },
});


