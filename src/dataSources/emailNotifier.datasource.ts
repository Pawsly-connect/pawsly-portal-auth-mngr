import emailRepository from "../core/repositories/email.repository";
import debug from "debug";
import {
    Transporter,
    SendMailOptions,
    createTransport
} from "nodemailer";
import emailTemplates from 'swig-email-templates';

const logger = debug("paw:emailNotifier.datasource");

const conectionEmailSettings: any = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    requireTLS: false,
    secured: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

class EmailNotifier implements emailRepository {

    private getTransport(){
        const transport = createTransport(conectionEmailSettings);
        transport.verify();
        return transport;
    }

    public async sendEmail(payload: SendMailOptions): Promise<any> {
        try {
            const transporter = this.getTransport();
            const infoSend = await transporter.sendMail(payload);
            logger(infoSend);
            return infoSend;
        } catch (error: any) {
            logger(error);
            throw new Error(error);
        } finally {
            // transporter.close();
        }
    }

    public async renderTemplate(template: string, data: object): Promise<any> {
        try {
            const templates = new emailTemplates();
            const rendered = await templates.render(template, data);
            return rendered;
        } catch (error: any) {
            logger(error);
            throw new Error(error);
        }
    }
}

export default EmailNotifier;
