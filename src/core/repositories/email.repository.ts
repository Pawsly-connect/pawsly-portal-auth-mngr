interface EmailRepository {
    sendConfirmationEmail(email: string): Promise<any>
}

export default EmailRepository;
