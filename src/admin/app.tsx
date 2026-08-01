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
        // Add more key/value pairs here
      },
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
     
    `;
    document.head.appendChild(style);

   function docReady(fn) {
    // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 6000);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    } 
    
    setTimeout(() => {
      const terms = document.querySelector("#strapi > div > div > div > form > div > div > div:nth-child(6) > div > div > label");
      if(terms)
      terms.innerHTML = "Ao finalizar o cadastro você concorda com nossos <a href='https://drive.google.com/file/d/14KrwuRBWVf1IT5m7Iu4FqS7D-bgyIYdE/view?usp=sharing'>Termos de Uso</a>"
      
      if(window.location.pathname === "/admin/settings/users") {
        document.querySelector('#main-content div[data-strapi-header] > div > div button').style.display = "block";
        document.querySelector('#main-content div[data-strapi-header] > div > div button span:nth-child(2)').innerHTML = "Convidar Corretor";
       }
    }, 3000);

    docReady(function() {
       const title = document.querySelector('h1')

       if(title && title.innerHTML.includes('Create an entry')){
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
              </a></span>
            </div>
       </li>`;

        let li = document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(3)').after(invite);
       console.log(document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(4)'))
        if(document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(4)'))
        document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(4)').innerHTML = contentInvite;
      //  if(document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(5)'))
      //   document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(5)').style.display = "none";
      //  if(document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(6)'))
      //   document.querySelector('div[data-orientation="horizontal"] + div ul li:nth-child(6)').style.display = "none";
   
      });
    
  },
};