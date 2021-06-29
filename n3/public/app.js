$(function () {
  /** Carrega os dados do MongoDB e exibe em uma tabela em HTML **/
  $("#fetchdata").on("click", function () {
    $.get("/fetchdata", function (data) {
      var data = data["data"];
      $("#trdata").html("");
      $("#message").hide();
      var string = "";
      $.each(data, function (index, data) {
        string +=
          "<tr><td>" +
          (index + 1) +
          "</td><td>" +
          data["_id"] +
          "</td><td>" +
          data["age"] +
          "</td><td>" +
          data["sex"] +
          "</td><td>" +
          data["cp"] +
          "</td><td>" +
          data["trestbps"] +
          "</td></tr>";
      });
      $("#trdata").html(string);
    });
  });
  /** Importa os dados para o MongoDB **/
  $("#importdata").on("click", function () {
    $.get("/import", function (data) {
      $("#message").show().html(data["success"]);
    });
  });
});
