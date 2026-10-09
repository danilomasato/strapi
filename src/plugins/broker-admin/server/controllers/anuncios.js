const getAuthorizedAdmin = async (ctx) => {
  const currentUser = ctx.state.user;

  if (!currentUser?.id) {
    ctx.unauthorized('Autenticação necessária.');
    return null;
  }

  const adminUser = await strapi.db.query('admin::user').findOne({
    where: { id: currentUser.id },
    populate: { roles: true },
    select: ['id', 'email', 'isActive'],
  });

  if (!adminUser || adminUser.isActive === false) {
    ctx.forbidden('Usuário administrativo inativo ou não encontrado.');
    return null;
  }

  const email = String(adminUser.email || '').trim().toLowerCase();
  const roles = adminUser.roles || [];

  const isVania = email === 'vania@tudosobreap.com';
  const isSuperAdmin = roles.some(
    (role) => role.code === 'strapi-super-admin'
  );

  if (!isVania && !isSuperAdmin) {
    ctx.forbidden('Você não tem permissão para acessar esta página.');
    return null;
  }

  return adminUser;
};

export default {
  async checkAuthorization(ctx) {
    try {
      const adminUser = await getAuthorizedAdmin(ctx);

      if (!adminUser) return;

      ctx.body = {
        authorized: true,
        email: adminUser.email,
      };
    } catch (error) {
      strapi.log.error(
        '[broker-admin] Erro ao verificar autorização:',
        error
      );

      ctx.internalServerError(
        'O servidor do Strapi apresentou uma falha temporária. Tente novamente.'
      );
    }
  },

  async findBrokers(ctx) {
    try {
      const adminUser = await getAuthorizedAdmin(ctx);

      if (!adminUser) return;

      const brokers = await strapi.db
        .query('api::broker.broker')
        .findMany({
          orderBy: { id: 'desc' },
        });

      ctx.body = { data: brokers };
    } catch (error) {
      strapi.log.error(
        '[broker-admin] Erro ao consultar corretores:',
        error
      );

      ctx.internalServerError(
        'O servidor do Strapi apresentou uma falha temporária. Tente novamente.'
      );
    }
  },

  async findBroker(ctx) {
    try {
      const adminUser = await getAuthorizedAdmin(ctx);

      if (!adminUser) return;

      const { brokerDocumentId } = ctx.params;

      if (!brokerDocumentId) {
        return ctx.badRequest('Identificador do corretor não informado.');
      }

      const broker = await strapi.db
        .query('api::broker.broker')
        .findOne({
          where: { documentId: brokerDocumentId },
        });

      if (!broker) {
        return ctx.notFound('Corretor não encontrado.');
      }

      ctx.body = { data: broker };
    } catch (error) {
      strapi.log.error(
        '[broker-admin] Erro ao consultar detalhe do corretor:',
        error
      );

      ctx.internalServerError(
        'O servidor do Strapi apresentou uma falha temporária. Tente novamente.'
      );
    }
  },

  async findByBroker(ctx) {
    try {
      const adminUser = await getAuthorizedAdmin(ctx);

      if (!adminUser) return;

      const { brokerDocumentId } = ctx.params;

      if (!brokerDocumentId) {
        return ctx.badRequest('Identificador do corretor não informado.');
      }

      const broker = await strapi.db
        .query('api::broker.broker')
        .findOne({
          where: { documentId: brokerDocumentId },
          select: ['documentId', 'email'],
        });

      if (!broker) {
        return ctx.notFound('Corretor não encontrado.');
      }

      if (!broker.email) {
        ctx.body = { data: [] };
        return;
      }

      const brokerAdmin = await strapi.db
        .query('admin::user')
        .findOne({
          where: {
            email: {
              $eqi: broker.email,
            },
          },
          select: ['id'],
        });

      if (!brokerAdmin) {
        ctx.body = { data: [] };
        return;
      }

      const createdByRows = await strapi.db
        .connection('admin_users')
        .select('id')
        .where('id', brokerAdmin.id);

      if (!createdByRows.length) {
        ctx.body = { data: [] };
        return;
      }

      const announcementRows = await strapi.db
        .connection('anuncios')
        .select('id')
        .where('created_by_id', brokerAdmin.id);

      const announcementIds = announcementRows.map((row) => row.id);

      if (!announcementIds.length) {
        ctx.body = { data: [] };
        return;
      }

      const anuncios = await strapi.db
        .query('api::anuncio.anuncio')
        .findMany({
          where: {
            id: { $in: announcementIds },
          },
          select: [
            'id',
            'documentId',
            'codigo',
            'nome_exibicao',
            'titulo',
            'Tipo_de_Anuncio',
            'publishedAt',
            'locale',
            'createdAt',
          ],
          orderBy: { id: 'desc' },
        });

      const uniqueAnuncios = Array.from(
        new Map(
          anuncios.map((anuncio) => [
            anuncio.documentId || anuncio.id,
            anuncio,
          ])
        ).values()
      );

      ctx.body = {
        data: uniqueAnuncios.map((anuncio) => ({
          id: anuncio.id,
          documentId: anuncio.documentId,
          codigo: anuncio.codigo,
          nome_exibicao: anuncio.nome_exibicao,
          titulo: anuncio.titulo,
          Tipo_de_Anuncio: anuncio.Tipo_de_Anuncio,
          publishedAt: anuncio.publishedAt,
          locale: anuncio.locale,
          createdAt: anuncio.createdAt,
        })),
      };
    } catch (error) {
      strapi.log.error(
        '[broker-admin] Erro ao consultar anúncios do corretor:',
        error
      );

      ctx.internalServerError(
        'O servidor do Strapi apresentou uma falha temporária. Tente novamente.'
      );
    }
  },
};