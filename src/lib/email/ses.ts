
import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { buildApprovalEmailTemplate } from "./templates/approvalEmail";
import { buildRejectionEmailTemplate } from "./templates/rejectionEmail";

function getSesConfig() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!region) {
        throw new Error("AWS_REGION is not configured");
    }

    if (!accessKeyId || !secretAccessKey) {
        throw new Error("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not configured");
    }

    return { region, accessKeyId, secretAccessKey };
}

let sesClient: SESv2Client | null = null;
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
    if (transporter) return transporter;

    const { region, accessKeyId, secretAccessKey } = getSesConfig();

    sesClient = new SESv2Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });

    transporter = nodemailer.createTransport({
        SES: { sesClient, SendEmailCommand },
    });

    return transporter;
}

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

    await getTransporter().sendMail({
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

    await getTransporter().sendMail({
        from: getFromEmailAddress(),
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
}
