# Plugin Landing Pages — versão administrativa

Plugin de administração para gerenciar a coleção `api::landing-page.landing-page`.

## Recursos
- Lista e edição de landing pages existentes.
- Cadastro de dados gerais e seleção entre Template 1 e Template 2.
- Campos do topo (Sub Título, Título, Descrição, Telefone e imagem de fundo), Conteúdo 1, Galeria e Conteúdo 2.
- Adição, remoção e reordenação de cards e imagens da galeria.
- Salvamento como rascunho e publicação.

## Instalação
Substitua a pasta atual `src/plugins/landing-pages` pelo conteúdo desta pasta, mantendo o nome `landing-pages`. Depois execute a compilação do admin e reinicie o Strapi.

## Observações importantes
- A coleção `Landing Page` e o componente `landing-page.card` precisam estar instalados no projeto.
- Os campos de mídia permitem selecionar arquivos de imagem diretamente. Para criar a pasta de mídia com o nome correto, preencha o Nome do empreendimento antes de enviar a primeira imagem.
- O plugin utiliza os endpoints REST `/api/landing-pages`; as permissões de leitura/criação/atualização e publicação devem estar habilitadas para a conta/role correspondente.
- O campo `tipoTemplate` deve existir na coleção como enum com `template-1` e `template-2`.
