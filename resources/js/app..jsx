// resources/js/app.jsx

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import RootApp from './RootApp.jsx';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App: InertiaPage, props }) {
        const root = createRoot(el);
       
        root.render(
            <RootApp {...props}>
                <InertiaPage {...props} />
            </RootApp>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
