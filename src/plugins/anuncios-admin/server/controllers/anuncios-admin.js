'use strict';

const UID = 'api::anuncio.anuncio';

/**
 * Retorna uma linha por documento, calculando a publicação pela existência
 * da versão publicada. No Strapi 5, a versão draft pode existir junto com a
 * publicada e ter publishedAt null; por isso não se deve inferir o status
 * apenas a partir do registro draft retornado pelo Content Manager.
 */
module.exports = ({ strapi }) => ({
  async records(ctx) {
    try {
      const documents = strapi.documents(UID);
      const [publishedRecords, draftRecords] = await Promise.all([
        documents.findMany({
          status: 'published',
          populate: { Fotos: true },
          sort: { updatedAt: 'desc' },
          limit: 500,
        }),
        documents.findMany({
          status: 'draft',
          populate: { Fotos: true },
          sort: { updatedAt: 'desc' },
          limit: 500,
        }),
      ]);

      const byDocumentId = new Map();

      // A versão publicada é a fonte dos dados exibidos para anúncios
      // publicados, pois representa exatamente o conteúdo que está no site.
      for (const record of publishedRecords || []) {
        if (!record?.documentId) continue;
        byDocumentId.set(record.documentId, {
          ...record,
          publishedAt: record.publishedAt || null,
          publicationStatus: 'published',
        });
      }

      // Inclui rascunhos ainda não publicados. Quando já existe versão
      // publicada, não substitui os dados públicos nem rebaixa seu status.
      for (const record of draftRecords || []) {
        if (!record?.documentId) continue;
        if (byDocumentId.has(record.documentId)) continue;
        byDocumentId.set(record.documentId, {
          ...record,
          publishedAt: null,
          publicationStatus: 'draft',
        });
      }

      const results = Array.from(byDocumentId.values()).sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.publishedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.publishedAt || 0).getTime();
        return dateB - dateA;
      });

      ctx.body = { results, total: results.length };
    } catch (error) {
      strapi.log.error('Erro ao carregar anúncios e seus status de publicação:', error);
      ctx.throw(500, 'Não foi possível carregar os anúncios.');
    }
  },
});
