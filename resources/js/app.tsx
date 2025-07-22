import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import PageTransition from './components/page-transition';
import { ToastProvider } from '@/components/ui/use-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Wrap the app with our page transition component
        root.render(
            <ToastProvider>
                <PageTransition />
                <App {...props} />
            </ToastProvider>
        );
    },
    progress: {
        color: '#2c7870',
    },
});

// This will set light / dark mode on load...
initializeTheme();
