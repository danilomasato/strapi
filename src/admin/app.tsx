import type { StrapiApp } from '@strapi/strapi/admin';
import './styles/app.css';

export default {
  config: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    translations: {
      en: {
        "Auth.form.welcome.title": "Painel ADM TSA Imóveis",
        'Auth.form.welcome.subtitle': 'Acesso para Corretores',
        "content-manager.containers.Edit.submit": "ENtrar"
      },
      "pt-BR": {
        'upload.control-utils.add-folder': 'Criar Pasta',
        'upload.header.actions.add-folder': 'Nova Pasta',
        'upload.modal.header.browse': 'Navegar por fotos',
        'upload.modal.header.select-files': 'Selecionar arquivos',
        "Files Upload": "Enviar arquivos",
        "app.utils.unpublish": "Inativar",
        "app.utils.published": "Publicado",
        "global.discard": "Descartar Alterações",

        'content-manager.utils.entry': 'Registro',
        'content-manager.page.content.edit.title': 'Editar Registro',
        'content-manager.containers.Edit.reset': 'Descartar alterações',
        'content-manager.actions.discard.label': 'Descartar alterações',
        'content-manager.actions.discard.title': 'Descartar rascunho',
        'content-manager.components.Header.actions.discard': 'Cancelar mudanças',
        'content-manager.actions.publish.label': 'Publicar agora',
        'content-manager.actions.delete.label': 'Excluir Registro',
        'content-manager.actions.clone.label': 'Duplicar Item',

        'content-manager.components.Filters.add': 'Adicionar Filtro',
        'content-manager.components.Filters.title': 'Filtros',
        'content-manager.components.Search.placeholder': 'Pesquisar por conteúdo...',

        'content-manager.page.content.edit.title': 'Editando Documento',
        'content-manager.status.draft': 'Rascunho',
        'content-manager.status.published': 'Publicado',
        'content-manager.status.changed': 'Modificado',

        'content-manager.containers.Edit.reset': 'Resetar formulário',
        'content-manager.components.Relations.add': 'Adicionar nova relação',
        'content-manager.components.Relations.list.empty': 'Nenhum item relacionado',

        'content-manager.actions.copy-link.label': 'Copiar Link do Documento',
        'content-manager.actions.copy-link.success': 'Link copiado!',
        'content-manager.actions.preview.label': 'Visualizar Rascunho',

        'content-manager.components.DynamicZone.add-component': 'Adicionar novo bloco',
        'content-manager.components.DynamicZone.required': 'Este componente é obrigatório',
        'content-manager.components.RepeatableComponent.addNew': 'Adicionar novo item',

        'content-manager.containers.Edit.information': 'Informações do Documento',
        'content-manager.containers.Edit.delete': 'Excluir este documento',
        'content-manager.containers.Edit.publish': 'Publicar Agora',

        'content-manager.components.Filters.add': 'Adicionar Filtro',
        'content-manager.components.Search.placeholder': 'Buscar conteúdo...',

        'content-manager.popUpWarning.bodyMessage': 'Você tem alterações não salvas. Deseja sair?',
        'content-manager.popUpWarning.warning.has-draft-relations': 'Este item possui relações em rascunho que podem quebrar no ar.',

        'content-manager.actions.unpublish.title': 'Confirmar Despublicação',
        'content-manager.actions.discard.title': 'Limpar alterações não salvas',
        'content-manager.actions.delete.title': 'Confirmar Exclusão',

        'content-manager.containers.Edit.information.created': 'Data de criação',
        'content-manager.containers.Edit.information.lastUpdate': 'Última modificação',
        'content-manager.containers.Edit.information.by': 'Autor:',

        'content-manager.containers.Edit.information.draft': 'Versão em Rascunho',
        'content-manager.containers.Edit.information.published': 'Versão Publicada',

        'content-manager.components.LeftMenu.navbrand.title': 'Painel Administrativo',
        'content-manager.components.Header.actions.details': 'Mais detalhes',

        'content-manager.popUpWarning.button.confirm': 'Sim, descartar',
        'global.discard': 'Descartar',
        'app.components.ConfirmDialog.button.confirm': 'Sim, descartar',

        'content-manager.containers.EditView.header.title.new': 'Novo Registro',
        'content-manager.containers.Edit.title.new': 'Criar Novo Registro',
        'content-manager.page.content.create.title': 'Adicionar Registro',
        'content-manager.EditView.header.title.new': 'Novo Item',

        "HomePage.header.subtitle": "Bem-vindo ao seu painel de administração.",
        "HomePage.header.title": "Pagina inicial",
        "Auth.form.welcome.title": "Painel ADM TSA Imóveis",
        'Auth.form.welcome.subtitle': 'Acesso para Corretores',

        "content-manager.containers.Edit.submit.draft": "Salvar Alterações",
        "content-manager.containers.Edit.tabs.draft": "Em Edição",
        "content-manager.HeaderLayout.status.draft": "Rascunho",
        "app.components.HomePage.lastEditedEntries": "Atividade Recente",
        "HomePage.last-edited-entries": "Atividade Recente",
        "content-manager.containers.HomePage.last-edited-entries": "Atividade Recente",
        "content-manager.containers.Edit.submit.draft": "Salvar Alterações",
        "content-manager.utils.data-status.draft": "Rascunho",

        "content-manager.pages.ListView.header-subtitle": "{number, plural, =0 {Nenhum Imóvel} one {# Imóvel encontrado} other {# Imóveis encontrados}}"
      },
    },
  },

  bootstrap(app) {
    console.log('Admin inicializado com novas traduções');

    const style = document.createElement('style');

    style.innerHTML = `
      div, span, applet, object, iframe,
      h3, h4, h5, h6, p, blockquote, pre,
      a, abbr, acronym, address, big, cite, code,
      del, dfn, em, img, ins, kbd, q, s, samp,
      small, strike, strong, sub, sup, tt, var,
      b, u, i, center,
      dl, dt, dd, ol, ul, li,
      fieldset, form, label, legend,
      table, caption, tbody, tfoot, thead, tr, th, td,
      article, aside, canvas, details, embed,
      figure, figcaption, footer, header, hgroup,
      menu, nav, output, ruby, section, summary,
      time, mark, audio, video {
        padding: unset;
        margin: unset;
        list-style: none;
      }

      #main-content input[name="codigo"] {
        background-color: #e0e0e0;
        cursor: not-allowed;
      }

      #main-content section[data-strapi-widget-id="plugin::content-manager.last-edited-entries"] svg + h2 {
        visibility: hidden;
      }

      #main-content section[data-strapi-widget-id="plugin::content-manager.last-edited-entries"] svg + h2::before {
        content: "Atividades Recentes";
        visibility: visible;
      }

      #main-content section[data-strapi-widget-id="plugin::content-manager.last-published-entries"] svg + h2 {
        visibility: hidden;
      }

      #main-content section[data-strapi-widget-id="plugin::content-manager.last-published-entries"] svg + h2::before {
        content: "Últimas publicações";
        visibility: visible;
      }

      #strapi div[data-orientation="horizontal"] + div > ul > li:nth-child(1),
      main[aria-labelledby="main-content-title"] div:nth-child(2) > div button[aria-haspopup="dialog"]:nth-child(2),
      #strapi div[data-orientation="horizontal"] + div > ul > li:nth-child(2) svg path,
      #main-content div[data-strapi-header] > div > div button,
      div[data-radix-scroll-area-viewport] > div > div:nth-child(2) > ul > li:nth-child(1) > div > div > div > div:nth-child(2),
      div[data-radix-scroll-area-viewport] > div > div:nth-child(2) > ul > li:nth-child(2),
      nav[aria-label="Configurações"] {
        display: none;
      }

      /* Oculta somente o item do Content Manager */
      nav[aria-label="Conteúdo"] ul > li:first-child,
      nav[aria-label="Conteúdo"] a[href*="content-manager"],
      nav a[href*="/content-manager"] {
        display: none !important;
      }

      #strapi div[data-orientation="horizontal"] + div > ul > li:nth-child(2) svg {
        width: 20px;
        height: 20px;
        background-size: contain;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="%238e8ea9" aria-hidden="true" focusable="false"><path d="M28 14.444V26a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14.444a2 2 0 0 1 .646-1.473l10-9.435.014-.013a2 2 0 0 1 2.705.013l10 9.435A2 2 0 0 1 28 14.444"></path></svg>');
      }

      section[aria-labelledby="plugin::admin.profile-info"] header > div + a {
        visibility: hidden;
      }

      section[aria-labelledby="plugin::admin.profile-info"] header > div + a::after {
        content: "Configurações de perfil";
        visibility: visible;
      }

      section[aria-labelledby="plugin::admin.profile-info"] header > div h2 {
        visibility: hidden;
      }

      section[aria-labelledby="plugin::admin.profile-info"] header > div h2::before {
        content: "Perfil";
        visibility: visible;
      }

      div[role="dialog"] div > div > div:nth-child(2) > button {
        text-indent: -99999px;
      }

      div[role="dialog"] div > div > div:nth-child(2) > button:nth-child(1)::after {
        content: "Criar Pasta" !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        text-transform: none !important;
        text-indent: 0;
      }

      #main-content > form h1 {
        position: relative;
        color: #000 !important;
        text-indent: -99999px;
      }

      #main-content > form h1::after {
        font-size: 2rem;
        position: absolute;
        left: 0;
        text-indent: 0;
        content: "Anúncio" !important;
      }

      #main-content aside:nth-child(2) {
        display: none !important;
      }

      #main-content div[role="tablist"] > button > span:nth-child(1) {
        visibility: hidden;
        text-indent: -190px;
      }

      #main-content div[role="tablist"] > button > span:nth-child(1)::after {
        content: 'Rascunho';
        visibility: visible;
      }

      #main-content div[role="tablist"] > button:nth-child(2) > span {
        visibility: hidden;
        text-indent: -190px;
      }

      #main-content div[role="tablist"] > button:nth-child(2) > span::after {
        content: 'Publicado';
        visibility: visible;
      }

      #main-content span input {
        color: #000 !important;
      }

      div[role="dialog"] div > div > div:nth-child(2) > button:nth-child(1) {
        text-indent: -99999px;
      }

      nav[aria-label="Conteúdo"] ul li:nth-child(1) span {
        visibility: hidden;
        font-size: 0;
      }

      nav ul li:nth-child(4) span {
        font-size: 0;
      }

      nav[aria-label="Conteúdo"] ul li:nth-child(1) span::before {
        content: 'Gerenciador de Conteúdo';
        visibility: visible;
        font-size: 1.1rem;
        font-weight: bold;
        margin-top: 10px;
        display: block;
      }

      div[role="dialog"] form > div > div > div > div > div:nth-child(2) {
        display: none !important;
      }

      div[role="dialog"] form[method="POST"] > div > div > div > div > div:nth-child(2) {
        display: block !important;
      }

      div[data-state="open"] form > header h2 {
        content: '';
        margin-left: -240px;
      }

      div[data-state="open"] form > header h2::after {
        content: 'Adiocionar mídia';
        text-indent: 0;
        margin-left: 100px;
      }

      div[role="dialog"] form > footer > div > button {
        text-indent: -999px;
        margin-left: -100px;
      }

      div[role="dialog"] form > footer > div > button::after {
        content: 'Criar Pasta';
        visibility: visible;
        text-indent: 0;
      }

      #main-content span[aria-live="assertive"] + div[aria-describedby] {
        height: 300px;
      }

      #main-content > div:nth-child(1) > div > div > div > div > button span:nth-child(2) {
        font-size: 0;
      }

      #main-content > div:nth-child(1) > div > div > div > div > button span:nth-child(2)::before {
        content: 'Convidar Corretor(a)';
        font-size: 1.2rem;
      }

      #main-content > form > div:nth-child(1) > div > div > div > div > button span,
      #main-content > div:nth-child(1) > div > div > div > div > button span {
        float: left;
        margin-right: 5px;
      }

      #main-content div[data-strapi-header] > div > div button span:nth-child(1) {
        float: left;
        margin-right: 5px;
      }

      #main-content > div:nth-child(1) > div > div > div > div button,
      #main-content section[plugin::admin.profile-info"],
      section[aria-labelledby="plugin::content-manager.chart-entries"] {
        display: none;
      }

      /* Mantém o link de Corretores visível */
      [data-tsa-corretores-item] {
        display: list-item !important;
      }

      [data-tsa-corretores-item] a {
        display: flex;
        align-items: center;
      }
    `;

    document.head.appendChild(style);

    function docReady(fn: () => void) {
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        window.setTimeout(fn, 6000);
      } else {
        document.addEventListener("DOMContentLoaded", fn);
      }
    }

    // Ajustes da tela de cadastro e convite de corretores.
    window.setTimeout(() => {
      const terms = document.querySelector(
        "#strapi > div > div > div > form > div > div > div:nth-child(6) > div > div > label"
      );

      if (terms) {
        terms.innerHTML =
          "Ao finalizar o cadastro você concorda com nossos <a href='https://drive.google.com/file/d/14KrwuRBWVf1IT5m7Iu4FqS7D-bgyIYdE/view?usp=sharing'>Termos de Uso</a>";
      }

      if (window.location.pathname === "/admin/settings/users") {
        const inviteButton = document.querySelector(
          '#main-content div[data-strapi-header] > div > div button'
        ) as HTMLButtonElement | null;

        if (inviteButton) {
          inviteButton.style.display = "block";

          const buttonText = inviteButton.querySelector(
            'span:nth-child(2)'
          );

          if (buttonText) {
            buttonText.innerHTML = "Convidar Corretor";
          }
        }
      }
    }, 3000);


    function updateCorretoresMenu() {
      const menus = document.querySelectorAll(
        'div[data-orientation="horizontal"] + div ul'
      );
    }

    function updatePluginMenuVisibility() {
      const menus = document.querySelectorAll(
        'div[data-orientation="horizontal"] + div ul'
      );

      menus.forEach((menuElement) => {
        const menu = menuElement as HTMLUListElement;

        Array.from(menu.children).forEach((child) => {
          if (!(child instanceof HTMLLIElement)) return;

          const isCorretores = child.hasAttribute('data-tsa-corretores-item');
          const link = child.querySelector('a[href]') as HTMLAnchorElement | null;
          const href = link?.getAttribute('href') || '';

          const normalizedHref = href.toLowerCase().split('?')[0].replace(/\/+$/, '');

          // Oculta a Biblioteca de mídia, independentemente de
          // ela estar identificada como /plugins/upload ou /upload.
          const isMediaLibrary =
            normalizedHref.endsWith('/upload') ||
            normalizedHref.includes('/plugins/upload/');

          const isPlugin =
            /\/plugins(?:\/|$)/i.test(normalizedHref) &&
            !isMediaLibrary;

          if (isCorretores || isPlugin) {
            child.style.setProperty('display', 'list-item', 'important');
          } else {
            child.style.setProperty('display', 'none', 'important');
          }
        });
      });
    }

    function updateSidebar() {
      updateCorretoresMenu();
      updatePluginMenuVisibility();
    }

    /*
     * OBSERVADOR INICIADO IMEDIATAMENTE
     *
     * Antes, o observer era iniciado somente depois do docReady,
     * que aguardava 6 segundos. Agora ele começa assim que o
     * bootstrap é executado, acompanhando a montagem inicial
     * e as reconstruções posteriores do menu pelo React.
     */

    updateSidebar();

    const menuObserver = new MutationObserver(() => {
      updateSidebar();
    });

    menuObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Mantém os ajustes que dependem da tela já carregada.
    docReady(() => {
      const title = document.querySelector('h1');

      if (title && title.innerHTML.includes('Create an entry')) {
        title.innerHTML = 'Criar Novo Anúncio';
      }

      updateSidebar();
    });
  },
};