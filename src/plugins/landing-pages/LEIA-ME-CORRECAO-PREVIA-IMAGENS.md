# Correção da prévia de imagens no painel de Landing Pages

## O que foi corrigido
- O formulário personalizado consulta `/upload/files/:id` para resolver os IDs de mídia já salvos no Strapi.
- Mostra uma prévia da imagem existente em vez de exibir somente `Imagem enviada (ID interno ...)`.
- Depois de um upload novo, usa a URL devolvida pelo Strapi para mostrar a prévia imediatamente.
- A galeria também mostra miniaturas das imagens existentes.
- Mantém o ID da mídia no payload de salvamento, compatível com a relação `media` da coleção.

## Instalação
1. Faça uma cópia de segurança da pasta atual `src/plugins/landing-pages`.
2. Copie a pasta `landing-pages` deste pacote para `src/plugins/landing-pages`, mesclando/substituindo os arquivos correspondentes.
3. Confirme que o schema `components/landing-page/card.json` contém `imagem` com `"type": "media"`, `"multiple": false` e `"allowedTypes": ["images"]`.
4. Reinicie o Strapi e, se necessário, reconstrua o painel administrativo conforme o fluxo do seu projeto.

A prévia é carregada por ID. O usuário administrativo precisa ter acesso à biblioteca de mídia (`upload`) para que a chamada `/upload/files/:id` funcione.
