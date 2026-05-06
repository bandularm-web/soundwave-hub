import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Support Form
  app.post("/api/support", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Configuration check
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT || "587");
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const toEmail = process.env.SUPPORT_EMAIL || "bandularm@gmail.com";

      if (!host || !user || !pass) {
        console.error("Missing SMTP configuration");
        return res.status(500).json({ error: "Support email system is not configured yet. Please contact the administrator." });
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: toEmail,
        subject: `[SoundWave Support] ${subject}`,
        text: `
Name: ${name}
Email: ${email}
Subject: ${subject}
Date: ${new Date().toLocaleString()}

Message:
${message}
        `,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #8b5cf6;">New Support Message</h2>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });

      console.log("Email sent: %s", info.messageId);
      res.json({ success: true, message: "Your message has been sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
