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

    const existente = await strapi
      .documents("api::anuncio.anuncio")
      .findMany({
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

    const anuncio = await strapi
      .documents("api::anuncio.anuncio")
      .findOne({
        documentId: where.documentId,
        fields: ["id", "codigo", "titulo"],
      });


    if (!anuncio) {
      return;
    }


    // Mantém geração do código para anúncios antigos sem código
    if (!anuncio.codigo) {
      data.codigo = await gerarCodigoUnico(strapi);
    }


    // Preenche automaticamente ID + título
    if (anuncio.titulo) {
      data.nome_exibicao = `${anuncio.id} - ${anuncio.titulo}`;
    }
  },

};