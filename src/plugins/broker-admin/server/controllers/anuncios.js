
export default ({ strapi }) => {
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

    if (!adminUser || !adminUser.isActive) {
      ctx.forbidden('Usuário administrativo inválido ou inativo.');
      return null;
    }

    const email = String(adminUser.email || '').trim().toLowerCase();
    const roles = adminUser.roles || [];

    const isVania = email === 'vania@tudosobreap.com';
    const isSuperAdmin = roles.some(
      (role) => role.code === 'strapi-super-admin'
    );

    if (!isVania && !isSuperAdmin) {
      strapi.log.warn(
        `[broker-admin] Acesso negado ao usuário administrativo ${email || adminUser.id}.`
      );

      ctx.forbidden(
        'Você não tem permissão para acessar a ficha cadastral dos corretores.'
      );

      return null;
    }

    return adminUser;
  };

  return {
    async checkAuthorization(ctx) {
      try {
        const adminUser = await getAuthorizedAdmin(ctx);

        if (!adminUser) return;

        ctx.body = { authorized: true };
      } catch (error) {
        strapi.log.error(
          '[broker-admin] Erro ao verificar autorização:',
          error
        );

        ctx.internalServerError(
          'Não foi possível verificar a autorização.'
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
            select: [
              'id',
              'documentId',
              'nome',
              'name',
              'email',
              'telefone',
              'phone',
              'creci',
            ],
            orderBy: { id: 'desc' },
          });

        ctx.body = { data: brokers };
      } catch (error) {
        strapi.log.error(
          '[broker-admin] Erro ao consultar corretores:',
          error
        );

        ctx.internalServerError(
          'Não foi possível consultar os corretores.'
        );
      }
    },

    async findBroker(ctx) {
      try {
        const adminUser = await getAuthorizedAdmin(ctx);

        if (!adminUser) return;

        const { brokerDocumentId } = ctx.params;

        if (!brokerDocumentId) {
          return ctx.badRequest(
            'O identificador do corretor é obrigatório.'
          );
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
          '[broker-admin] Erro ao consultar detalhes do corretor:',
          error
        );

        ctx.internalServerError(
          'Não foi possível consultar os detalhes do corretor.'
        );
      }
    },

    async findByBroker(ctx) {
      try {
        const adminUser = await getAuthorizedAdmin(ctx);

        if (!adminUser) return;

        const { brokerDocumentId } = ctx.params;
        const anuncioUid = 'api::anuncio.anuncio';

        if (!brokerDocumentId) {
          return ctx.badRequest(
            'O identificador do corretor é obrigatório.'
          );
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
          ctx.body = {
            data: [],
            message: 'Nenhum anúncio foi encontrado.',
          };
          return;
        }

        const brokerAdminUser = await strapi.db
          .query('admin::user')
          .findOne({
            where: {
              email: { $eqi: broker.email },
            },
            select: ['id', 'email'],
          });

        if (!brokerAdminUser) {
          ctx.body = {
            data: [],
            message: 'Nenhum anúncio foi encontrado.',
          };
          return;
        }

        const metadata = strapi.db.metadata.get(anuncioUid);
        const tableName = metadata.tableName;

        const registros = await strapi.db
          .connection(tableName)
          .select('id', 'created_by_id', 'document_id')
          .where('created_by_id', brokerAdminUser.id)
          .orderBy('id', 'desc');

        const ids = registros.map((registro) => registro.id);

        if (ids.length === 0) {
          ctx.body = {
            data: [],
            message: 'Nenhum anúncio foi encontrado.',
          };
          return;
        }

        const anuncios = await strapi.db.query(anuncioUid).findMany({
          where: { id: { $in: ids } },
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
          orderBy: { createdAt: 'desc' },
        });

        const anunciosPorDocumento = new Map();

        for (const anuncio of anuncios) {
          const chave = anuncio.documentId
            ? `document-${anuncio.documentId}`
            : `id-${anuncio.id}`;

          if (!anunciosPorDocumento.has(chave)) {
            anunciosPorDocumento.set(chave, anuncio);
          }
        }

        ctx.body = {
          data: Array.from(anunciosPorDocumento.values()).map(
            (anuncio) => ({
              id: anuncio.id,
              documentId: anuncio.documentId,
              codigo: anuncio.codigo || '—',
              imovel:
                anuncio.nome_exibicao ||
                anuncio.titulo ||
                'Sem título',
              tipo: anuncio.Tipo_de_Anuncio || '—',
              status: anuncio.publishedAt ? 'Publicado' : 'Rascunho',
              publishedAt: anuncio.publishedAt,
              locale: anuncio.locale || null,
            })
          ),
        };
      } catch (error) {
        strapi.log.error(
          '[broker-admin] Erro ao consultar anúncios do corretor:',
          error
        );

        ctx.internalServerError(
          'Não foi possível consultar os anúncios do corretor.'
        );
      }
    },
  };
};