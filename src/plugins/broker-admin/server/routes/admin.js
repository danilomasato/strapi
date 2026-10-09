export default {
    type: 'admin',

    routes: [{
        method: 'GET',
        path: '/anuncios/:brokerDocumentId',
        handler: 'anuncios.findByBroker',
        config: {
            policies: [],
        },
    }, ],
};