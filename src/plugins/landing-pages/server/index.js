'use strict';

module.exports = {
  register() {},
  bootstrap() {},
  controllers: {
    hostinger: require('./controllers/hostinger'),
  },
  routes: require('./routes'),
};
