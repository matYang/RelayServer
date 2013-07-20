
module.exports = function Ecosystem_Median_Messaging_Asynchronous(data){
    //TODO 
    io.sockets.emit('notification', data);
    console.log("received notification event, sent out message");
};