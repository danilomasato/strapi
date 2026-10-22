'use strict';

const routes = require('./routes');
const hostingerController = require('./controllers/hostinger');

module.exports = () => ({
  register() {},
  bootstrap() {},
  routes,
  controllers: {
    hostinger: hostingerController,
  },
});
