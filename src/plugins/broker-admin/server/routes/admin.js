export default {
  type: 'admin',

  routes: [
    {
      method: 'GET',
      path: '/authorization',
      handler: 'anuncios.checkAuthorization',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/brokers',
      handler: 'anuncios.findBrokers',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/brokers/:brokerDocumentId',
      handler: 'anuncios.findBroker',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/anuncios/:brokerDocumentId',
      handler: 'anuncios.findByBroker',
      config: {
        policies: [],
      },
    },
  ],
};