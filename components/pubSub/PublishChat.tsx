import updateDB from './updateDB';

interface pubMessage {
    channel: string;
    message: string;
    pubOptions: {
        sender: string;
    };
}

function PublishChat({ channel, message, pubOptions }: pubMessage) {
    const publishOptions = new Backendless.PublishOptions({
        headers: {
            sender: pubOptions.sender,
        },
    });
    try {
        Backendless.Messaging.publish(channel, message, publishOptions)
            .then(function (response) {})
            .catch(function (error) {});
        const time = new Date().getTime();
        updateDB({
            sender: pubOptions.sender,
            message,
            channel,
            time,
        });
    } catch (error) {
        console.log('Error from publish chat', error);
    }
}

export default PublishChat;
