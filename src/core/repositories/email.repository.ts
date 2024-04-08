interface EmailRepository {
    sendEmail(payload: any): Promise<any>,
    renderTemplate(template: string, data: object): Promise<any>
}

export default EmailRepository;
