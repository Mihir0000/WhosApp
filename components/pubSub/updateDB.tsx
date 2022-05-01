interface updateData {
    sender: string;
    message: string;
    receiver: string;
    time: number;
}
function updateDB({ sender, message, receiver, time }: updateData) {
    try {
        setTimeout(() => {
            const data = { sender, message, receiver, time };
            Backendless.Data.of(receiver)
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
