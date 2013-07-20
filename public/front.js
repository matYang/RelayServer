window.onload = function(){
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");

    var fill =  function(){
        var html = "Hello. This is the test public site for the relay server. stop clicking, xoxo";
        content.innerHTML = html;
    };

    socket.on('handShake', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;
            console.log("message received");
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function(){
        fill();
    };
};