import type { StrapiApp } from '@strapi/strapi/admin';
import './styles/app.css';

export default {
  config: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    translations: {
      "pt-BR": {
         // Botão na Galeria Principal
        'upload.control-utils.add-folder': 'Criar Pasta',
        
        // Botão dentro do Modal de Seleção (Asset Picker)
        'upload.header.actions.add-folder': 'Nova Pasta',
        
        // Chave específica para componentes de "Múltiplas Fotos"
        'upload.modal.header.browse': 'Navegar por fotos',
        'upload.modal.header.select-files': 'Selecionar arquivos',
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
        "app.components.HomePage.lastEditedEntries": "Atividade Recente",
        "HomePage.last-edited-entries": "Atividade Recente",
        "content-manager.containers.HomePage.last-edited-entries": "Atividade Recente",
        
        // Altera o botão de salvar rascunho
        "content-manager.containers.Edit.submit.draft": "Salvar Alterações",
        
        // Altera o status na lista geral (List View)
        "content-manager.utils.data-status.draft": "Rascunho",
       "content-manager.pages.ListView.header-subtitle": "{number, plural, =0 {Nenhum Imóvel} one {# Imóvel encontrado} other {# Imóveis encontrados}}"
      },
    },
  },
  bootstrap(app) {
    console.log('Admin inicializado com novas traduções');

    // Injeção de CSS via JavaScript para garantir que sobrescreva o componente React
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

      html, body {
        font-family: system-ui;
        font-size: 62.5%;
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
      nav[aria-label="Configurações"]
       {
        display: none;
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

      #main-content > div:nth-child(1) > div > div > div > div button,
      #main-content section[plugin::admin.profile-info"],
      section[aria-labelledby="plugin::content-manager.chart-entries"]{
        display: none;
      }
    `;
    document.head.appendChild(style);
    function docReady(fn) {
    // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 4000);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    } 
    
    setTimeout(() => {
       document.querySelector("#strapi > div > div > div > form > div > div > div:nth-child(6) > div > div > label").innerHTML = "Ao finalizar o cadastro você concorda com nossos <a href='https://drive.google.com/file/d/14KrwuRBWVf1IT5m7Iu4FqS7D-bgyIYdE/view?usp=sharing'>Termos de Uso</a>"
    }, 1000);

    docReady(function() {
       var title = document.querySelector('h1')

       if(title.innerHTML.includes('Create an entry')){
        title.innerHTML = 'Criar Novo Anúncio';
       }
       

      let invite = document.createElement("li");

       const contentInvite =`
          <div><span data-state="closed">
            <a aria-label="Adicionar Corretor" class="sc-bgylsh sc-eFtBSE lizKBy bltvKm" href="/admin/settings/users?pageSize=10&page=1&sort=firstname">
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="24" height="20" viewBox="0 0 840.000000 763.000000"
                preserveAspectRatio="xMidYMid meet">

                <g transform="translate(0.000000,763.000000) scale(0.100000,-0.100000)"
                fill="#8e8ea9" stroke="none">
                <path d="M3420 7224 c-19 -2 -78 -9 -130 -15 -485 -55 -974 -303 -1331 -676
                -319 -334 -524 -754 -595 -1218 -35 -229 -20 -550 38 -800 67 -293 233 -633
                423 -870 74 -93 232 -253 325 -328 79 -63 246 -177 261 -177 5 0 9 -4 9 -8 0
                -4 -50 -27 -110 -51 -310 -120 -644 -317 -916 -541 -121 -100 -393 -374 -485
                -490 -274 -345 -461 -686 -594 -1085 -38 -116 -99 -350 -110 -430 l-8 -47 72
                -69 72 -69 3242 0 3243 0 36 48 c56 74 78 115 78 145 0 38 -51 238 -95 372
                -328 991 -1060 1782 -1990 2148 -77 30 -146 57 -154 59 -8 2 19 25 60 50 258
                161 474 374 650 640 429 649 478 1490 127 2181 -334 657 -953 1106 -1670 1212
                -106 15 -380 27 -448 19z"/>
                <path d="M6730 4821 c-70 -22 -121 -65 -156 -131 -17 -32 -19 -67 -22 -417
                l-3 -383 -366 0 c-249 0 -378 -4 -404 -12 -51 -15 -114 -69 -142 -122 -20 -38
                -22 -54 -22 -221 0 -165 2 -183 22 -220 27 -51 67 -89 118 -112 36 -16 79 -18
                418 -21 l377 -3 0 -358 c0 -394 4 -425 60 -493 16 -20 51 -47 77 -60 44 -21
                60 -23 213 -23 113 0 177 4 203 14 50 17 103 64 130 115 21 40 22 52 25 423
                l3 382 382 3 c372 3 383 4 423 25 55 29 109 93 124 147 8 28 11 100 8 208 -3
                163 -3 165 -33 214 -19 30 -49 60 -79 79 l-49 30 -389 3 -388 3 0 368 c0 411
                -3 430 -67 494 -65 65 -89 72 -273 74 -91 1 -176 -2 -190 -6z"/>
                </g>
                </svg>
              <span class="sc-kFCscd ikCpPW">Content Manager</span></a></span>
            </div>
       </li>`;

        let li = document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(3)').after(invite);
       document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(4)').innerHTML = contentInvite;
       document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(5)').style.display = "none";
       document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(6)').style.display = "none";
       
       if(window.location.pathname === "/admin/settings/users") {
        document.querySelector('#main-content div[data-strapi-header] > div > div button').style.display = "block";
       }
      });
    
  },
};