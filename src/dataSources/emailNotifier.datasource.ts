import emailRepository from "../core/repositories/email.repository";
import {
    Transporter,
    SendMailOptions,
    createTransport
} from "nodemailer";
import emailTemplates from 'swig-email-templates';
import debug from "debug";
import { getEnv } from "../utilities/configEnv";

const logger = debug("paw:emailNotifier")

class EmailNotifier implements emailRepository {

    private transporter!: Transporter;
    private template!: emailTemplates;

    constructor(){
        try {
            const smtpConectionSettings: any = {
                host: getEnv('EMAIL_HOST'),
                port: getEnv('EMAIL_PORT'),
                requireTLS: true,
                secured: true,
                auth: {
                    user: getEnv('EMAIL_USER'),
                    pass: getEnv('EMAIL_PASSWORD')
                }
            };
            this.transporter = createTransport(smtpConectionSettings);
            this.transporter.verify((err: any, _success: any) => {
                if(err){
                    throw new Error(err);
                }else{
                    logger("Server SMTP is ready to take your messages");
                }
            });
            this.template = new emailTemplates();
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async sendEmail(payload: SendMailOptions): Promise<any> {
        try {
            return await this.transporter.sendMail(payload);
        } catch (error: any) {
            throw new Error(error);
        } finally {
            this.transporter.close();
        }
    }

    public async renderTemplate(template: string, data: object): Promise<any> {
        try {
            return await this.template.render(template, data);
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export default EmailNotifier;
