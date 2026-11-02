import pluginId from './pluginId';
import { House } from '@strapi/icons';

export default {
  register(app: any) {
    app.registerPlugin({ id: pluginId, name: 'Administração de Anúncios' });
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: House,
      intlLabel: { id: `${pluginId}.menu`, defaultMessage: 'Administração de Anúncios' },
      Component: () => import('./components/Anuncios'),
      permissions: [],
      position: 3,
    });
  },
  bootstrap() {},
  async registerTrads({ locales }: { locales: string[] }) {
    return locales.map((locale) => ({ data: {}, locale }));
  },
};
