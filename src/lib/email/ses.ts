
import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { buildApprovalEmailTemplate } from "./templates/approvalEmail";
import { buildRejectionEmailTemplate } from "./templates/rejectionEmail";

const ses = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    }
});

const transporter = nodemailer.createTransport({
    SES: { sesClient: ses, SendEmailCommand },
});

function getFromEmailAddress() {
    const from = process.env.AWS_EMAIL_FROM;
    if (!from) {
        throw new Error("AWS_EMAIL_FROM is not configured");
    }
    return from;
}

export async function sendApprovalEmail({
    to,
    adTitle,
    note, 
}:{
    to:string;
    adTitle:string;
    note?:string;
}) {
    const template = buildApprovalEmailTemplate({ adTitle, note });

    await transporter.sendMail({
        from: getFromEmailAddress(),
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
}

export async function sendRejectionEmail({
    to,
    adTitle,
    reason,
}: {
    to: string;
    adTitle: string;
    reason: string;
}) {
    const template = buildRejectionEmailTemplate({ adTitle, reason });

    await transporter.sendMail({
        from: getFromEmailAddress(),
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
}
