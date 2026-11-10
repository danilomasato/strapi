'use strict';

const UID = 'api::anuncio.anuncio';
const POPULATE = { Fotos: true };

function payload(ctx) {
  const body = ctx.request.body || {};
  const data = body.data && typeof body.data === 'object' ? body.data : body;
  const clean = { ...data };
  for (const key of ['id', 'documentId', 'publishedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'publicationStatus']) delete clean[key];
  return clean;
}

module.exports = ({ strapi }) => ({
  async records(ctx) {
    try {
      const documents = strapi.documents(UID);
      const [publishedRecords, draftRecords] = await Promise.all([
        documents.findMany({ status: 'published', populate: POPULATE, sort: { updatedAt: 'desc' }, limit: 500 }),
        documents.findMany({ status: 'draft', populate: POPULATE, sort: { updatedAt: 'desc' }, limit: 500 }),
      ]);
      const byDocumentId = new Map();
      for (const record of publishedRecords || []) if (record?.documentId) byDocumentId.set(record.documentId, { ...record, publishedAt: record.publishedAt || null, publicationStatus: 'published' });
      for (const record of draftRecords || []) if (record?.documentId && !byDocumentId.has(record.documentId)) byDocumentId.set(record.documentId, { ...record, publishedAt: null, publicationStatus: 'draft' });
      const results = Array.from(byDocumentId.values()).sort((a, b) => new Date(b.updatedAt || b.publishedAt || 0) - new Date(a.updatedAt || a.publishedAt || 0));
      ctx.body = { results, total: results.length };
    } catch (error) {
      strapi.log.error('Erro ao carregar anúncios:', error);
      ctx.throw(500, 'Não foi possível carregar os anúncios.');
    }
  },

  async detail(ctx) {
    try {
      const documentId = ctx.params.documentId;
      const documents = strapi.documents(UID);
      const [published, draft] = await Promise.all([
        documents.findOne({ documentId, status: 'published', populate: POPULATE }),
        documents.findOne({ documentId, status: 'draft', populate: POPULATE }),
      ]);
      if (!published && !draft) return ctx.notFound('Anúncio não encontrado.');
      const result = { ...(published || {}), ...(draft || {}) };
      for (const key of ['codigo', 'media_folder_id', 'nome_exibicao', 'sortOrder']) if (result[key] == null || result[key] === '') result[key] = published?.[key] ?? draft?.[key] ?? result[key];
      result.publicationStatus = published ? 'published' : 'draft';
      result.publishedAt = published?.publishedAt || null;
      ctx.body = { result };
    } catch (error) {
      strapi.log.error('Erro ao carregar anúncio:', error);
      ctx.throw(500, 'Não foi possível carregar os detalhes do anúncio.');
    }
  },

  async create(ctx) {
    try {
      const result = await strapi.documents(UID).create({ data: payload(ctx), status: 'draft' });
      ctx.status = 201;
      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('Erro ao criar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível criar o anúncio.');
    }
  },

  async update(ctx) {
    try {
      const result = await strapi.documents(UID).update({ documentId: ctx.params.documentId, data: payload(ctx), status: 'draft' });
      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('Erro ao atualizar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível atualizar o anúncio.');
    }
  },

  async publish(ctx) {
    try {
      const result = await strapi.documents(UID).publish({ documentId: ctx.params.documentId });
      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('Erro ao publicar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível publicar o anúncio.');
    }
  },

  async unpublish(ctx) {
    try {
      const result = await strapi.documents(UID).unpublish({ documentId: ctx.params.documentId });
      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('Erro ao despublicar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível despublicar o anúncio.');
    }
  },

  async remove(ctx) {
    try {
      const result = await strapi.documents(UID).delete({ documentId: ctx.params.documentId });
      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('Erro ao excluir anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível excluir o anúncio.');
    }
  },
});
