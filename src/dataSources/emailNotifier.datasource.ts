import emailRepository from "../core/repositories/email.repository";
import debug from "debug";
import {
    Transporter,
    SendMailOptions,
    createTransport
} from "nodemailer";
import emailTemplates from 'swig-email-templates';

const logger = debug("paw:emailNotifier.datasource");

class EmailNotifier implements emailRepository {

    private transporter!: Transporter;

    public async sendEmail(payload: SendMailOptions): Promise<any> {
        try {
            const smtpConectionSettings: any = {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                requireTLS: true,
                secured: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            };
            this.transporter = createTransport(smtpConectionSettings);
            this.transporter.verify((err: any, _success: any) => {
                if(err){
                    logger("[Error] %j", err);
                    throw new Error(err)
                }
            });
            return await this.transporter.sendMail(payload);
        } catch (error: any) {
            logger("[Error] %j", error.message);
            throw new Error(error);
        } finally {
            this.transporter.close();
        }
    }

    public async renderTemplate(template: string, data: object): Promise<any> {
        try {
            const templates = new emailTemplates();
            return await templates.render(template, data);
        } catch (error: any) {
            logger("[Error] %j", error.message);
            throw new Error(error);
        }
    }
}

export default EmailNotifier;
