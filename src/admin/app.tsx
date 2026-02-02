import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ["pt-BR"],
    translations: {
      "pt-BR": {
          "Files Upload": "Enviar arquivos",
          "app.utils.unpublish": "Inativar",
          "HomePage.header.subtitle": "Bem-vindo ao seu painel de administração.",
          "HomePage.header.title": "Pagina inicial",
          "Auth.form.welcome.title": "Painel ADM TSA Imóveis",
          'Auth.form.welcome.subtitle': 'Faça login para gerenciar o conteúdo',
           "content-manager.containers.Edit.submit.draft": "Salvar Alterações",
           // Altera o texto da aba (Tab) no topo da página de edição
        "content-manager.containers.Edit.tabs.draft": "Em Edição",
        
        // Altera o badge de status no cabeçalho (HeaderLayout)
        "content-manager.HeaderLayout.status.draft": "Rascunho",
        
        // Altera o botão de salvar rascunho
        "content-manager.containers.Edit.submit.draft": "Salvar Alterações",
        
        // Altera o status na lista geral (List View)
        "content-manager.utils.data-status.draft": "Rascunho",
      },
    },
  },
  bootstrap(app: any) {
    console.log("Admin iniciado");
  },
};