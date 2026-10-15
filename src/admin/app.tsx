import type { StrapiApp } from '@strapi/strapi/admin';
import './styles/app.css';

export default {
  config: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    translations: {
      en: {
        'Auth.form.welcome.title': 'Painel ADM TSA Imóveis',
        'Auth.form.welcome.subtitle': 'Acesso para Corretores',
        'content-manager.containers.Edit.submit': 'Entrar',
        'content-manager.plugin.name': 'Publicar Anúncios',
      },
      'pt-BR': {
        'upload.control-utils.add-folder': 'Criar Pasta',
        'upload.header.actions.add-folder': 'Nova Pasta',
        'upload.modal.header.browse': 'Navegar por fotos',
        'upload.modal.header.select-files': 'Selecionar arquivos',
        'Files Upload': 'Enviar arquivos',

        'app.utils.unpublish': 'Inativar',
        'app.utils.published': 'Publicado',
        'global.discard': 'Descartar',
        'app.components.ConfirmDialog.button.confirm': 'Sim, descartar',

        'Auth.form.welcome.title': 'Painel ADM TSA Imóveis',
        'Auth.form.welcome.subtitle': 'Acesso para Corretores',
        'HomePage.header.title': 'Página inicial',
        'HomePage.header.subtitle': 'Bem-vindo ao seu painel de administração.',

        'content-manager.plugin.name': 'Publicar Anúncios',
        'content-manager.utils.entry': 'Registro',
        'content-manager.page.content.edit.title': 'Editando Documento',
        'content-manager.containers.EditView.header.title.new': 'Novo Registro',
        'content-manager.containers.Edit.title.new': 'Criar Novo Registro',
        'content-manager.containers.edit.title.new': 'Criar anúncio',
        'content-manager.page.content.create.title': 'Adicionar Registro',
        'content-manager.EditView.header.title.new': 'Novo Item',

        'HeaderLayout.button.label-add-entry': 'Criar Novo Anúncio',

        'New entry': 'Novo anúncio',
        'Create an entry': 'Criar anúncio',
        'Create new entry': 'Criar anúncio',

        'content-manager.actions.create.label': 'Criar Novo Anúncio',
        'content-manager.containers.ListView.addNewEntry': 'Criar Novo Anúncio',
        'content-manager.pages.ListView.header-subtitle':
          '{number, plural, =0 {Nenhum Imóvel} one {# Imóvel encontrado} other {# Imóveis encontrados}}',

        'content-manager.containers.Edit.reset': 'Resetar formulário',
        'content-manager.containers.Edit.submit.draft': 'Salvar Alterações',
        'content-manager.containers.Edit.tabs.draft': 'Em Edição',
        'content-manager.HeaderLayout.status.draft': 'Rascunho',
        'content-manager.utils.data-status.draft': 'Rascunho',

        'containers.List.draft': 'Rascunho',
        'containers.List.published': 'Publicado',
        'relation.publicationState.draft': 'Rascunho',
        'relation.publicationState.published': 'Publicado',
        'containers.edit.tabs.draft': 'Rascunho',
        'containers.edit.tabs.published': 'Publicado',
        'containers.edit.information.last-published.label': 'Publicado',
        'components.Select.draft-info-title': 'Rascunho',
        'components.Select.publish-info-title': 'Publicado',

        'content-manager.containers.List.draft': 'Rascunho',
        'content-manager.containers.List.published': 'Publicado',
        'content-manager.relation.publicationState.draft': 'Rascunho',
        'content-manager.relation.publicationState.published': 'Publicado',

        'content-manager.actions.discard.label': 'Descartar alterações',
        'content-manager.actions.discard.title': 'Limpar alterações não salvas',
        'content-manager.components.Header.actions.discard': 'Cancelar mudanças',
        'content-manager.popUpWarning.button.confirm': 'Sim, confirmar',
        'content-manager.popUpWarning.bodyMessage':
          'Você tem alterações não salvas. Deseja sair?',
        'content-manager.popUpWarning.warning.has-draft-relations':
          'Este item possui relações em rascunho que podem quebrar no ar.',

        'content-manager.actions.publish.label': 'Publicar agora',
        'content-manager.containers.Edit.publish': 'Publicar Agora',
        'content-manager.actions.unpublish.title': 'Confirmar Despublicação',
        'content-manager.status.draft': 'Rascunho',
        'content-manager.status.published': 'Publicado',
        'content-manager.status.changed': 'Modificado',

        'content-manager.actions.delete.label': 'Excluir Registro',
        'content-manager.actions.delete.title': 'Confirmar Exclusão',
        'content-manager.containers.Edit.delete': 'Excluir este documento',
        'content-manager.actions.clone.label': 'Duplicar Item',

        'content-manager.actions.copy-link.label': 'Copiar Link do Documento',
        'content-manager.actions.copy-link.success': 'Link copiado!',
        'content-manager.actions.preview.label': 'Visualizar Rascunho',

        'content-manager.components.Filters.add': 'Adicionar Filtro',
        'content-manager.components.Filters.title': 'Filtros',
        'content-manager.components.Search.placeholder': 'Buscar conteúdo...',

        'content-manager.components.Relations.add': 'Adicionar nova relação',
        'content-manager.components.Relations.list.empty': 'Nenhum item relacionado',

        'content-manager.components.DynamicZone.add-component': 'Adicionar novo bloco',
        'content-manager.components.DynamicZone.required': 'Este componente é obrigatório',
        'content-manager.components.RepeatableComponent.addNew': 'Adicionar novo item',

        'content-manager.containers.Edit.information': 'Informações do Documento',
        'content-manager.containers.Edit.information.created': 'Data de criação',
        'content-manager.containers.Edit.information.lastUpdate': 'Última modificação',
        'content-manager.containers.Edit.information.by': 'Autor:',
        'content-manager.containers.Edit.information.draft': 'Versão em Rascunho',
        'content-manager.containers.Edit.information.published': 'Versão Publicada',

        'content-manager.components.LeftMenu.navbrand.title': 'Painel Administrativo',
        'content-manager.components.Header.actions.details': 'Mais detalhes',

        'app.components.HomePage.lastEditedEntries': 'Atividade Recente',
        'HomePage.last-edited-entries': 'Atividade Recente',
        'content-manager.containers.HomePage.last-edited-entries': 'Atividade Recente',
      },
    },
  },

  bootstrap(app: StrapiApp) {
    const style = document.createElement('style');

    style.textContent = `
      div:has(> div > input[name="codigo"]),
      div:has(> div > input[name="sortOrder"]),
      div:has(> div > input[name="nome_exibicao"]),
      div:has(> div > input[name="media_folder_id"]) {
        display: none !important;
      }
    `;

    document.head.appendChild(style);

    console.log('Admin TSA Imóveis inicializado');
  },
};