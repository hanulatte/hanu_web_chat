//노드 서버용 유틸 함수 모음

exports.log = function () {
  var str = toString(arguments);
  console.log("[LOG]", str);
};

exports.toString = function (data) {
  var str = "";
  for (var p in data) {
      if (data[p] && data[p].toString) {
          str += data[p].toString() + " ";
      }
  }
  return str;
};
