import { createContext } from '@lit/context';
import { Route, Router } from '@vaadin/router';
import { EtchIconName } from '../components/etch-icon';
import './activities.route';
import './backup.route';
import './entries.route';
import './entry-edit.route';
import './import-daylio.route';
import './import.route';
import './moods.route';
import './search.route';
import './settings.route';

export const routerContext = createContext<Router>('router');
export const routes: EtchRoute[] = [
    {
        path: '/entries',
        component: 'entries-route',
        name: 'entries',
        options: { menuItem: true, iconName: 'BookOpen' },
    },
    {
        path: '/moods',
        component: 'moods-route',
        name: 'moods',
        options: { menuItem: true, iconName: 'Smile' },
    },
    {
        path: '/activities',
        component: 'activities-route',
        name: 'activities',
        options: { menuItem: true, iconName: 'Activity' },
    },
    {
        path: '/',
        component: 'entries-route',
        name: 'entries',
    },
    {
        path: '/entry/:id?',
        component: 'entry-edit-route',
        name: 'entry',
    },

    {
        path: '/settings',
        component: 'settings-route',
        name: 'settings',
        options: { menuItem: true, iconName: 'Settings' },
    },
    {
        path: '/import-daylio',
        component: 'import-daylio-route',
        name: 'import-daylio',
    },
    {
        path: '/import',
        component: 'import-route',
        name: 'import',
    },
    {
        path: '/search',
        component: 'search-route',
        name: 'search',
    },
    {
        path: '/backup',
        component: 'backup-route',
        name: 'backup',
    },
];
export type EtchRoute = Route & {
    options?: { iconName?: EtchIconName; menuItem?: boolean };
};
