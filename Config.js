module.exports = function Config(){

	//port used to listen to internal communications
	var _Internal_Port = 8017;
	//port used to broadcast notifications
	var _External_Port = 3000;

	var _HOST = "localhost";

	var _Internal_NotificationPush_Path = "/api/v1.0/notifications/push";

	var _Internal_LetterPush_Path = "/api/v1.0/letter/push";

	var _Remote_Key = "REMOTE";

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
		},

		'internalLetterPushPath': function(){
			return _Internal_LetterPush_Path;
		},

		'getRemoteKey': function(){
			return _Remote_Key;
		}
	};
};

