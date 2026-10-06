import { randomBytes } from 'crypto';

const gerarCodigo = () => {
  return randomBytes(4).toString('hex').toUpperCase();
};

const gerarCodigoUnico = async () => {
  let codigo = gerarCodigo();

  let existente = await strapi.db
    .query('api::anuncio.anuncio')
    .findOne({
      where: { codigo },
      select: ['id'],
    });

  while (existente) {
    codigo = gerarCodigo();

    existente = await strapi.db
      .query('api::anuncio.anuncio')
      .findOne({
        where: { codigo },
        select: ['id'],
      });
  }

  return codigo;
};

const obterUsuarioAtual = () => {
  try {
    const requestContext = strapi.requestContext.get();
    const userId = requestContext?.state?.user?.id;

    if (userId) {
      return Number(userId);
    }
  } catch (error) {
    console.error(
      'ANUNCIO :: erro ao obter usuário atual:',
      error
    );
  }

  return null;
};

const obterNomeDaPasta = (anuncio: any) => {
  const codigo = anuncio?.codigo?.trim();
  const titulo = anuncio?.titulo?.trim();

  if (!codigo && !titulo) {
    return 'Anúncio';
  }

  if (!codigo) {
    return titulo;
  }

  if (!titulo) {
    return codigo;
  }

  return `${codigo} - ${titulo}`;
};

const criarPastaDoAnuncio = async (
  nomePasta: string,
  userId: number | null
) => {
  const folderService = strapi
    .plugin('upload')
    .service('folder');

  console.log(
    'ANUNCIO :: criando pasta:',
    nomePasta
  );

  console.log(
    'ANUNCIO :: proprietário da pasta:',
    userId
  );

  let pasta;

  if (userId) {
    pasta = await folderService.create(
      {
        name: nomePasta,
      },
      {
        user: {
          id: userId,
        },
      }
    );
  } else {
    pasta = await folderService.create({
      name: nomePasta,
    });
  }

  console.log(
    'ANUNCIO :: pasta criada:',
    pasta
  );

  if (!pasta?.id) {
    throw new Error(
      'Não foi possível criar a pasta do anúncio.'
    );
  }

  return pasta;
};

const obterOuCriarPasta = async (
  anuncio: any,
  userId: number | null
) => {
  const folderId = anuncio?.media_folder_id;

  if (folderId) {
    console.log(
      'ANUNCIO :: usando pasta já vinculada ao anúncio:',
      folderId
    );

    return folderId;
  }

  const nomePasta = obterNomeDaPasta(anuncio);

  const pasta = await criarPastaDoAnuncio(
    nomePasta,
    userId
  );

  if (!pasta?.id) {
    throw new Error(
      'Não foi possível criar a pasta do anúncio.'
    );
  }

  return pasta.id;
};

const carregarAnuncio = async (
  documentId: string
) => {
  console.log(
    'ANUNCIO :: carregando versão publicada:',
    documentId
  );

  const anuncioPublicado = await strapi
    .documents('api::anuncio.anuncio')
    .findOne({
      documentId,
      status: 'published',
      populate: {
        Fotos: true,
      },
    });

  return anuncioPublicado;
};

const sincronizarFotos = async (
  folderId: number,
  fotosAtuais: any[]
) => {
  const uploadService = strapi
    .plugin('upload')
    .service('upload');

  const fotosIdsAtuais = fotosAtuais
    .map((foto) => Number(foto?.id))
    .filter((id) => Number.isFinite(id));

  console.log(
    'ANUNCIO :: fotos atuais:',
    fotosIdsAtuais
  );

  const fotosNaPasta = await strapi.db
    .query('plugin::upload.file')
    .findMany({
      where: {
        folder: folderId,
      },
      select: ['id'],
    });

  const fotosIdsNaPasta = fotosNaPasta
    .map((foto) => Number(foto?.id))
    .filter((id) => Number.isFinite(id));

  console.log(
    'ANUNCIO :: fotos atualmente na pasta:',
    fotosIdsNaPasta
  );

  for (const fotoId of fotosIdsNaPasta) {
    if (!fotosIdsAtuais.includes(fotoId)) {
      console.log(
        'ANUNCIO :: removendo foto da pasta:',
        fotoId
      );

      await uploadService.updateFileInfo(
        fotoId,
        {
          folder: null,
        }
      );
    }
  }

  for (const fotoId of fotosIdsAtuais) {
    if (!fotosIdsNaPasta.includes(fotoId)) {
      console.log(
        'ANUNCIO :: movendo foto',
        fotoId,
        'para pasta',
        folderId
      );

      await uploadService.updateFileInfo(
        fotoId,
        {
          folder: folderId,
        }
      );
    }
  }

  console.log(
    'ANUNCIO :: fotos sincronizadas:',
    {
      folderId,
      quantidade: fotosIdsAtuais.length,
    }
  );
};

/*
 * Guarda os documentIds que estão sendo atualizados
 * internamente pelo próprio lifecycle.
 *
 * Isso impede que a atualização de media_folder_id
 * provoque uma nova sincronização recursiva.
 */
const documentosAtualizandoPasta =
  new Set<string>();

