import { factories } from '@strapi/strapi';

type BrokerHttpError = Error & {
  status: number;
};

const createHttpError = (
  message: string,
  status: number
): BrokerHttpError => {
  const error = new Error(message) as BrokerHttpError;
  error.status = status;
  return error;
};

export default factories.createCoreService(
  'api::broker.broker',
  ({ strapi }) => ({
    async register(ctx: any) {
      let adminUser: any = null;
      let broker: any = null;
      let uploadedFile: any = null;

      const uploadService = strapi.plugin('upload').service('upload');

      try {
        const body = ctx.request.body ?? {};

        const nome = String(body.nome ?? '').trim();
        const sobrenome = String(body.sobrenome ?? '').trim();
        const email = String(body.email ?? '').trim().toLowerCase();
        const password = String(body.password ?? '');
        const creci = String(body.creci ?? '').replace(/\D/g, '');

        const files = ctx.request.files ?? {};

        const receivedFile =
          files.credencialCreci ??
          files.creciFile ??
          files.file ??
          files.files;

        if (!nome || !sobrenome || !email || !password || !creci) {
          throw createHttpError(
            'Preencha todos os campos obrigatórios.',
            400
          );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw createHttpError(
            'Informe um endereço de e-mail válido.',
            400
          );
        }

        if (
          password.length < 8 ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password) ||
          !/\d/.test(password) ||
          !/[^A-Za-z0-9]/.test(password)
        ) {
          throw createHttpError(
            'A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial.',
            400
          );
        }

        if (!/^\d{6}$/.test(creci)) {
          throw createHttpError(
            'O CRECI deve conter 6 dígitos.',
            400
          );
        }

        const file = Array.isArray(receivedFile)
          ? receivedFile[0]
          : receivedFile;

        if (!file || typeof file !== 'object') {
          strapi.log.error(
            `[CRECI DEBUG] Nenhum arquivo reconhecido. Campos recebidos: ${Object.keys(files).join(', ')}`
          );

          throw createHttpError(
            'Envie o arquivo da credencial CRECI.',
            400
          );
        }

        const fileName = String(
          file.name ??
          file.originalFilename ??
          file.originalname ??
          ''
        ).trim();

        const filePath = String(
          file.path ??
          file.filepath ??
          ''
        ).trim();

        const mimeType = String(
          file.type ??
          file.mimetype ??
          ''
        ).trim().toLowerCase();

        const extensionSource = fileName || filePath;
        const extensionMatch = extensionSource.match(/\.(pdf|jpe?g|png)$/i);

        const extension = extensionMatch
          ? `.${extensionMatch[1].toLowerCase()}`
          : '';

        strapi.log.info(
          `[CRECI DEBUG] ${JSON.stringify({
            fields: Object.keys(files),
            name: file.name,
            originalFilename: file.originalFilename,
            originalname: file.originalname,
            path: file.path,
            filepath: file.filepath,
            type: file.type,
            mimetype: file.mimetype,
            size: file.size,
            detectedExtension: extension,
          })}`
        );

        const allowedExtensions = [
          '.pdf',
          '.jpg',
          '.jpeg',
          '.png',
        ];

        if (!allowedExtensions.includes(extension)) {
          throw createHttpError(
            'Não foi possível identificar o formato da credencial. Envie um arquivo PDF, JPG, JPEG ou PNG.',
            400
          );
        }

        const allowedMimeTypesByExtension: Record<string, string[]> = {
          '.pdf': [
            'application/pdf',
            'application/x-pdf',
            'application/octet-stream',
            'binary/octet-stream',
            '',
          ],
          '.jpg': [
            'image/jpeg',
            'image/jpg',
            'image/pjpeg',
            'application/octet-stream',
            'binary/octet-stream',
            '',
          ],
          '.jpeg': [
            'image/jpeg',
            'image/jpg',
            'image/pjpeg',
            'application/octet-stream',
            'binary/octet-stream',
            '',
          ],
          '.png': [
            'image/png',
            'application/octet-stream',
            'binary/octet-stream',
            '',
          ],
        };

        if (
          mimeType &&
          !allowedMimeTypesByExtension[extension].includes(mimeType)
        ) {
          strapi.log.warn(
            `[CRECI] MIME type inesperado: ${mimeType}; extensão: ${extension}`
          );
        }

        const fileSize = Number(file.size ?? 0);
        const maxFileSize = 10 * 1024 * 1024;

        if (!Number.isFinite(fileSize) || fileSize <= 0) {
          throw createHttpError(
            'Não foi possível identificar o tamanho do arquivo enviado.',
            400
          );
        }

        if (fileSize > maxFileSize) {
          throw createHttpError(
            'O arquivo da credencial não pode ultrapassar 10 MB.',
            400
          );
        }

        const existingBroker = await strapi.db
          .query('api::broker.broker')
          .findOne({
            where: {
              email: { $eqi: email },
            },
          });

        if (existingBroker) {
          throw createHttpError(
            'Já existe um corretor cadastrado com este e-mail.',
            409
          );
        }

        const existingAdminUser = await strapi.db
          .query('admin::user')
          .findOne({
            where: {
              email: { $eqi: email },
            },
          });

        if (existingAdminUser) {
          throw createHttpError(
            'Já existe um usuário administrativo com este e-mail.',
            409
          );
        }

        const editorRole = await strapi.db
          .query('admin::role')
          .findOne({
            where: {
              code: 'strapi-editor',
            },
          });

        if (!editorRole) {
          throw createHttpError(
            'O perfil administrativo Editor não foi encontrado no Strapi.',
            500
          );
        }

        adminUser = await strapi.admin.services.user.create({
          email,
          firstname: nome,
          lastname: sobrenome,
          password,
          isActive: true,
          roles: [editorRole.id],
        });

        broker = await strapi.documents('api::broker.broker').create({
          data: {
            nome,
            sobrenome,
            email,
            creci,
          },
          status: 'published',
        });

        const uploadResult = await uploadService.upload({
          data: {
            fileInfo: {
              name: fileName,
              alternativeText: `Credencial CRECI de ${nome} ${sobrenome}`,
              caption: `Credencial CRECI - ${creci}`,
            },
          },
          files: file,
        });

        uploadedFile = Array.isArray(uploadResult)
          ? uploadResult[0]
          : uploadResult;

        if (!uploadedFile?.id) {
          throw createHttpError(
            'Não foi possível salvar o arquivo da credencial CRECI.',
            500
          );
        }

        await strapi.documents('api::broker.broker').update({
          documentId: broker.documentId,
          data: {
            credencialCreci: uploadedFile.id,
          },
          status: 'published',
        });

        return {
          success: true,
          message: 'Corretor cadastrado com sucesso.',
          data: {
            id: broker.id,
            documentId: broker.documentId,
            nome,
            sobrenome,
            email,
            creci,
          },
        };
      } catch (error: unknown) {
        const err =
          error instanceof Error
            ? (error as BrokerHttpError)
            : createHttpError(
                'Erro inesperado ao cadastrar corretor.',
                500
              );

        const status =
          typeof err.status === 'number' ? err.status : 500;

        if (broker?.documentId) {
          try {
            await strapi.documents('api::broker.broker').delete({
              documentId: broker.documentId,
            });
          } catch (rollbackError: unknown) {
            strapi.log.error(
              `Falha ao remover o corretor durante a reversão: ${
                rollbackError instanceof Error
                  ? rollbackError.message
                  : String(rollbackError)
              }`
            );
          }
        }

        if (uploadedFile?.id) {
          try {
            await uploadService.remove(uploadedFile);
          } catch (rollbackError: unknown) {
            strapi.log.error(
              `Falha ao remover a credencial durante a reversão: ${
                rollbackError instanceof Error
                  ? rollbackError.message
                  : String(rollbackError)
              }`
            );
          }
        }

        if (adminUser?.id) {
          try {
            await strapi.db.query('admin::user').delete({
              where: { id: adminUser.id },
            });
          } catch (rollbackError: unknown) {
            strapi.log.error(
              `Falha ao remover o usuário administrativo durante a reversão: ${
                rollbackError instanceof Error
                  ? rollbackError.message
                  : String(rollbackError)
              }`
            );
          }
        }

        strapi.log.error(
          `Erro no cadastro do corretor: ${err.message}`
        );

        ctx.status = status;
        ctx.body = {
          error: {
            status,
            name: err.name || 'InternalServerError',
            message: err.message || 'Erro ao cadastrar corretor.',
          },
        };

        throw err;
      }
    },
  })
);