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

const diagnosticarAnuncios = async (brokerEmail, brokerAdminId) => {
  const connection = strapi.db.connection;
  const tabela = 'anuncios';

  try {
    const colunasDisponiveis = [
      'id',
      'document_id',
      'created_by_id',
      'updated_by_id',
      'published_at',
      'locale',
      'titulo',
      'nome_exibicao',
      'codigo',
    ];

    const colunasExistentes = [];

    for (const coluna of colunasDisponiveis) {
      const existe = await connection.schema.hasColumn(
        tabela,
        coluna
      );

      if (existe) {
        colunasExistentes.push(coluna);
      }
    }

    strapi.log.info(
      `[broker-admin][diagnostico] Colunas disponíveis: ${colunasExistentes.join(', ')}`
    );

    if (!colunasExistentes.includes('created_by_id')) {
      strapi.log.warn(
        '[broker-admin][diagnostico] A tabela anuncios não possui created_by_id.'
      );
      return;
    }

    const totalPorAutor = await connection(tabela)
      .select('created_by_id')
      .count('* as total')
      .groupBy('created_by_id')
      .orderBy('total', 'desc');

    strapi.log.info(
      `[broker-admin][diagnostico] Distribuição de anúncios por autor: ${JSON.stringify(
        totalPorAutor.map((row) => ({
          created_by_id: row.created_by_id,
          total: Number(row.total),
        }))
      )}`
    );

    const totalGeral = await connection(tabela)
      .count('* as total')
      .first();

    const totalDoAutorAtual = await connection(tabela)
      .where('created_by_id', brokerAdminId)
      .count('* as total')
      .first();

    strapi.log.info(
      `[broker-admin][diagnostico] Resumo para ${brokerEmail}: ${JSON.stringify({
        brokerAdminId,
        totalRegistrosNaTabela: Number(totalGeral?.total || 0),
        totalRegistrosDoAutorAtual: Number(
          totalDoAutorAtual?.total || 0
        ),
      })}`
    );

    const colunasAmostra = colunasExistentes.filter(
      (coluna) =>
        coluna !== 'updated_by_id'
    );

    const amostra = await connection(tabela)
      .select(colunasAmostra)
      .orderBy('id', 'desc')
      .limit(30);

    strapi.log.info(
      `[broker-admin][diagnostico] Amostra dos 30 registros mais recentes: ${JSON.stringify(
        amostra.map((row) => ({
          id: row.id,
          document_id: row.document_id,
          created_by_id: row.created_by_id,
          published_at: row.published_at,
          locale: row.locale,
          titulo: row.titulo,
          nome_exibicao: row.nome_exibicao,
          codigo: row.codigo,
        }))
      )}`
    );

    const autoresDiferentes = amostra.filter(
      (row) =>
        Number(row.created_by_id) !== Number(brokerAdminId)
    );

    strapi.log.info(
      `[broker-admin][diagnostico] Registros recentes com autoria diferente de ${brokerAdminId}: ${autoresDiferentes.length}`
    );
  } catch (error) {
    strapi.log.error(
      '[broker-admin][diagnostico] Falha ao investigar a tabela anuncios:',
      error
    );
  }
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

      const uniqueBrokersMap = new Map();

      for (const broker of brokers) {
        const uniqueKey = broker.documentId || `id:${broker.id}`;

        if (!uniqueBrokersMap.has(uniqueKey)) {
          uniqueBrokersMap.set(uniqueKey, broker);
        }
      }

      const uniqueBrokers = Array.from(uniqueBrokersMap.values());

      strapi.log.info(
        `[broker-admin] Registros encontrados: ${brokers.length}`
      );

      strapi.log.info(
        `[broker-admin] Corretores únicos retornados: ${uniqueBrokers.length}`
      );

      if (brokers.length !== uniqueBrokers.length) {
        strapi.log.warn(
          `[broker-admin] ${
            brokers.length - uniqueBrokers.length
          } registro(s) repetido(s) removido(s) da resposta por documentId.`
        );
      }

      strapi.log.info(
        `[broker-admin] IDs dos corretores retornados: ${uniqueBrokers
          .map((broker) => broker.id)
          .join(', ')}`
      );

      strapi.log.info(
        `[broker-admin] documentIds retornados: ${uniqueBrokers
          .map((broker) => broker.documentId)
          .join(', ')}`
      );

      ctx.body = { data: uniqueBrokers };
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
          populate: {
            credencialCreci: true,
          },
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
        strapi.log.warn(
          `[broker-admin] Corretor ${brokerDocumentId} não possui e-mail cadastrado.`
        );

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
          select: ['id', 'email'],
        });

      if (!brokerAdmin) {
        strapi.log.warn(
          `[broker-admin] Nenhum usuário administrativo encontrado para o e-mail do corretor ${broker.email}.`
        );

        ctx.body = { data: [] };
        return;
      }

      strapi.log.info(
        `[broker-admin][diagnostico] Consultando anúncios: ${JSON.stringify({
          brokerDocumentId,
          brokerEmail: broker.email,
          brokerAdminId: brokerAdmin.id,
          requisitanteAdminId: adminUser.id,
        })}`
      );

      await diagnosticarAnuncios(
        broker.email,
        brokerAdmin.id
      );

      const createdByRows = await strapi.db
        .connection('admin_users')
        .select('id')
        .where('id', brokerAdmin.id);

      if (!createdByRows.length) {
        strapi.log.warn(
          `[broker-admin] Usuário administrativo ${brokerAdmin.id} não encontrado na tabela admin_users.`
        );

        ctx.body = { data: [] };
        return;
      }

      const announcementRows = await strapi.db
        .connection('anuncios')
        .select('document_id')
        .where('created_by_id', brokerAdmin.id);

      const announcementDocumentIds = [
        ...new Set(
          announcementRows
            .map((row) => row.document_id)
            .filter(Boolean)
        ),
      ];

      strapi.log.info(
        `[broker-admin][diagnostico] DocumentIds associados ao autor ${brokerAdmin.id}: ${announcementDocumentIds.length}`
      );

      if (!announcementDocumentIds.length) {
        strapi.log.warn(
          `[broker-admin] Nenhum anúncio encontrado com created_by_id=${brokerAdmin.id}.`
        );

        ctx.body = { data: [] };
        return;
      }

      const anuncios = await strapi
        .documents('api::anuncio.anuncio')
        .findMany({
          filters: {
            documentId: {
              $in: announcementDocumentIds,
            },
          },
          status: 'published',
          fields: [
            'codigo',
            'nome_exibicao',
            'titulo',
            'Tipo_de_Anuncio',
            'publishedAt',
            'locale',
            'createdAt',
          ],
          sort: ['createdAt:desc'],
        });

      const uniqueAnuncios = Array.from(
        new Map(
          anuncios.map((anuncio) => [
            anuncio.documentId,
            anuncio,
          ])
        ).values()
      );

      const data = uniqueAnuncios.map((anuncio) => {
        const titulo =
          (typeof anuncio.titulo === 'string' &&
            anuncio.titulo.trim()) ||
          (typeof anuncio.nome_exibicao === 'string' &&
            anuncio.nome_exibicao.trim()) ||
          'Sem título';

        return {
          id: anuncio.id,
          documentId: anuncio.documentId,
          codigo: anuncio.codigo,
          nome_exibicao: anuncio.nome_exibicao,
          titulo,
          Tipo_de_Anuncio: anuncio.Tipo_de_Anuncio,
          publishedAt: anuncio.publishedAt,
          locale: anuncio.locale,
          createdAt: anuncio.createdAt,
        };
      });

      strapi.log.info(
        `[broker-admin] Anúncios publicados encontrados para ${broker.email}: ${data.length}`
      );

      ctx.body = { data };
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