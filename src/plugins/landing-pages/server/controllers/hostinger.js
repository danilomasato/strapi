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
    const error = new Error(responseBody?.message || `A Hostinger retornou HTTP ${response.status}.`);
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
      const data = await strapi.documents(LANDING_PAGE_UID).findMany({
        sort: { updatedAt: 'desc' },
        populate: {
          imagemTopo: true,
          logo: true,
          imagensGaleria: true,
          cardsConteudo1: { populate: { imagem: true } },
          cardsConteudo2: { populate: { imagem: true } },
        },
      });
      ctx.body = { data };
    } catch (error) {
      strapi.log.error(`Falha ao listar landing pages: ${error.message}`);
      ctx.status = 500;
      ctx.body = { error: 'Não foi possível listar as landing pages.' };
    }
  },

  async createLandingPage(ctx) {
    const data = ctx.request.body?.data;
    if (!data || typeof data !== 'object') return ctx.badRequest('Os dados da landing page não foram informados.');
    try {
      const created = await strapi.documents(LANDING_PAGE_UID).create({
        data,
        populate: {
          imagemTopo: true,
          logo: true,
          imagensGaleria: true,
          cardsConteudo1: { populate: { imagem: true } },
          cardsConteudo2: { populate: { imagem: true } },
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
    const data = ctx.request.body?.data;
    if (!documentId) return ctx.badRequest('O identificador da landing page é obrigatório.');
    if (!data || typeof data !== 'object') return ctx.badRequest('Os dados da landing page não foram informados.');
    try {
      const updated = await strapi.documents(LANDING_PAGE_UID).update({
        documentId,
        data,
        populate: {
          imagemTopo: true,
          logo: true,
          imagensGaleria: true,
          cardsConteudo1: { populate: { imagem: true } },
          cardsConteudo2: { populate: { imagem: true } },
        },
      });
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
