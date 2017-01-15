$(document).ready(function() {
    // chat start
    $(document).on("click", "#join", function() {
        var room_name = $("#room_name").val().trim();
        if (room_name !== "" && room_name != "Now Loading...") {
            socket.emit("join", room_name);
            location.href = "#chatpage";
        }
    });
    
    //메시지 인풋에서 엔터치면
    $(document).on("keydown", "#message", function(e) {
        if (e.keyCode == 13) {
            $("#toRoom").trigger("click");
        }
    });

    //버튼을 클릭할 때
    $(document).on("click", "#toRoom", function() {
        // 클릭 후 메시지 박스로 이동
        $("#message").focus();
        // 앞 뒤 공백 제거
        var message = $("#message").val().trim();
        if (message !== "") { // 공백 메시지 필터
            $("#message").val("");
            socket.emit('toRoom', {
                room: $("#room_name").val().trim(),
                name: $('#name').val(),
                message: message,
                date: new Date().toLocaleString() // toUTCString()
            });
        }
    });
    $(document).on("click", "#toAll", function() {
        // 클릭 후 메시지 박스로 이동
        $("#message").focus();
        // 앞 뒤 공백 제거
        var message = $("#message").val().trim();
        if (message !== "") { // 공백 메시지 필터
            $("#message").val("");
            socket.emit('toAll', {
                room: $("#room_name").val().trim(),
                name: $('#name').val(),
                message: message,
                date: new Date().toLocaleString() // toUTCString()
            });
        }
    });
});

$(window).unload(function() {
   socket.emit("unload", $("#room_name").val().trim());
 });
