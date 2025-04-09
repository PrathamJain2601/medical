import { emailTemplates } from "../utils/email-templates.util";
import { emailData } from "../utils/email.util";
import { prisma } from "./db.config";
import transporter from "./email.config";
import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (emailData: emailData) => {

    await transporter.sendMail({
        from: "Auth <Auth@gmail.com>",
        to: emailData.to,
        subject: emailData.subject,
        text: `Hello ${emailData.name}, Please verify your email using this link: http://localhost:5000/verify-email?token=${emailData.code}`,
        html: emailTemplates.verificationEmail(emailData.code, emailData.name),
    });

    console.log(`Email sent to ${emailData.to}`);
};

export const startConsumer = async () => {
    try {
        if(!process.env.RABBITMQ_URL){
            throw new Error('RabbitMQ URL is not defined in env');
        }
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'emailQueue';

        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const emailData = JSON.parse(msg.content.toString());
                if(!emailData.to){
                    return;
                }

                await prisma.otp.deleteMany({
                    where: { email: emailData.to },
                });
                const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
                await prisma.otp.create({
                    data: {
                        email: emailData.to,
                        code: emailData.code,
                        expiresAt: expiresAt
                    }
                });
                await sendEmail(emailData);
                channel.ack(msg);
            }
        });

        console.log('Waiting for messages...');
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
};