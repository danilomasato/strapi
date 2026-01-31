import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ["pt-BR"],
    translations: {
      "pt-BR": {
          "Files Upload": "Enviar arquivos",
          "app.utils.unpublish": "Inativar",
           "content-manager.containers.Edit.submit.draft": "Salvar Rascunho Personalizado",
          "content-manager.HeaderLayout.status.draft": "Rascunho",
          "content-manager.components.Select.draft-info-title": "Título Customizado",
          "components.Select.draft-info-title": "Título Customizado",
          "content-manager.containers.Edit.draft-info-title": "Título Customizado",
          'content-manager.utils.unpublish': 'Inativar anúncio',
          "content-manager.containers.Edit.publish":"Publicar Agora",
          "content-manager.utils.publish": "Publicar",
          "content-manager.utils.save": "Salvar Rascunho",
          "content-manager.components.PublishPage.draft-info": "Salvar Rascunho",
          "HomePage.header.subtitle": "Bem-vindo ao seu painel de administração.",
          "HomePage.header.title": "Pagina inicial",
          "Auth.form.welcome.title": "Painel ADM TSA Imóveis",
          'Auth.form.welcome.subtitle': 'Faça login para gerenciar o conteúdo',
          "content-manager.containers.Edit.title.create": "Adicionar um novo Anúncio",
          'content-manager.containers.edit.title.new': 'Adicionar Novo Anúncio',
          'content-manager.containers.EditView.header-title.new-entry': 'Nova Publicação',
          "or": "OU",
          "request.error.model.unknown": "Este modelo não existe",
          "skipToContent": "Pular para o conteúdo",
          "submit": "Enviar"
      },
    },
  },
  bootstrap() {},
   async registerTrads({ locales }) {
    const customMessages = {
      "pt-BR": {
        // Opção A (Namespace do plugin)
        "content-manager.containers.Edit.submit.draft": "Salvar Rascunho Personalizado",
        "content-manager.HeaderLayout.status.draft": "Rascunho",
        "content-manager.components.Select.draft-info-title": "Título Customizado",
        // Opção B (Chave global)
        "components.Select.draft-info-title": "Título Customizado",
        // Opção C (Nova hierarquia de Documentos do v5)
        "content-manager.containers.Edit.draft-info-title": "Título Customizado"
      }
    };

    return locales.map((locale) => ({
      data: customMessages[locale] || {},
      locale,
    }));
  },
};