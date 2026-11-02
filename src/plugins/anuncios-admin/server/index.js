'use strict';

const anuncios = require('./controllers/anuncios-admin');
const routes = require('./routes');

module.exports = {
  controllers: { 'anuncios-admin': anuncios },
  routes,
};
