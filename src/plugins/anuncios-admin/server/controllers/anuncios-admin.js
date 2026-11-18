'use strict';

const UID = 'api::anuncio.anuncio';
const POPULATE = { Fotos: true, createdBy: true };
const OWNER_STORE_KEY = 'adOwners';

function payload(ctx) {
  const body = ctx.request.body || {};
  const data = body.data && typeof body.data === 'object' ? body.data : body;
  const clean = { ...data };
  for (const key of ['id', 'documentId', 'publishedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'publicationStatus']) delete clean[key];
  return clean;
}

function currentUser(ctx) { return ctx.state?.user || ctx.state?.admin || null; }
function userId(user) { return user?.id == null ? null : String(user.id); }
function isVania(user) {
  const values = [user?.username, user?.email, user?.firstname, user?.firstName, user?.lastname, user?.lastName, user?.displayName]
    .filter(Boolean).map(v => String(v).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
  return values.some(v => v.includes('vania') || v.includes('albuquerque'));
}
function recordOwner(record) {
  const creator = record?.createdBy;
  if (creator?.id != null) return String(creator.id);
  if (creator?.documentId != null) return String(creator.documentId);
  return null;
}
async function getOwnerMap(strapi) {
  const store = strapi.store({ type: 'plugin', name: 'anuncios-admin' });
  return (await store.get({ key: OWNER_STORE_KEY })) || {};
}

function diagnosticUser(user) {
  if (!user) return null;
  return {
    id: user.id == null ? null : String(user.id),
    username: user.username || null,
    email: user.email || null,
    firstname: user.firstname || user.firstName || null,
    lastname: user.lastname || user.lastName || null,
  };
}

async function resolveUserById(strapi, id) {
  if (id == null || id === '') return null;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;

  for (const uid of ['admin::user', 'plugin::users-permissions.user']) {
    try {
      const user = await strapi.db.query(uid).findOne({
        where: { id: numericId },
        select: ['id', 'username', 'email', 'firstname', 'lastname'],
      });
      if (user) return { ...diagnosticUser(user), source: uid };
    } catch (error) {
      // A user type may not exist or may not be available in this Strapi setup.
    }
  }
  return null;
}

async function logAnnouncementOwnershipDiagnostic(strapi, ctx, record, owners) {
  try {
    const documentId = String(record?.documentId || ctx.params.documentId || '');
    const ownerId = owners?.[documentId] == null ? null : String(owners[documentId]);
    const populatedCreator = diagnosticUser(record?.createdBy || record?.created_by);
    let databaseCreatorId = null;

    try {
      const row = await strapi.db.connection('anuncios')
        .select('created_by_id')
        .where('document_id', documentId)
        .first();
      if (row?.created_by_id != null) databaseCreatorId = String(row.created_by_id);
    } catch (error) {
      strapi.log.warn(`[anuncios-admin][diagnostico] Não foi possível ler created_by_id para ${documentId}: ${error.message}`);
    }

    const [ownerUser, databaseCreatorUser, sessionUser] = await Promise.all([
      resolveUserById(strapi, ownerId),
      resolveUserById(strapi, databaseCreatorId),
      resolveUserById(strapi, currentUser(ctx)?.id),
    ]);

    strapi.log.info(`[anuncios-admin][diagnostico-abertura] ${JSON.stringify({
      evento: 'abertura_detalhe_anuncio',
      codigo: record?.codigo || null,
      documentId,
      titulo: record?.titulo || record?.nome_exibicao || null,
      status: record?.publishedAt ? 'published' : 'draft',
      usuarioQueAbriu: sessionUser || diagnosticUser(currentUser(ctx)),
      createdByPopulado: populatedCreator,
      createdByIdNaTabela: databaseCreatorId,
      usuarioDoCreatedById: databaseCreatorUser,
      adOwnersId: ownerId,
      usuarioDoAdOwners: ownerUser,
      comparacao: {
        createdByIgualAdOwners: databaseCreatorId != null && ownerId != null
          ? databaseCreatorId === ownerId
          : null,
        createdByEmailIgualVitor: String(databaseCreatorUser?.email || populatedCreator?.email || '').trim().toLowerCase() === 'vitor.shibuya@outlook.com',
        adOwnersEmailIgualVitor: String(ownerUser?.email || '').trim().toLowerCase() === 'vitor.shibuya@outlook.com',
      },
    })}`);
  } catch (error) {
    strapi.log.error('[anuncios-admin][diagnostico-abertura] Falha ao registrar diagnóstico de autoria:', error);
  }
}
async function setOwner(strapi, documentId, ownerId) {
  if (!documentId || !ownerId) return;
  const store = strapi.store({ type: 'plugin', name: 'anuncios-admin' });
  const owners = (await store.get({ key: OWNER_STORE_KEY })) || {};
  owners[String(documentId)] = String(ownerId);
  await store.set({ key: OWNER_STORE_KEY, value: owners });
}
function canAccess(ctx, record, owners) {
  const user = currentUser(ctx);
  if (isVania(user)) return true;
  const id = userId(user);
  if (!id) return false;
  const owner = owners[String(record?.documentId)] || recordOwner(record);
  return owner != null && String(owner) === id;
}
function deny(ctx) { return ctx.forbidden('Você só pode visualizar ou editar anúncios de sua autoria.'); }


module.exports = ({ strapi }) => ({
  async records(ctx) {
    try {
      const documents = strapi.documents(UID);
      const [publishedRecords, draftRecords, owners] = await Promise.all([
        documents.findMany({ status: 'published', populate: POPULATE, sort: { updatedAt: 'desc' }, limit: 500 }),
        documents.findMany({ status: 'draft', populate: POPULATE, sort: { updatedAt: 'desc' }, limit: 500 }),
        getOwnerMap(strapi),
      ]);
      const byDocumentId = new Map();
      for (const record of publishedRecords || []) if (record?.documentId) byDocumentId.set(record.documentId, { ...record, publishedAt: record.publishedAt || null, publicationStatus: 'published' });
      for (const record of draftRecords || []) if (record?.documentId && !byDocumentId.has(record.documentId)) byDocumentId.set(record.documentId, { ...record, publishedAt: null, publicationStatus: 'draft' });
      const all = Array.from(byDocumentId.values()).sort((a, b) => new Date(b.updatedAt || b.publishedAt || 0) - new Date(a.updatedAt || a.publishedAt || 0));
      const results = all.filter(record => canAccess(ctx, record, owners));
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
      const [published, draft, owners] = await Promise.all([
        documents.findOne({ documentId, status: 'published', populate: POPULATE }),
        documents.findOne({ documentId, status: 'draft', populate: POPULATE }),
        getOwnerMap(strapi),
      ]);
      if (!published && !draft) return ctx.notFound('Anúncio não encontrado.');
      const result = { ...(published || {}), ...(draft || {}) };
      // Diagnóstico temporário: registra a autoria e o vínculo adOwners sempre que
      // um administrador abre a tela de detalhes de um anúncio.
      await logAnnouncementOwnershipDiagnostic(strapi, ctx, result, owners);
      if (!canAccess(ctx, result, owners)) return deny(ctx);
      for (const key of ['codigo', 'media_folder_id', 'nome_exibicao', 'sortOrder']) if (result[key] == null || result[key] === '') result[key] = published?.[key] ?? draft?.[key] ?? result[key];
      result.publicationStatus = published ? 'published' : 'draft';
      result.publishedAt = published?.publishedAt || null;
      ctx.body = { result };
    } catch (error) {
      if (error?.status === 403) throw error;
      strapi.log.error('Erro ao carregar anúncio:', error);
      ctx.throw(500, 'Não foi possível carregar os detalhes do anúncio.');
    }
  },


  async create(ctx) {
    try {
      const result = await strapi.documents(UID).create({ data: payload(ctx), status: 'draft' });
      await setOwner(strapi, result?.documentId, userId(currentUser(ctx)));
      ctx.status = 201;
      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('Erro ao criar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível criar o anúncio.');
    }
  },


  async update(ctx) {
    try {
      const documentId = ctx.params.documentId;
      const documents = strapi.documents(UID);
      const [published, draft, owners] = await Promise.all([
        documents.findOne({ documentId, status: 'published', populate: POPULATE }),
        documents.findOne({ documentId, status: 'draft', populate: POPULATE }),
        getOwnerMap(strapi),
      ]);
      const existing = { ...(published || {}), ...(draft || {}) };
      if (!published && !draft) return ctx.notFound('Anúncio não encontrado.');
      if (!canAccess(ctx, existing, owners)) return deny(ctx);
      const result = await documents.update({ documentId, data: payload(ctx), status: 'draft' });
      ctx.body = { data: result };
    } catch (error) {
      if (error?.status === 403) throw error;
      strapi.log.error('Erro ao atualizar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível atualizar o anúncio.');
    }
  },


  async publish(ctx) {
    try {
      const documentId = ctx.params.documentId;
      const [record, owners] = await Promise.all([
        strapi.documents(UID).findOne({ documentId, status: 'draft', populate: POPULATE }),
        getOwnerMap(strapi),
      ]);
      if (!record) return ctx.notFound('Anúncio não encontrado.');
      if (!canAccess(ctx, record, owners)) return deny(ctx);
      const result = await strapi.documents(UID).publish({ documentId });
      ctx.body = { data: result };
    } catch (error) {
      if (error?.status === 403) throw error;
      strapi.log.error('Erro ao publicar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível publicar o anúncio.');
    }
  },


  async unpublish(ctx) {
    try {
      const documentId = ctx.params.documentId;
      const [record, owners] = await Promise.all([
        strapi.documents(UID).findOne({ documentId, status: 'published', populate: POPULATE }),
        getOwnerMap(strapi),
      ]);
      if (!record) return ctx.notFound('Anúncio não encontrado.');
      if (!canAccess(ctx, record, owners)) return deny(ctx);
      const result = await strapi.documents(UID).unpublish({ documentId });
      ctx.body = { data: result };
    } catch (error) {
      if (error?.status === 403) throw error;
      strapi.log.error('Erro ao despublicar anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível despublicar o anúncio.');
    }
  },


  async remove(ctx) {
    try {
      const documentId = ctx.params.documentId;
      const documents = strapi.documents(UID);
      const [published, draft, owners] = await Promise.all([
        documents.findOne({ documentId, status: 'published', populate: POPULATE }),
        documents.findOne({ documentId, status: 'draft', populate: POPULATE }),
        getOwnerMap(strapi),
      ]);
      const existing = { ...(published || {}), ...(draft || {}) };
      if (!published && !draft) return ctx.notFound('Anúncio não encontrado.');
      if (!canAccess(ctx, existing, owners)) return deny(ctx);
      const result = await documents.delete({ documentId });
      const store = strapi.store({ type: 'plugin', name: 'anuncios-admin' });
      const ownerMap = owners || {};
      delete ownerMap[String(documentId)];
      await store.set({ key: OWNER_STORE_KEY, value: ownerMap });
      ctx.body = { data: result };
    } catch (error) {
      if (error?.status === 403) throw error;
      strapi.log.error('Erro ao excluir anúncio:', error);
      ctx.throw(400, error.message || 'Não foi possível excluir o anúncio.');
    }
  },
});
