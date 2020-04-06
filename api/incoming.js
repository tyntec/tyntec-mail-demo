const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  }
});

module.exports = async (request, response) => {
  console.log('Received message', request);
  console.log(process.env);

  try {
    const body = request.body;
    if (!body.from || !body.receivedAt || !body.content || !body.content.text || !body.whatsapp || !body.whatsapp.senderName) {
      console.error(body);
      response.status(400).send('Invalid request)');
      return;
    }

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.EMAIL,
      subject: 'Message#' + body.from + '#' + body.whatsapp.senderName + '#' + body.receivedAt,
      text: body.content.text
    });
  } catch (error) {
    console.error('Error: ', error);
    response.status(500).send(error);
  }

  response.status(204).send('');
};
