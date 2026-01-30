import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ["pt-BR"],
    translations: {
      "pt-BR": {
          "Files Upload": "Enviar arquivos",
          "content-manager.containers.Edit.publish":"Publicar Agora",
          "content-manager.utils.publish": "Publicar",
          "content-manager.utils.save": "Salvar Rascunho",
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
        "content-manager.containers.EditView.add.new-entry": "Cadastrar Novo Item",
        "content-manager.HeaderLayout.button.label-add": "Adicionar" 
      },
      "en": {
        "content-manager.containers.EditView.add.new-entry": "Create New Record",
        "content-manager.HeaderLayout.button.label-add": "Add"
      }
    };

    const result = locales.map((locale) => {
      return {
        data: customMessages[locale] || {},
        locale,
      };
    });

    return Promise.resolve(result);
  },
};