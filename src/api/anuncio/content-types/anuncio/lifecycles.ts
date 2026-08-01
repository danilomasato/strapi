import { randomBytes } from "crypto";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let atualizandoCampos = false;

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
  async afterUpdate(event) {

    if (atualizandoCampos) {
      return;
    }

    atualizandoCampos = true;

    try {
      const { result } = event;


      const anuncio = await strapi
        .documents("api::anuncio.anuncio")
        .findOne({
          documentId: result.documentId,
          fields: [
            "id",
            "codigo",
            "titulo",
            "nome_exibicao"
          ],
        });


      if (!anuncio) {
        return;
      }


      const dataAtualizar: any = {};


      // Gera código se estiver vazio
      if (!anuncio.codigo) {
        dataAtualizar.codigo = await gerarCodigoUnico(strapi);
      }


      // Atualiza nome de exibição
      const nome = `${anuncio.id} - ${anuncio.titulo}`;

      if (anuncio.nome_exibicao !== nome) {
        dataAtualizar.nome_exibicao = nome;
      }


      // Só atualiza se tiver algo para alterar
      if (Object.keys(dataAtualizar).length > 0) {
        await strapi
          .documents("api::anuncio.anuncio")
          .update({
            documentId: result.documentId,
            data: dataAtualizar,
          });
      }

    } finally {
      atualizandoCampos = false;
    }
  },

};