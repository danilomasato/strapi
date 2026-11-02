# Plugin Landing Pages — versão administrativa

Plugin de administração para gerenciar a coleção `api::landing-page.landing-page`.

## Recursos
- Lista e edição de landing pages existentes.
- Cadastro de dados gerais e seleção entre Template 1 e Template 2.
- Campos do topo (Sub Título, Título, Descrição, Telefone e imagem de fundo), Conteúdo 1, Galeria e Infraestrutura e lazer.
- Endereço do empreendimento em Dados gerais, utilizado pelo front-end para montar o mapa.
- Campos de subtítulo, título e descrição da infraestrutura, além de dez opções booleanas para controlar os ícones exibidos no site.
- Adição, remoção e reordenação de cards e imagens da galeria.
- Salvamento como rascunho e publicação.

## Instalação
Substitua a pasta atual `src/plugins/landing-pages` pelo conteúdo desta pasta, mantendo o nome `landing-pages`. Depois execute a compilação do admin e reinicie o Strapi.

## Novos campos do Content-Type

O ZIP atualiza o plugin administrativo. A coleção `api::landing-page.landing-page` é definida no projeto Strapi e não estava incluída no ZIP original. Por isso, o arquivo `CAMPOS-DO-CONTENT-TYPE.json` contém os atributos que precisam ser incorporados ao objeto `attributes` do arquivo `src/api/landing-page/content-types/landing-page/schema.json` do projeto Strapi. Faça essa inclusão antes de utilizar os novos campos e reinicie/recompile o Strapi. Sem esses atributos no Content-Type, o painel poderá exibir os campos, mas o Strapi não terá onde persistir seus valores.

Os campos antigos `tituloConteudo2` e `cardsConteudo2` deixam de ser apresentados e enviados pelo formulário. Eles não são apagados automaticamente do banco de dados.

## Observações importantes
- A coleção `Landing Page` e o componente `landing-page.card` precisam estar instalados no projeto.
- Os campos de mídia permitem selecionar arquivos de imagem diretamente. Para criar a pasta de mídia com o nome correto, preencha o Nome do empreendimento antes de enviar a primeira imagem.
- A listagem, criação, edição e exclusão de landing pages são feitas por rotas administrativas autenticadas do plugin, usando a sessão do painel e o Document Service do Strapi. Não é necessário liberar as operações da coleção em Users & Permissions nem usar um token da Content API no navegador.
- O campo `tipoTemplate` deve existir na coleção como enum com `template-1` e `template-2`.

## Integração com a API da Hostinger

O plugin cria o subdomínio ao salvar uma nova landing page, cria o novo prefixo antes de alterar um subdomínio existente e tenta remover o prefixo anterior após salvar a alteração. A ação **Excluir** na listagem tenta remover o subdomínio na Hostinger e, em seguida, o registro da coleção.

Configure estas variáveis de ambiente no servidor Strapi (nunca no painel do navegador):

```env
HOSTINGER_API_TOKEN=seu_token_da_hostinger
HOSTINGER_ACCOUNT_USERNAME=u956524612
HOSTINGER_WEBSITE_DOMAIN=tudosobreap.com.br
```

`HOSTINGER_ACCOUNT_USERNAME` e `HOSTINGER_WEBSITE_DOMAIN` têm valores padrão correspondentes à configuração fornecida para esta integração, mas podem ser substituídos por variáveis de ambiente. Reinicie o Strapi após configurar as variáveis. A criação usa `POST /api/hosting/v1/accounts/{username}/websites/{domain}/subdomains`; a exclusão usa `DELETE /api/hosting/v1/accounts/{username}/websites/{domain}/subdomains/{subdomain}`. A Hostinger processa a remoção de forma assíncrona, então ela pode levar alguns minutos para ser concluída.

**Atenção:** o campo Subdomínio deve conter apenas o prefixo (por exemplo, `apartamentos`), não o domínio completo. A API cria o prefixo na pasta homônima e usa o diretório público conforme a chamada `curl` fornecida.


### Correção CRUD administrativo
As rotas administrativas `GET/POST /landing-pages/records`, `PUT/DELETE /landing-pages/records/:documentId` são implementadas no controller `hostinger.js` e usam `strapi.documents("api::landing-page.landing-page")`. O painel não precisa usar a Content API pública para criar/editar registros.
