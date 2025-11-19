import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: email,
            to: process.env.GMAIL_USER,
            subject: "Message PORTFOLIO",
            html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:0;">
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
            </body>`
        });

        res.status(200).json({ success: true, message: "Message envoyé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Point d'entrée frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
