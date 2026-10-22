'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      { method: 'GET', path: '/landing-pages/records', handler: 'hostinger.findLandingPages', config: { policies: [] } },
      { method: 'POST', path: '/landing-pages/records', handler: 'hostinger.createLandingPage', config: { policies: [] } },
      { method: 'PUT', path: '/landing-pages/records/:documentId', handler: 'hostinger.updateLandingPage', config: { policies: [] } },
      { method: 'DELETE', path: '/landing-pages/records/:documentId', handler: 'hostinger.deleteLandingPage', config: { policies: [] } },
      { method: 'POST', path: '/hostinger/subdomains', handler: 'hostinger.createSubdomain', config: { policies: [] } },
      { method: 'DELETE', path: '/hostinger/subdomains/:subdomain', handler: 'hostinger.deleteSubdomain', config: { policies: [] } },
    ],
  },
};
