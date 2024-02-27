const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта Fit Well Hub',
            text: '',
            html:
                `
                    <style>
                        div {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            width: 300px;
                            margin: 0 auto;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                    
                        h1 {
                            color: #333;
                        }
                    
                        p {
                            color: #555;
                            font-size: 18px;
                            margin-top: 10px;
                        }
                    </style>
                    <div>
                        <h1>Код подтверждения регистрации</h1>
                        <p>${code}</p>
                    </div>
                `
        })
    }
}

module.exports = new MailService();
