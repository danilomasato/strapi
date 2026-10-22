'use strict';

const HOSTINGER_BASE_URL = 'https://developers.hostinger.com/api/hosting/v1';

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

module.exports = ({ strapi }) => ({
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
