$(document).ready(function() {
    socket = io.connect();
    socket.on("room_list", function(roomList) {
      $("#room_list_data").empty();
        for (var i in roomList) {
            var room_data = "<option value=\"" + room_data + "\" />";
            $("#room_list_data").append(room_data);
        }
    });
    socket.on('message', function(data) {
        // 추가할 문자열을 만듭니다.
        var output = '';
        output += '<li>';
        output += '       <h3>' + data.name + '</h3>';
        output += '       <p>' + data.message + '</p>';
        output += '       <p>' + data.date + '</p>';
        output += '</li>';
        //문서 객체를 추가합니다.
        $(output).prependTo('#content');
        $('#content').listview('refresh');
    });
});
