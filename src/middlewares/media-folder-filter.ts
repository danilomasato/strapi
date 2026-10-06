import jwt from 'jsonwebtoken';

export default () => {
  return async (ctx, next) => {
    if (ctx.path === '/upload/folders') {
      const auth = ctx.request.headers.authorization;

      let userId: number | null = null;

      /*
       * Preferimos o usuário já autenticado pelo Strapi.
       */
      if (ctx.state?.user?.id) {
        userId = Number(ctx.state.user.id);
      }

      /*
       * Fallback para o JWT caso o usuário não esteja disponível
       * em ctx.state.user.
       */
      if (!userId && auth?.startsWith('Bearer ')) {
        try {
          const token = auth.replace('Bearer ', '');
          const payload: any = jwt.decode(token);

          if (payload) {
            const tokenUserId =
              payload.userId ??
              payload.id ??
              payload.sub;

            if (
              tokenUserId !== undefined &&
              tokenUserId !== null
            ) {
              const parsedUserId = Number(tokenUserId);

              if (Number.isFinite(parsedUserId)) {
                userId = parsedUserId;
              }
            }
          }
        } catch (error) {
          userId = null;
        }
      }

      /*
       * TESTE:
       *
       * Mostra as últimas pastas criadas no Media Library,
       * incluindo o proprietário registrado no banco.
       *
       * Assim conseguimos verificar qual foi a pasta criada
       * pelo anúncio novo sem precisar informar manualmente
       * o ID da pasta.
       */
      try {
        const pastasRecentes = await strapi.db.connection
          .select(
            'id',
            'name',
            'created_by_id',
            'updated_by_id'
          )
          .from('upload_folders')
          .orderBy('id', 'desc')
          .limit(10);

        console.log(
          'MEDIA LIBRARY :: últimas pastas:',
          pastasRecentes
        );
      } catch (error) {
        console.error(
          'MEDIA LIBRARY :: erro ao consultar pastas:',
          error
        );
      }

      console.log(
        'MEDIA LIBRARY :: userId:',
        userId
      );

      /*
       * Se conseguimos identificar o usuário,
       * aplicamos o filtro para mostrar somente
       * as pastas criadas por ele.
       */
      if (userId) {
        const existingFilters = ctx.query.filters;

        const existingAnd =
          existingFilters?.$and &&
          Array.isArray(existingFilters.$and)
            ? existingFilters.$and
            : [];

        console.log(
          'MEDIA LIBRARY :: filtros originais:',
          JSON.stringify(
            existingFilters,
            null,
            2
          )
        );

        ctx.query.filters = {
          $and: [
            ...existingAnd,
            {
              createdBy: {
                id: {
                  $eq: userId,
                },
              },
            },
          ],
        };

        console.log(
          'MEDIA LIBRARY :: filtros finais:',
          JSON.stringify(
            ctx.query.filters,
            null,
            2
          )
        );
      } else {
        /*
         * Sem usuário identificado, não retornamos nenhuma pasta.
         */
        ctx.query.filters = {
          $and: [
            ...(ctx.query.filters?.$and || []),
            {
              id: {
                $eq: -1,
              },
            },
          ],
        };

        console.log(
          'MEDIA LIBRARY :: nenhum usuário identificado; pastas bloqueadas.'
        );
      }
    }

    await next();
  };
};