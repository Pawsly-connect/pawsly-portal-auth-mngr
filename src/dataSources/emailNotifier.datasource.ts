import emailRepository from "../core/repositories/email.repository";
import nodemailer from "nodemailer";

class EmailNotifier implements emailRepository {
    public sendConfirmationEmail(email: string): Promise<any> {
        const mailer = this.getMailer();
        const emailOptions = {
            from: '"Pawsly connect"',
            to: email,
            subject: 'Verifica tu cuenta en Pawsly 🐶🐱',
            text: 'Verifica tu cuenta aqui',
        };
        return mailer.sendMail(emailOptions);
    }

    private getMailer() {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
}

export default EmailNotifier;
