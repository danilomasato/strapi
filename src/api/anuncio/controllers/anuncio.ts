/**
 * anuncio controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::anuncio.anuncio",
  ({ strapi }) => ({
    async buscar(ctx) {
      const { termo } = ctx.params;

      const isNumero = /^\d+$/.test(termo);

      const filters = isNumero
        ? {
            $or: [
              { id: { $eq: Number(termo) } },
              { codigo: { $eq: termo.toUpperCase() } },
            ],
          }
        : {
            codigo: {
              $eq: termo.toUpperCase(),
            },
          };

      const resultado = await strapi.documents("api::anuncio.anuncio").findMany({
        filters,
        limit: 1,
        status: "published",
      });

      if (!resultado.length) {
        return ctx.notFound("Anúncio não encontrado.");
      }

      return resultado[0];
    },
  })
);