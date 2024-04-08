interface EmailRepository {
    sendEmail(payload: any): Promise<any>,
    renderTemplate(template: string, data: Object): Promise<any>
}

export default EmailRepository;
