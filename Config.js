module.exports = function Config(){

	//port used to listen to internal communications
	var _Internal_Port = 8017;
	//port used to broadcast notifications
	var _External_Port = 3000;

	var _HOST = "localhost";

	var _Internal_NotificationPush_Path = "/api/v1.0/notifications/push";

	return {
		'internalPort': function (){
			return _Internal_Port;
		},

		'externalPort': function(){
			return _External_Port;
		},

		'host': function(){
			return _HOST;
		},

		'internalNotificationPushPath': function(){
			return _Internal_NotificationPush_Path;
		}

	};

};