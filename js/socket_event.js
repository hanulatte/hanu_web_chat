$(document).ready(function() {
    socket = io.connect();
    socket.on("room_list", function(roomList) {
      $("#room_list_data").empty();
        for (var i in roomList) {
            var room_data = "<option value=\"" + roomList[i] + "\" />";
            $("#room_list_data").append(room_data);
        }
    });
    socket.on('message', function(data) {
      var toAll = arguments[1] || "";
        // 추가할 문자열을 만듭니다.
        var output = '';
        output += '<li>';
        output += '       <p><span style="font-weight:bold;font-size:14pt;">' + data.name + '</span> (' + data.date + ')</p>';
        output += '       <p><span style="font-weight:bold;">' + toAll + "</span>" + data.message + '</p>';
        output += '</li>';
        //문서 객체를 추가합니다.
        $(output).prependTo('#content');
        $('#content').listview('refresh');
    });
});
