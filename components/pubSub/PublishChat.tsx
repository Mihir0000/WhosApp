import updateDB from './updateDB';

interface pubMessage {
    receiver: string;
    message: string;
    pubOptions: {
        sender: string;
    };
}

function PublishChat({ receiver, message, pubOptions }: pubMessage) {
    const publishOptions = new Backendless.PublishOptions({
        headers: {
            sender: pubOptions.sender,
        },
    });
    try {
        Backendless.Messaging.publish(receiver, message, publishOptions)
            .then(function (response) {})
            .catch(function (error) {});
        const time = new Date().getTime();
        updateDB({
            sender: pubOptions.sender,
            message,
            receiver,
            time,
        });
    } catch (error) {
        console.log('Error from publish chat', error);
    }
}

export default PublishChat;
