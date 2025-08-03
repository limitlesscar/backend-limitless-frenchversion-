import { MailOptions } from "./types";
export declare class MailService {
    private transporter;
    constructor();
    sendMail({ mailOptions }: {
        mailOptions: MailOptions;
    }): Promise<void>;
}
