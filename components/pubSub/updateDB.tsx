interface updateData {
    sender: string;
    message: string;
    channel: string;
    time: number;
}
function updateDB({ sender, message, channel, time }: updateData) {
    try {
        setTimeout(() => {
            const data = { sender, message, channel, time };
            Backendless.Data.of(channel)
                .save(data)
                .then(function (saveObject) {
                    console.log('Data Saved');
                })
                .catch(function (error) {
                    console.log('Error from updateDB', error);
                });
        }, 100);
    } catch (error) {
        console.log('Cannot update databse');
    }
}

export default updateDB;
