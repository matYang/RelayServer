//the simplest relay server

var ConfigBase = require('./Config.js'),
    Config = new ConfigBase();

var express = require('express');


var appFactory = function(){
    var appIndex = 0;

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

        appIndex++;
        return app;
    };
};

if (!module.parent) {
    var appCreator = appFactory();
    var app = appCreator();

    //set up jade engine directives
    app.set('views', __dirname + '/tpl');
    app.set('view engine', "jade");
    app.engine('jade', require('jade').__express);
    //set up static logic directive
    app.use(express.static(__dirname + '/public'));

    app.get("/", function(req, res){
        res.render("index");
    });

    //make app listen to external port, then forward this port to socket.io for broadcasting
    io = require('socket.io').listen(app.listen(Config.externalPort()));

    io.sockets.on('connection', function (socket) {
        socket.emit('handShake', { message: 'socket.io initial connection established'});
    });

    var EMMA = require('./Ecosystem_Median_Messaging_Asynchronous.js'),
        emma = new EMMA();
    //wait for the post command, and launch the notifications
    var serverConnector = appCreator();
    serverConnector.listen(Config.internalPort());

    serverConnector.post(Config.internalNotificationPushPath(), function(req, res){
        emma(io, req.body);
    });

    console.log("express app now listening to intenal port " + Config.internalPort() + " and external port " + Config.externalPort());
}

