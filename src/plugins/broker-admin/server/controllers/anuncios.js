export default ({ strapi }) => ({
  async findByBroker(ctx) {
    try {
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
          where: {
            documentId: brokerDocumentId,
          },
          select: ['documentId', 'email'],
        });

      if (!broker) {
        return ctx.notFound('Corretor não encontrado.');
      }

      strapi.log.info(
        `[broker-admin] Corretor: ${broker.documentId}; e-mail: ${broker.email || '(vazio)'}`
      );

      if (!broker.email) {
        ctx.body = {
          data: [],
          message: 'Nenhum anúncio foi encontrado.',
        };
        return;
      }

      const adminUser = await strapi.db
        .query('admin::user')
        .findOne({
          where: {
            email: {
              $eqi: broker.email,
            },
          },
          select: ['id', 'email'],
        });

      if (!adminUser) {
        strapi.log.warn(
          `[broker-admin] Nenhum usuário administrativo encontrado para: ${broker.email}`
        );

        ctx.body = {
          data: [],
          message: 'Nenhum anúncio foi encontrado.',
        };
        return;
      }

      strapi.log.info(
        `[broker-admin] Usuário administrativo associado: ID ${adminUser.id}; e-mail: ${adminUser.email}`
      );

      const metadata = strapi.db.metadata.get(anuncioUid);
      const tableName = metadata.tableName;

      strapi.log.info(
        `[broker-admin] Tabela de anúncios: ${tableName}`
      );

      // DIAGNÓSTICO TEMPORÁRIO: quantidade total de anúncios.
      const totalAnuncios = await strapi.db
        .connection(tableName)
        .count('* as total')
        .first();

      // DIAGNÓSTICO TEMPORÁRIO: amostra dos últimos 10 registros.
      const amostra = await strapi.db
        .connection(tableName)
        .select('id', 'created_by_id', 'document_id')
        .orderBy('id', 'desc')
        .limit(10);

      strapi.log.info(
        `[broker-admin] Diagnóstico: total=${totalAnuncios?.total ?? 0}; amostra=${JSON.stringify(amostra)}`
      );

      const registros = await strapi.db
        .connection(tableName)
        .select('id', 'created_by_id', 'document_id')
        .where('created_by_id', adminUser.id)
        .orderBy('id', 'desc');

      strapi.log.info(
        `[broker-admin] Registros encontrados para o usuário ${adminUser.id}: ${registros.length}`
      );

      const ids = registros.map((registro) => registro.id);

      if (ids.length === 0) {
        strapi.log.warn(
          `[broker-admin] Nenhum anúncio encontrado para o usuário administrativo ${adminUser.id}.`
        );

        ctx.body = {
          data: [],
          message: 'Nenhum anúncio foi encontrado.',
        };
        return;
      }

      const anuncios = await strapi.db
        .query(anuncioUid)
        .findMany({
          where: {
            id: {
              $in: ids,
            },
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
          orderBy: {
            createdAt: 'desc',
          },
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

      const anunciosUnicos = Array.from(
        anunciosPorDocumento.values()
      );

      strapi.log.info(
        `[broker-admin] Anúncios carregados: ${anuncios.length}; anúncios únicos: ${anunciosUnicos.length}`
      );

      ctx.body = {
        data: anunciosUnicos.map((anuncio) => ({
          id: anuncio.id,
          documentId: anuncio.documentId,
          codigo: anuncio.codigo || '—',
          imovel:
            anuncio.nome_exibicao ||
            anuncio.titulo ||
            'Sem título',
          tipo: anuncio.Tipo_de_Anuncio || '—',
          status: anuncio.publishedAt
            ? 'Publicado'
            : 'Rascunho',
          publishedAt: anuncio.publishedAt,
          locale: anuncio.locale || null,
        })),
      };
    } catch (error) {
      strapi.log.error(
        '[broker-admin] Erro ao consultar anúncios do corretor:',
        error
      );

      return ctx.internalServerError(
        'Não foi possível consultar os anúncios do corretor.'
      );
    }
  },
});