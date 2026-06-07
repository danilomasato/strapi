import jwt from 'jsonwebtoken';

export default () => {
  return async (ctx, next) => {
    if (ctx.path === '/upload/folders') {
      const auth = ctx.request.headers.authorization;

      if (auth?.startsWith('Bearer ')) {
        const token = auth.replace('Bearer ', '');
        const payload: any = jwt.decode(token);

        const userId = Number(payload.userId);

        ctx.query.filters = {
          $and: [
            ...(ctx.query.filters?.$and || []),
            {
              createdBy: {
                id: {
                  $eq: userId,
                },
              },
            },
          ],
        };
      }
    }

    await next();
  };
};