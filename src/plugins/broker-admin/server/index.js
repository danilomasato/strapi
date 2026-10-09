import anuncios from './controllers/anuncios.js';

import adminRoutes from './routes/admin.js';

export default {
  register() {},

  bootstrap() {},

  controllers: {
    anuncios,
  },

  routes: {
    admin: adminRoutes,
  },
};