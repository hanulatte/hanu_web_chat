//모듈을 추출합니다.
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var url = require("url");
//웹서버를 만듭니다.
var server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname.substr(1);
  //var type = path.substr(path.lastIndexOf(".") + 1);
  var index = "HTMLPage_m.html";
  var file = (path === "") ? index : path;
    //파일을 읽는다
    fs.readFile(file, function(error, data) {
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        response.end(data);
    });
}).listen(52273, function() {
    console.log('Server... 52273');
});

var io = socketio.listen(server);
var roomList = [];
io.sockets.on('connection', function(socket) {
    //이벤트
    io.sockets.emit("room_list", roomList);

    socket.on('message', function(data) {
        //클라이언트 message 이벤트를 발생시킨다.
        io.sockets.emit('message', data);
    });
});
