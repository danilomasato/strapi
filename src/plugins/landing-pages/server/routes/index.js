'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      { method: 'POST', path: '/hostinger/subdomains', handler: 'hostinger.createSubdomain', config: { policies: [] } },
      { method: 'DELETE', path: '/hostinger/subdomains/:subdomain', handler: 'hostinger.deleteSubdomain', config: { policies: [] } },
    ],
  },
};
