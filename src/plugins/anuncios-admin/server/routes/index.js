'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/records/:documentId',
        handler: 'anuncios-admin.detail',
        config: { policies: [] },
      },
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
