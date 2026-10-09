export default {
  routes: [
    {
      method: 'POST',
      path: '/broker/register',
      handler: 'api::broker.broker.register',
      config: {
        auth: false,
      },
    },
  ],
};