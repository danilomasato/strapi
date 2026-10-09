/**
 * broker controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::broker.broker',
  ({ strapi }) => ({
    async register(ctx) {
      try {
        const result = await strapi
          .service('api::broker.broker')
          .register(ctx);

        ctx.body = result;
      } catch (error) {
        const status =
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          typeof error.status === 'number'
            ? error.status
            : 500;

        strapi.log.error(
          `Erro no cadastro do corretor: ${
            error instanceof Error ? error.message : String(error)
          }`
        );

        ctx.status = status;

        ctx.body = {
          error: {
            status,
            name:
              error instanceof Error
                ? error.name
                : 'InternalServerError',
            message:
              error instanceof Error
                ? error.message
                : 'Erro ao cadastrar corretor.',
          },
        };
      }
    },
  })
);