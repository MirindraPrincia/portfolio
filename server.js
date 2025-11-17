require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour envoyer l'email
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    // Configuration du transporteur Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
        logger: true,
        debug: true
    });

    const mailOptions = {
        from: email, // Email de l'expéditeur (visiteur)
        to: process.env.GMAIL_USER, // Destination
        subject: `Message PORTFOLIO`,
        html: `
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:0;">
      <div style="max-width:600px; margin:20px auto; padding:20px; background-color:#ffffff; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <div style="background-color:#007bff; color:#fff; padding:15px; border-radius:8px 8px 0 0; text-align:center;">
          <h1 style="margin:0; font-size:24px;">Nouveau message reçu</h1>
        </div>
        <div style="padding:20px; color:#333;">
          <h2 style="color:#007bff; font-size:20px; margin-top:0;">Détails du message</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <p style="font-size:16px; line-height:1.5; color:#555;">${message}</p>
        </div>
        <div style="text-align:center; font-size:12px; color:#777; margin-top:20px;">
          <p>Ce message a été envoyé via le site web.</p>
        </div>
      </div>
    </body>
    </html>
    `
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé:', info.response);
        res.json({ success: true, message: 'Votre message a été envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message.' });
    }
});

// Lancement du serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
