'use strict';

const HOSTINGER_BASE_URL = 'https://developers.hostinger.com/api/hosting/v1';
const LANDING_PAGE_UID = 'api::landing-page.landing-page';

const getConfig = () => ({
  token: process.env.HOSTINGER_API_TOKEN,
  username: process.env.HOSTINGER_ACCOUNT_USERNAME || 'u956524612',
  domain: process.env.HOSTINGER_WEBSITE_DOMAIN || 'tudosobreap.com.br',
});

const validateSubdomain = (value) => {
  if (typeof value !== 'string') return '';
  const subdomain = value.trim().toLowerCase();
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain) ? subdomain : '';
};

const requestHostinger = async ({ method, subdomain, body }) => {
  const { token, username, domain } = getConfig();
  if (!token) {
    const error = new Error('A variável HOSTINGER_API_TOKEN não está configurada no servidor.');
    error.status = 500;
    throw error;
  }

  const path = `${HOSTINGER_BASE_URL}/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/subdomains${subdomain ? `/${encodeURIComponent(subdomain)}` : ''}`;
  const response = await fetch(path, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const responseText = await response.text();
  let responseBody = null;
  if (responseText) {
    try { responseBody = JSON.parse(responseText); } catch { responseBody = { message: responseText }; }
  }
  if (!response.ok) {
    const details = responseBody?.message || responseBody?.error || (responseBody ? JSON.stringify(responseBody) : '');
    const error = new Error(details || `A Hostinger retornou HTTP ${response.status}.`);
    error.status = response.status >= 400 && response.status < 500 ? 400 : 502;
    throw error;
  }
  return responseBody;
};

const getDocumentId = (ctx) => String(ctx.params.documentId || '').trim();

module.exports = ({ strapi }) => ({
  // CRUD administrativo: usa os serviços internos do Strapi e a sessão do painel,
  // sem depender da autenticação da Content API (/api/landing-pages).
  async findLandingPages(ctx) {
    try {
      const query = {
        sort: { updatedAt: 'desc' },
        populate: {
          imagemTopo: true,
          logo: true,
          imagensGaleria: true,
          cardsConteudo1: { populate: { imagem: true } },
        },
      };
      // No Strapi 5, findMany sem status retorna somente documentos publicados.
      // A listagem do plugin precisa exibir também os rascunhos.
      const [drafts, published] = await Promise.all([
        strapi.documents(LANDING_PAGE_UID).findMany({ ...query, status: 'draft' }),
        strapi.documents(LANDING_PAGE_UID).findMany({ ...query, status: 'published' }),
      ]);
      // Para editar, prioriza os campos do rascunho, pois ele pode conter
      // alterações mais recentes que ainda não foram publicadas. O publishedAt
      // é preservado a partir da versão publicada para manter o status correto.
      const draftsByDocument = new Map();
      (drafts || []).forEach((item) => {
        const key = item.documentId || String(item.id);
        draftsByDocument.set(key, item);
      });
      const publishedByDocument = new Map();
      (published || []).forEach((item) => {
        const key = item.documentId || String(item.id);
        publishedByDocument.set(key, item);
      });
      const keys = new Set([...draftsByDocument.keys(), ...publishedByDocument.keys()]);
      const data = [...keys].map((key) => {
        const draft = draftsByDocument.get(key);
        const live = publishedByDocument.get(key);
        if (draft && live) return { ...draft, publishedAt: live.publishedAt };
        return draft || live;
      }).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      ctx.body = { data };
    } catch (error) {
      strapi.log.error(`Falha ao listar landing pages: ${error.message}`);
      ctx.status = 500;
      ctx.body = { error: 'Não foi possível listar as landing pages.' };
    }
  },

  async createLandingPage(ctx) {
    const requestBody = ctx.request.body || {};
    const data = requestBody.data;
    const status = requestBody.status === 'published' ? 'published' : 'draft';
    if (!data || typeof data !== 'object' || Array.isArray(data)) return ctx.badRequest('Os dados da landing page não foram informados.');
    try {
      const created = await strapi.documents(LANDING_PAGE_UID).create({
        status,
        data,
        populate: {
          imagemTopo: true,
          logo: true,
          imagensGaleria: true,
          cardsConteudo1: { populate: { imagem: true } },
        },
      });
      ctx.status = 201;
      ctx.body = { data: created };
    } catch (error) {
      strapi.log.error(`Falha ao criar landing page: ${error.message}`);
      ctx.status = error.status || 400;
      ctx.body = { error: error.message || 'Não foi possível criar a landing page.' };
    }
  },

  async updateLandingPage(ctx) {
    const documentId = getDocumentId(ctx);
    const requestBody = ctx.request.body || {};
    const data = requestBody.data;
    const status = requestBody.status === 'published' ? 'published' : 'draft';
    if (!documentId) return ctx.badRequest('O identificador da landing page é obrigatório.');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return ctx.badRequest('Os dados da landing page não foram informados.');
    try {
      const populate = {
        imagemTopo: true,
        logo: true,
        imagensGaleria: true,
        cardsConteudo1: { populate: { imagem: true } },
      };

      // O botão Publicar envia data vazio após salvar o rascunho. Nesse caso,
      // publicar explicitamente o documento existente é mais seguro do que
      // chamar update({ status: 'published', data: {} }).
      let updated;
      if (status === 'published' && Object.keys(data).length === 0) {
        const result = await strapi.documents(LANDING_PAGE_UID).publish({ documentId });
        updated = Array.isArray(result) ? result[0] : result;
      } else if (status === 'published') {
        await strapi.documents(LANDING_PAGE_UID).update({ documentId, status: 'draft', data });
        const result = await strapi.documents(LANDING_PAGE_UID).publish({ documentId });
        updated = Array.isArray(result) ? result[0] : result;
      } else {
        updated = await strapi.documents(LANDING_PAGE_UID).update({
          documentId,
          status: 'draft',
          data,
          populate,
        });
      }
      ctx.body = { data: updated };
    } catch (error) {
      strapi.log.error(`Falha ao atualizar landing page ${documentId}: ${error.message}`);
      ctx.status = error.status || 400;
      ctx.body = { error: error.message || 'Não foi possível atualizar a landing page.' };
    }
  },

  async deleteLandingPage(ctx) {
    const documentId = getDocumentId(ctx);
    if (!documentId) return ctx.badRequest('O identificador da landing page é obrigatório.');
    try {
      const deleted = await strapi.documents(LANDING_PAGE_UID).delete({ documentId });
      ctx.body = { data: deleted };
    } catch (error) {
      strapi.log.error(`Falha ao excluir landing page ${documentId}: ${error.message}`);
      ctx.status = error.status || 400;
      ctx.body = { error: error.message || 'Não foi possível excluir a landing page.' };
    }
  },

  async createSubdomain(ctx) {
    const subdomain = validateSubdomain(ctx.request.body?.subdomain);
    if (!subdomain) return ctx.badRequest('Informe um prefixo de subdomínio válido (letras minúsculas, números e hífen).');
    try {
      await requestHostinger({ method: 'POST', body: { subdomain, directory: subdomain, is_using_public_directory: true } });
      ctx.body = { success: true, subdomain };
    } catch (error) {
      strapi.log.error(`Falha ao criar subdomínio na Hostinger: ${error.message}`);
      ctx.status = error.status || 502;
      ctx.body = { error: error.message || 'Não foi possível criar o subdomínio na Hostinger.' };
    }
  },

  async deleteSubdomain(ctx) {
    const subdomain = validateSubdomain(ctx.params.subdomain);
    if (!subdomain) return ctx.badRequest('O prefixo do subdomínio informado é inválido.');
    try {
      await requestHostinger({ method: 'DELETE', subdomain });
      ctx.body = { success: true, subdomain };
    } catch (error) {
      strapi.log.error(`Falha ao excluir subdomínio na Hostinger: ${error.message}`);
      ctx.status = error.status || 502;
      ctx.body = { error: error.message || 'Não foi possível excluir o subdomínio na Hostinger.' };
    }
  },
});
