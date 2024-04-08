import emailRepository from "../core/repositories/email.repository";
import debug from "debug";
import { Resend } from 'resend';
import emailTemplates from 'swig-email-templates';

const logger = debug("paw:emailNotifier.datasource");

class EmailNotifier implements emailRepository {

    public async sendEmail(payload: any): Promise<any> {
        try {
            const resend = new Resend(process.env.API_KEY_RESEND);
            const {data, error} = await resend.emails.send(payload);
            if(error){throw new Error(error.message)}
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async renderTemplate(template: string, data: Object): Promise<any> {
        try {
            const templates = new emailTemplates();
            const rendered = await templates.render(template, data);
            return rendered;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default EmailNotifier;
