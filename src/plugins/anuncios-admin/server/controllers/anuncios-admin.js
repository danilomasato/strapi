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

  async detail(ctx) {
    try {
      const documentId = ctx.params.documentId;
      const documents = strapi.documents(UID);
      const [published, draft] = await Promise.all([
        documents.findOne({ documentId, status: 'published', populate: { Fotos: true } }),
        documents.findOne({ documentId, status: 'draft', populate: { Fotos: true } }),
      ]);

      if (!published && !draft) return ctx.notFound('Anúncio não encontrado.');

      // Para edição, prioriza os valores do rascunho; campos como codigo e
      // media_folder_id podem existir apenas na versão publicada, então
      // preserva-os como fallback sem sobrescrever valores preenchidos.
      const result = { ...(published || {}), ...(draft || {}) };
      for (const key of ['codigo', 'media_folder_id', 'nome_exibicao', 'sortOrder']) {
        if (result[key] === undefined || result[key] === null || result[key] === '') {
          result[key] = published?.[key] ?? draft?.[key] ?? result[key];
        }
      }
      result.publicationStatus = published ? 'published' : 'draft';
      result.publishedAt = published?.publishedAt || null;
      ctx.body = { result };
    } catch (error) {
      strapi.log.error('Erro ao carregar detalhes do anúncio:', error);
      ctx.throw(500, 'Não foi possível carregar os detalhes do anúncio.');
    }
  },

});
