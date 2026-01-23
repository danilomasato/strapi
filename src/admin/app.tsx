import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'pt-BR'
    ],
  },
  // Extend the translations
  translations: {
    fr: {
      "Auth.form.email.label": "test",
      Users: "Utilisateurs",
      City: "CITY (PORTUGUESE)",
      // Customize the label of the Content Manager table.
      Id: "ID Portuguese",
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
