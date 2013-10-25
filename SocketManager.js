
module.exports = function SocketManager(){
	var userPool = {};
	var socketPool = {};
	
	return {
		'on_user_register': function(userId, socketId){
		    socketPool[socketId] = userId;
		    if (typeof userPool[userId] === 'undefined'){
		        userPool[userId] = [];
		    }
		    userPool[userId].append(socketId);
		},
		
		'on_user_disconnect': function(socketId){
		    var userId = socketPool[socketId];
		    if (typeof userId !== 'undefined'){
		        if (userPool[userId] !== 'undefined'){
		            var index = userPool[userId].indexOf(socketId);
		            if (index > -1){
		                userPool[userId].splice(index, 1);
		            }
		
		            if (userPool[userId].length === 0){
		                delete userPool[userId];
		            }
		        }
		        delete socketPool[socketId];
		    }
		},
		
		'getSessionsByUser': function(userId){
		    return userPool[userId];
		}
	};
};
