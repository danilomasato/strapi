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

      const brokerEmail = String(broker.email || '').trim().toLowerCase();
      if (!brokerEmail) {
        strapi.log.warn(
          `[broker-admin] Corretor ${brokerDocumentId} não possui e-mail cadastrado.`
        );
        ctx.body = { data: [] };
        return;
      }

      // O usuário associado ao corretor pode estar em admin_users ou em up_users.
      // Não presumimos que o ID do registro do corretor seja o ID do usuário.
      const candidateUserIds = new Set();
      const candidateEmails = new Set([brokerEmail]);
      const userLookups = [
        {
          uid: 'admin::user',
          label: 'admin_users',
        },
        {
          uid: 'plugin::users-permissions.user',
          label: 'up_users',
        },
      ];

      for (const lookup of userLookups) {
        try {
          const matchedUser = await strapi.db.query(lookup.uid).findOne({
            where: {
              email: {
                $eqi: brokerEmail,
              },
            },
            select: ['id', 'email'],
          });

          if (matchedUser?.id != null) {
            candidateUserIds.add(String(matchedUser.id));
          }

          if (matchedUser?.email) {
            candidateEmails.add(String(matchedUser.email).trim().toLowerCase());
          }
        } catch (lookupError) {
          // Uma das fontes pode não estar disponível nesta instalação do Strapi.
          strapi.log.debug(
            `[broker-admin] Não foi possível consultar ${lookup.label}: ${lookupError.message}`
          );
        }
      }

      // 1) Procura pelo created_by_id diretamente na tabela de anúncios.
      const directCreatorDocumentIds = new Set();
      if (candidateUserIds.size) {
        try {
          const creatorRows = await strapi.db
            .connection('anuncios')
            .select('document_id')
            .whereIn('created_by_id', Array.from(candidateUserIds));

          for (const row of creatorRows || []) {
            if (row.document_id) directCreatorDocumentIds.add(String(row.document_id));
          }
        } catch (queryError) {
          strapi.log.warn(
            `[broker-admin] Falha ao consultar created_by_id: ${queryError.message}`
          );
        }
      }

      // 2) Procura pelo vínculo salvo pelo plugin de anúncios (adOwners).
      const ownerStore = strapi.store({
        type: 'plugin',
        name: 'anuncios-admin',
      });
      const ownerMap = (await ownerStore.get({ key: 'adOwners' })) || {};
      const ownerDocumentIds = new Set();

      for (const [documentId, ownerValue] of Object.entries(ownerMap)) {
        const normalizedOwner = String(ownerValue || '').trim().toLowerCase();
        if (
          candidateUserIds.has(String(ownerValue)) ||
          candidateEmails.has(normalizedOwner)
        ) {
          ownerDocumentIds.add(String(documentId));
        }
      }

      // 3) Confere o e-mail diretamente no createdBy populado do documento.
      // Consulta publicados e rascunhos, pois ambos pertencem ao corretor.
      const documents = strapi.documents('api::anuncio.anuncio');
      const [publishedRecords, draftRecords] = await Promise.all([
        documents.findMany({
          status: 'published',
          populate: { createdBy: true },
          sort: { updatedAt: 'desc' },
          limit: 1000,
        }),
        documents.findMany({
          status: 'draft',
          populate: { createdBy: true },
          sort: { updatedAt: 'desc' },
          limit: 1000,
        }),
      ]);

      const allRecordsByDocumentId = new Map();
      for (const record of publishedRecords || []) {
        if (record?.documentId) {
          allRecordsByDocumentId.set(String(record.documentId), {
            ...record,
            publicationStatus: 'published',
          });
        }
      }
      for (const record of draftRecords || []) {
        if (record?.documentId) {
          const key = String(record.documentId);
          const existing = allRecordsByDocumentId.get(key);
          allRecordsByDocumentId.set(key, {
            ...(existing || {}),
            ...record,
            publicationStatus: existing ? 'published' : 'draft',
          });
        }
      }

      const matchedRecords = Array.from(allRecordsByDocumentId.values()).filter(
        (record) => {
          const creator = record.createdBy || record.created_by || null;
          const creatorId = creator?.id == null ? null : String(creator.id);
          const creatorEmail = String(creator?.email || '').trim().toLowerCase();
          const documentId = String(record.documentId || '');

          return (
            (creatorId && candidateUserIds.has(creatorId)) ||
            (creatorEmail && candidateEmails.has(creatorEmail)) ||
            directCreatorDocumentIds.has(documentId) ||
            ownerDocumentIds.has(documentId)
          );
        }
      );

      const uniqueAnuncios = Array.from(
        new Map(
          matchedRecords.map((anuncio) => [String(anuncio.documentId), anuncio])
        ).values()
      ).sort(
        (a, b) =>
          new Date(b.updatedAt || b.publishedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.publishedAt || a.createdAt || 0)
      );

      strapi.log.info(
        `[broker-admin][diagnostico] Busca de anúncios para ${broker.email}: ${JSON.stringify({
          brokerDocumentId,
          candidateUserIds: Array.from(candidateUserIds),
          encontradosPorCreatedById: directCreatorDocumentIds.size,
          encontradosPorAdOwners: ownerDocumentIds.size,
          encontradosPorEmailOuCreatedBy: matchedRecords.length,
          totalFinal: uniqueAnuncios.length,
          codigo297B1A3B: uniqueAnuncios.some((item) => String(item.codigo || '').toUpperCase() === '297B1A3B'),
        })}`
      );

      const data = uniqueAnuncios.map((anuncio) => {
        const titulo =
          (typeof anuncio.titulo === 'string' && anuncio.titulo.trim()) ||
          (typeof anuncio.nome_exibicao === 'string' && anuncio.nome_exibicao.trim()) ||
          'Sem título';

        return {
          id: anuncio.id,
          documentId: anuncio.documentId,
          codigo: anuncio.codigo,
          nome_exibicao: anuncio.nome_exibicao,
          titulo,
          Tipo_de_Anuncio: anuncio.Tipo_de_Anuncio,
          publishedAt: anuncio.publishedAt,
          publicationStatus: anuncio.publicationStatus,
          locale: anuncio.locale,
          createdAt: anuncio.createdAt,
        };
      });

      strapi.log.info(
        `[broker-admin] Anúncios encontrados para ${broker.email}: ${data.length}`
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