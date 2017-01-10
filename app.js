//모듈을 추출합니다.
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var url = require("url");
//웹서버를 만듭니다.
var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname.substr(1);
    var index = "HTMLPage_m.html";
    var file = (path == "") ? index : path;
    var type = file.substr(file.lastIndexOf(".") + 1);
    switch (type) {
        case "html":
        case "htm":
            type = "text/html";
            break;
        case "css":
            type = "text/css";
            break;
        case "xml":
            type = "text/xml";
            break;
        case "jpg":
            type = "imgae/jpeg";
            break;
        case "png":
            type = "image/png";
            break;
        case "mp4":
            type = "video/mpeg"
            break;
        case "mp3":
            type = "audio/mp3";
            break;
        default:
            type = "text/plain";
    }
    if (request.method == "GET") {
        // get request
        var query = url.parse(request.url, true).query;
        //JSON.stringify(query);
    } else if (request.method == "POST") {
        // post request
        request.on("data", function(data) {
            //data
        });
    }
    //파일을 읽는다
    fs.readFile(file, function(error, data) {
        response.writeHead(200, {
            'Content-type': type
        });
        response.end(data);
    });
}).on("connection", function(data) {
    log("connection");
}).on("request", function(data) {
    log("request");
}).on("clientError", function(data) {
    log("clientError", data);
}).on("close", function(data) {
    log("close");
}).listen(52273, function() {
    log("Server Start! Now Running... port: 52273");
});

var io = socketio.listen(server);
var roomList = [];
io.sockets.on('connection', function(socket) {
    log("socket connection");
    log("room condition :", roomList.join(", "));
    //이벤트
    io.sockets.emit("room_list", roomList);
    socket.on("join", function(room_name) {
        socket.join(room_name);
        if (!roomList.includes(room_name)) {
            roomList.push(room_name);
        }
        log("new join / room condition :", roomList.join(", "));
    });
    socket.on('message', function(data) {
        //클라이언트 message 이벤트를 발생시킨다.
        io.sockets.emit('message', data);
    });
});

function log() {
    var str = "";
    for (var p in arguments) {
        str += arguments[p].toString() + " ";
    }
    console.log("[LOG]", str);
}
