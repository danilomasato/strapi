'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      { method: 'GET', path: '/records', handler: 'anuncios-admin.records', config: { policies: [] } },
      { method: 'GET', path: '/records/:documentId', handler: 'anuncios-admin.detail', config: { policies: [] } },
      { method: 'POST', path: '/records', handler: 'anuncios-admin.create', config: { policies: [] } },
      { method: 'PUT', path: '/records/:documentId', handler: 'anuncios-admin.update', config: { policies: [] } },
      { method: 'POST', path: '/records/:documentId/publish', handler: 'anuncios-admin.publish', config: { policies: [] } },
      { method: 'POST', path: '/records/:documentId/unpublish', handler: 'anuncios-admin.unpublish', config: { policies: [] } },
      { method: 'DELETE', path: '/records/:documentId', handler: 'anuncios-admin.remove', config: { policies: [] } },
    ],
  },
};
