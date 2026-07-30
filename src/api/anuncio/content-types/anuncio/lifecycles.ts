const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function gerarCodigo(tamanho = 8) {
  let codigo = "";

  for (let i = 0; i < tamanho; i++) {
    codigo += CHARS.charAt(
      Math.floor(Math.random() * CHARS.length)
    );
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
      limit: 1,
      fields: ["codigo"],
    });

    if (existente.length === 0) {
      return codigo;
    }
  }
}

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    // Se já veio preenchido, mantém
    if (data.codigo) {
      return;
    }

    data.codigo = await gerarCodigoUnico(strapi);
  },
};