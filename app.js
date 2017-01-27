//모듈을 추출합니다.
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var url = require("url");
var server_util = require("./js/server_util.js");   // 노드 서버용 유틸 

//html 페이지 클라이언트로 전송
var redirectHtmlPage = function(response, file, type){
  //파일을 읽는다
  var readFileError = fs.readFile(file, function(error, data) {

      if(file == "favicon.ico") return;  // 파비콘 무시

      if(error !== null){
        return error;
      }else{
        response.writeHead(200, {
            'Content-type': type
        });
      }//else

      response.end(data);
  });

  //readFile시 에러 발생하면 그냥 404라고 여기고 에러 페이지 리다이렉트
  if(readFileError !== null){
    fs.readFile("error_404.html", function(error, data) {
      response.writeHead(200, {
        'Content-type': "text/html"
      });

      response.end(data);
    });
  }//if

};//redirectHtmlPage

//웹서버를 만듭니다.
var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname.substr(1);
    var index = "index.html";
    var file = (path === "") ? index : path;
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
            type = "video/mpeg";
            break;
        case "mp3":
            type = "audio/mp3";
            break;
        default:
            type = "text/plain";
    }

    //파일을 읽는다
    redirectHtmlPage(response, file, type);

}).on("connection", function(data) {
    server_util.log("connection");
}).on("request", function(data) {
    server_util.log("request");
}).on("clientError", function(err, data) {
    server_util.log("clientError", err);
  }).on("disconnection", function(data){
    server_util.log("disconnection");
  }).on("close", function(data) {
    server_util.log("close");
}).listen(52273, function() {
    server_util.log("Server Start! Now Running... port: 52273");
});

var io = socketio.listen(server);
var roomList = [];
var roomMemberCount = [];

io.sockets.on('connection', function(socket) {
    server_util.log("socket connection");
    server_util.log("room condition :", roomList.join(", "));
    //이벤트
    io.sockets.emit("room_list", roomList);

    socket.on("join", function(room_name) {
        socket.join(room_name);
        var i = roomList.indexOf(room_name);
        if (i == -1) {
            var j = roomList.push(room_name);
            roomMemberCount[j - 1] = 1;
        }else{
          roomMemberCount[i]++;
        }
        server_util.log("join", room_name, "/ room condition :", roomList.join(", "));
    });

    socket.on('toRoom', function(data) {
        io.sockets.in(data.room).emit('message', data);
        server_util.log("toRoom :", server_util.toString(data));
    });

    socket.on("toAll", function(data){
      io.sockets.emit("message", data, "to All : ");
      server_util.log("toAll :", server_util.toString(data));
    });

    socket.on("unload", function(room_name) {
        socket.leave(room_name);
        var i = roomList.indexOf(room_name);
        if(i != -1){
          roomMemberCount[i]--;
          if(roomMemberCount[i] <= 0){
            roomList.splice(i, 1);
            roomMemberCount.splice(i, 1);
          }
          server_util.log("leave", room_name, "/ room condition :", roomList.join(", "));
        }
    });

});
