import type { StrapiApp } from '@strapi/strapi/admin';
import './styles/app.css';

export default {
  config: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    translations: {
      "pt-BR": {
          "upload.header.actions.add-assets": "Carregar novo arquivo",
          "upload.header.actions.create-folder": "Criar pasta personalizada",
          "Files Upload": "Enviar arquivos",
          "app.utils.unpublish": "Inativar",
          "app.utils.published": "Publicado",
          "global.discard": "Descartar Alterações",

          // Altera referências genéricas de "Entry" para o seu termo (ex: "Registro" ou "Item")
          'content-manager.utils.entry': 'Registro',
          'content-manager.page.content.edit.title': 'Editar Registro',
          'content-manager.containers.Edit.reset': 'Descartar alterações',
          'content-manager.actions.discard.label': 'Descartar alterações',
          'content-manager.actions.discard.title': 'Descartar rascunho',
          'content-manager.components.Header.actions.discard': 'Cancelar mudanças',
          'content-manager.actions.publish.label': 'Publicar agora',
          'content-manager.actions.delete.label': 'Excluir Registro',
          'content-manager.actions.clone.label': 'Duplicar Item',
          // --- BUSCA E FILTROS ---
          'content-manager.components.Filters.add': 'Adicionar Filtro',
          'content-manager.components.Filters.title': 'Filtros',
          'content-manager.components.Search.placeholder': 'Pesquisar por conteúdo...',
          // --- CABEÇALHO E ESTADOS ---
          'content-manager.page.content.edit.title': 'Editando Documento',
          'content-manager.status.draft': 'Rascunho',
          'content-manager.status.published': 'Publicado',
          'content-manager.status.changed': 'Modificado',
          // --- BARRA LATERAL E RELAÇÕES ---
          'content-manager.containers.Edit.reset': 'Resetar formulário',
          'content-manager.components.Relations.add': 'Adicionar nova relação',
          'content-manager.components.Relations.list.empty': 'Nenhum item relacionado',
            // --- MAIS AÇÕES DO DROPDOWN ---
          'content-manager.actions.copy-link.label': 'Copiar Link do Documento',
          'content-manager.actions.copy-link.success': 'Link copiado!',
          'content-manager.actions.preview.label': 'Visualizar Rascunho',
          
          // --- CAMPOS DINÂMICOS E COMPONENTES ---
          'content-manager.components.DynamicZone.add-component': 'Adicionar novo bloco',
          'content-manager.components.DynamicZone.required': 'Este componente é obrigatório',
          'content-manager.components.RepeatableComponent.addNew': 'Adicionar novo item',
          
          // --- BARRA LATERAL (SIDEBAR) ---
          'content-manager.containers.Edit.information': 'Informações do Documento',
          'content-manager.containers.Edit.delete': 'Excluir este documento',
          'content-manager.containers.Edit.publish': 'Publicar Agora',
  
          // --- FILTROS E BUSCA NO DROPDOWN ---
          'content-manager.components.Filters.add': 'Adicionar Filtro',
          'content-manager.components.Search.placeholder': 'Buscar conteúdo...',
          
          // --- MODAIS DE ERRO/AVISO ---
          'content-manager.popUpWarning.bodyMessage': 'Você tem alterações não salvas. Deseja sair?',
          'content-manager.popUpWarning.warning.has-draft-relations': 'Este item possui relações em rascunho que podem quebrar no ar.',
          // --- TÍTULOS DOS MODAIS (Pops-ups) ---
          'content-manager.actions.unpublish.title': 'Confirmar Despublicação',
          'content-manager.actions.discard.title': 'Limpar alterações não salvas',
          'content-manager.actions.delete.title': 'Confirmar Exclusão',
          // --- INFORMAÇÕES DO DOCUMENTO (Sidebar) ---
          'content-manager.containers.Edit.information.created': 'Data de criação',
          'content-manager.containers.Edit.information.lastUpdate': 'Última modificação',
          'content-manager.containers.Edit.information.by': 'Autor:',
          
          // --- ESTADOS DO DOCUMENTO ---
          'content-manager.containers.Edit.information.draft': 'Versão em Rascunho',
          'content-manager.containers.Edit.information.published': 'Versão Publicada',

          // --- SEÇÃO DE "MAIS INFORMAÇÕES" ---
          'content-manager.components.LeftMenu.navbrand.title': 'Painel Administrativo',
          'content-manager.components.Header.actions.details': 'Mais detalhes',
          // Texto que aparece dentro do botão de confirmação após clicar
          'content-manager.popUpWarning.button.confirm': 'Sim, descartar',
          // Modal de confirmação (Geral)
          'content-manager.popUpWarning.button.confirm': 'Sim, confirmar',
          'global.discard': 'Descartar',
          'app.components.ConfirmDialog.button.confirm': 'Sim, descartar',
          // Caso seja o texto do modal que abre ao clicar:
          'content-manager.popUpWarning.button.confirm': 'Sim, descartar',
          'content-manager.containers.EditView.header.title.new': 'Novo Registro',
          'content-manager.containers.Edit.title.new': 'Criar Novo Registro',
          'content-manager.page.content.create.title': 'Adicionar Registro',
          'content-manager.EditView.header.title.new': 'Novo Item',
          "HomePage.header.subtitle": "Bem-vindo ao seu painel de administração.",
          "HomePage.header.title": "Pagina inicial",
          "Auth.form.welcome.title": "Painel ADM TSA Imóveis",
          'Auth.form.welcome.subtitle': 'Acesso para Corretores',
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
  bootstrap(app) {
    console.log('Admin inicializado com novas traduções');
  },
};