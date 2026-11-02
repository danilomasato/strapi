'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/records',
        handler: 'anuncios-admin.records',
        config: {
          policies: [],
        },
      },
    ],
  },
};
