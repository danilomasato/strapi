import { randomBytes } from "crypto";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let atualizandoNomeExibicao = false;

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

async function atualizarNomeExibicao(
  strapi: any,
  documentId: string
) {
  const anuncio = await strapi
    .documents("api::anuncio.anuncio")
    .findOne({
      documentId,
      fields: ["id", "titulo", "nome_exibicao"],
    });

  if (!anuncio) return;


  const novoNome = `${anuncio.id} - ${anuncio.titulo}`;


  // Evita salvar novamente se já estiver correto
  if (anuncio.nome_exibicao === novoNome) {
    return;
  }


  await strapi
    .documents("api::anuncio.anuncio")
    .update({
      documentId,
      data: {
        nome_exibicao: novoNome,
      },
    });
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
        fields: ["codigo"],
      });


    if (anuncio && !anuncio.codigo) {
      data.codigo = await gerarCodigoUnico(strapi);
    }
  },


  /**
   * Preenche ID + Título depois de salvar/publicar
   */
  async afterUpdate(event) {

    if (atualizandoNomeExibicao) {
      return;
    }


    atualizandoNomeExibicao = true;


    try {
      const { result } = event;


      await atualizarNomeExibicao(
        strapi,
        result.documentId
      );

    } finally {
      atualizandoNomeExibicao = false;
    }
  },

};