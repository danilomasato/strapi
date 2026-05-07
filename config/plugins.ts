export default () => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        secure: false, // Use `true` for port 465
        auth: {
          user: env('process.env.GMAIL_ADRESS'),
          pass: env('process.env.GMAIL_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('process.env.GMAIL_ADRESS'),
        defaultReplyTo: env('process.env.GMAIL_ADRESS'),
      },
    },
  },
});
