import pluginId from './pluginId';
import PluginIcon from './components/PluginIcon';

export default {
  register(app: any) {
    app.registerPlugin({
      id: pluginId,
      name: 'Administração de Corretores',
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.menu`,
        defaultMessage: 'Corretores - Ficha cadastral',
      },
      Component: () => import('./components/BrokerDetails'),
      permissions: [],
      position: 3,
    });

    console.log(`[${pluginId}] PLUGIN CARREGADO - REGISTER`);
  },

  bootstrap() {
    console.log(`[${pluginId}] PLUGIN CARREGADO - BOOTSTRAP`);
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return locales.map((locale) => ({
      data: {},
      locale,
    }));
  },
};