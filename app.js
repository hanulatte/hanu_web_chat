//모듈을 추출합니다.
var http = require('http');

var fs = require('fs');
var socketio = require('socket.io');

//웹서버를 만듭니다.
var server = http.createServer(function(request, response){
  //HTML 파일을 읽는다
  fs.readFile('HTMLPage0.html', function(error, data){
    response.writeHead(200, {'Content-type': 'text/html'});
    response.end(data);
  });
}).listen(52273, function(){
  console.log('Server... 52273');
});

var io = socketio.listen(server);
var roomList = [];
io.sockets.on('connection', function(socket){
  //메세지 이벤트
  socket.on('message', function(data){
    //클라이언트 message 이벤트를 발생시킨다.
    io.sockets.emit('message', data);
  });
});