const salvarMediaFolderId = async (
  anuncio: any,
  folderId: number
) => {
  if (!anuncio?.documentId || !folderId) {
    return;
  }

  const documentId = anuncio.documentId;

  if (
    Number(anuncio.media_folder_id) ===
    Number(folderId)
  ) {
    console.log(
      'ANUNCIO :: media_folder_id já está correto:',
      folderId
    );

    return;
  }

  if (
    documentosAtualizandoPasta.has(documentId)
  ) {
    console.log(
      'ANUNCIO :: atualização interna já em andamento:',
      documentId
    );

    return;
  }

  documentosAtualizandoPasta.add(documentId);

  try {
    console.log(
      'ANUNCIO :: salvando media_folder_id:',
      {
        documentId,
        folderId,
        locale: anuncio.locale,
      }
    );

    await strapi
      .documents('api::anuncio.anuncio')
      .update({
        documentId,
        locale: anuncio.locale || undefined,
        status: 'published',
        data: {
          media_folder_id: folderId,
        },
      });

    console.log(
      'ANUNCIO :: media_folder_id salvo com sucesso:',
      {
        documentId,
        folderId,
      }
    );
  } catch (error) {
    console.error(
      'ANUNCIO :: erro ao salvar media_folder_id:',
      error
    );

    throw error;
  } finally {
    documentosAtualizandoPasta.delete(
      documentId
    );
  }
};

const sincronizarAnuncioPublicado = async (
  documentId: string
) => {
  console.log(
    'ANUNCIO :: iniciando sincronização:',
    documentId
  );

  /*
   * Se esse documentId estiver sendo atualizado internamente
   * apenas para gravar media_folder_id, não executamos
   * novamente toda a sincronização.
   */
  if (
    documentosAtualizandoPasta.has(documentId)
  ) {
    console.log(
      'ANUNCIO :: sincronização ignorada durante atualização interna:',
      documentId
    );

    return;
  }

  const anuncio =
    await carregarAnuncio(documentId);

  if (!anuncio) {
    console.log(
      'ANUNCIO :: anúncio publicado não encontrado:',
      documentId
    );

    return;
  }

  console.log(
    'ANUNCIO :: anúncio publicado carregado:',
    {
      id: anuncio.id,
      documentId: anuncio.documentId,
      publishedAt: anuncio.publishedAt,
      codigo: anuncio.codigo,
      media_folder_id:
        anuncio.media_folder_id,
    }
  );

  const userId = obterUsuarioAtual();

  console.log(
    'ANUNCIO :: usuário responsável pela pasta:',
    userId
  );

  const folderId =
    await obterOuCriarPasta(
      anuncio,
      userId
    );

  console.log(
    'ANUNCIO :: pasta pronta:',
    folderId
  );

  const fotosAtuais =
    Array.isArray(anuncio.Fotos)
      ? anuncio.Fotos
      : [];

  await sincronizarFotos(
    folderId,
    fotosAtuais
  );

  /*
   * Só depois de a pasta e as fotos estarem sincronizadas,
   * gravamos o ID da pasta no anúncio.
   */
  if (
    Number(anuncio.media_folder_id) !==
    Number(folderId)
  ) {
    await salvarMediaFolderId(
      anuncio,
      folderId
    );
  }

  console.log(
    'ANUNCIO :: pasta e fotos sincronizadas após publicação.'
  );
};

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (!data.codigo) {
      data.codigo =
        await gerarCodigoUnico();
    }

    if (
      !data.nome_exibicao &&
      data.titulo
    ) {
      data.nome_exibicao =
        data.titulo;
    }
  },

  async beforeUpdate(event) {},

  async afterCreate(event) {
    const result = event.result;

    console.log(
      'ANUNCIO :: afterCreate',
      {
        id: result?.id,
        documentId: result?.documentId,
        publishedAt:
          result?.publishedAt,
        locale: result?.locale,
      }
    );

    if (
      !result?.publishedAt ||
      !result?.documentId
    ) {
      return;
    }

    /*
     * Se o afterCreate foi provocado pela atualização
     * interna do media_folder_id, não executamos
     * novamente a sincronização.
     */
    if (
      documentosAtualizandoPasta.has(
        result.documentId
      )
    ) {
      console.log(
        'ANUNCIO :: afterCreate ignorado durante atualização interna:',
        result.documentId
      );

      return;
    }

    try {
      await sincronizarAnuncioPublicado(
        result.documentId
      );
    } catch (error) {
      console.error(
        'ANUNCIO :: erro na sincronização do anúncio publicado:',
        error
      );
    }
  },

  async afterUpdate(event) {
    const result = event.result;

    console.log(
      'ANUNCIO :: afterUpdate',
      {
        id: result?.id,
        documentId: result?.documentId,
        publishedAt:
          result?.publishedAt,
        locale: result?.locale,
      }
    );

    if (
      !result?.publishedAt ||
      !result?.documentId
    ) {
      return;
    }

    /*
     * Se esse update foi provocado pelo nosso próprio
     * salvamento de media_folder_id, não sincronizamos
     * novamente.
     */
    if (
      documentosAtualizandoPasta.has(
        result.documentId
      )
    ) {
      console.log(
        'ANUNCIO :: afterUpdate ignorado durante atualização interna:',
        result.documentId
      );

      return;
    }

    try {
      await sincronizarAnuncioPublicado(
        result.documentId
      );
    } catch (error) {
      console.error(
        'ANUNCIO :: erro na sincronização do anúncio publicado:',
        error
      );
    }
  },
};