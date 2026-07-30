export default {
  routes: [
    {
      method: "GET",
      path: "/anuncios/buscar/:termo",
      handler: "anuncio.buscar",
      config: {
        auth: false,
      },
    },
  ],
};