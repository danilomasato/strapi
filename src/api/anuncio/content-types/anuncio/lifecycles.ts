import { randomBytes } from "crypto";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function gerarCodigo(tamanho = 8) {
  const bytes = randomBytes(tamanho);

  let codigo = "";

  for (let i = 0; i < tamanho; i++) {
    codigo += CHARS[bytes[i] % CHARS.length];
  }

  return codigo;
}

async function gerarCodigoUnico(strapi: any): Promise<string> {
  while (true) {
    const codigo = gerarCodigo();

    const existente = await strapi.documents("api::anuncio.anuncio").findMany({
      filters: {
        codigo: {
          $eq: codigo,
        },
      },
      fields: ["codigo"],
      limit: 1,
    });

    if (existente.length === 0) {
      return codigo;
    }
  }
}

export default {
  /**
   * Novo anúncio
   */
  async beforeCreate(event) {
    const { data } = event.params;

    if (!data.codigo) {
      data.codigo = await gerarCodigoUnico(strapi);
    }
  },

  /**
   * Atualização / Publicação
   */
  async beforeUpdate(event) {
    const { where, data } = event.params;

    const anuncio = await strapi.documents("api::anuncio.anuncio").findOne({
      documentId: where.documentId,
      fields: ["codigo"],
    });

    // Se já possui código, nunca altera
    if (anuncio?.codigo) {
      return;
    }

    // Se ainda não possui, gera um
    data.codigo = await gerarCodigoUnico(strapi);
  },
};