//the simplest relay server

var ConfigBase = require('./Config.js'),
    EnvironmentConfigBase = require('./Environment.js'),
    Config = new ConfigBase(),
    EnvironmentConfig = new EnvironmentConfigBase();

var express = require('express');


var appFactory = function(){

    return function (){
        var app = express();
        //configure the basic app behaviours
        app.configure(function(){
            app.enable('jsonp callback');
            app.use(express.bodyParser());
            app.use(express.cookieParser());
            app.use(express.methodOverride());
            app.use(app.router);
        });
        return app;
    };
};
var appCreator = appFactory();




var SocketManager = require('./SocketManager.js'),
    socketManager = new SocketManager();
if (EnvironmentConfig.getEnvrionment() === 'LOCAL'){
    //local
    console.log('Starting server on local envrionment');
    io = require('socket.io').listen(Config.externalPort());
}
else if (EnvironmentConfig.getEnvrionment() === 'TEST'){
    //AWS test
    console.log('Starting server on test envrionment');
    var fs = require('fs'),
        ioOptions = {
            key: fs.readFileSync('/etc/apache2/ssl/privatekey.pem'),
            cert: fs.readFileSync('/etc/apache2/ssl/www_routea_ca.crt')
        },
        ioServer = require('https').createServer(ioOptions, appCreator());

        io = require("socket.io").listen(ioServer);
        ioServer.listen(Config.externalPort());
}
else{
    //Aliyun production
    console.log('Starting server on production envrionment');
    io = require('socket.io').listen(Config.externalPort());
}



//make socket.io listen to ioServer which uses https
io.sockets.on('connection', function (socket) {
    //after connection, user sends a register socket, which will register the cur user in userPool for notification
    socket.on("register", function(data) {
        console.log('receving register event with data: ');
        console.log(data);
        //store the socketId in the pool, socketId is the identifier of the cur user's socket session
        socketManager.on_user_register(data.id, socket.id);
    });

    socket.on('disconnect', function () {
        console.log('socket with id: ' + socket.id + ' has disconnected');
        socketManager.on_user_disconnect(socket.id);
    });
});



//create a new server 
var serverConnector = appCreator();
//listen to internal POST port, which is 8017
serverConnector.listen(Config.internalPort());


/**--------post request listener, listening for new incoming notifications--------**/
//make the new server listen to localhost:8017/api/v1.0/notifications/push
serverConnector.post(Config.internalNotificationPushPath(), function(req, res){
    console.log('notification push received with params:');
    console.log(req.body);
    
    var n_arr = req.body;
    var targetUserId = -1;
    var targetSocketId = [];
    for (var index = 0; index < n_arr.length; index++){
        targetUserId = n_arr[index].targetUserId;
        targetSocketId_arr = socketManager.getSessionsByUser(targetUserId);
    
        if (typeof targetSocketId_arr !== 'undefined'){
            for (var j = 0; j < targetSocketId_arr.length; j++){
                io.sockets.socket(targetSocketId_arr[j]).emit('newNotification', {'id': targetUserId});
            }
        }
    }
    res.end();
    
});

/**--------post request listener, listening for new incoming letters--------**/
serverConnector.post(Config.internalLetterPushPath(), function(req, res){
    console.log('letter push received with params:');
    console.log(req.body);
    
    var targetUserId = parseInt(req.body.to_userId, 10),
        from_userId = parseInt(req.body.from_userId, 10),
        targetSocketId_arr = socketManager.getSessionsByUser(targetUserId),
        fromSocketId_arr = socketManager.getSessionsByUser(from_userId),
        j = 0;

    //send to target user
    if (typeof targetSocketId_arr !== 'undefined'){
        for (j = 0; j < targetSocketId_arr.length; j++){
            io.sockets.socket(targetSocketId_arr[j]).emit('newLetter', req.body);
        }
    }
    //forward to original user
    if (typeof fromSocketId_arr !== 'undefined'){
        for (j = 0; j < fromSocketId_arr.length; j++){
            io.sockets.socket(fromSocketId_arr[j]).emit('newLetter', req.body);
        }
    }
    res.end();
});
console.log("express app now listening to intenal port " + Config.internalPort() + " and external port " + Config.externalPort());






/**--------create a simple http server to indicate server alive--------**/
var app = appCreator();
app.listen(8018);
//set up jade engine directives
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
//set up static logic directive
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/testBroadcast', function(req, res){
    console.log('test broadcast received');
    io.sockets.socket().emit('broadcast', {'content': 'le me de SocketServer still alive'});
    res.end();
});

// app.get('/testPush/:id?', function(req, res){
//     console.log('test push received with params:');
//     console.log(req.params.id);
    
//     var targetSocketId_arr = socketManager.getSessionsByUser(req.params.id);
//     for (var j = 0; j < targetSocketId_arr.length; j++){
//         io.sockets.socket(targetSocketId_arr[j]).emit('push', {'id': req.params.id});
//     }
//     res.end();
// });


