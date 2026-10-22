import pluginId from './pluginId';
import { Layout } from '@strapi/icons';

export default {
  register(app: any) {
    app.registerPlugin({
      id: pluginId,
      name: 'Landing Pages',
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: Layout,
      intlLabel: {
        id: `${pluginId}.menu`,
        defaultMessage: 'Landing Pages',
      },
      Component: () => import('./components/LandingPages'),
      permissions: [],
      position: 4,
    });
  },

  bootstrap() {},

  async registerTrads({ locales }: { locales: string[] }) {
    return locales.map((locale) => ({
      data: {},
      locale,
    }));
  },
};