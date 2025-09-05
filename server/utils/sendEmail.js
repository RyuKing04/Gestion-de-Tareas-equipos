import nodemailer from 'nodemailer';

// Configuración simple sin verificación inicial
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

async function sendEmail({ to, subject, text }) {
  // Validar variables de entorno
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    return false;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export default sendEmail;