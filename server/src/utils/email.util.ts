import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

export type emailData = {
    subject: string,
    to: string
    code: string
    name: string
}

export const sendToQueue = async (emailData: emailData) => {
    try {
        if (!process.env.RABBITMQ_URL) {
            throw new Error('RabbitMQ URL is not defined in env');
        }
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'emailQueue';

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), { persistent: true });

        console.log(`Email added to queue: ${JSON.stringify(emailData)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
};


