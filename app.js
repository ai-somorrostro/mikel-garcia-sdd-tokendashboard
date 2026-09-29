document.addEventListener("DOMContentLoaded", function () {
  var statusEl = document.getElementById("status");
  var tbody = document.getElementById("models-body");

  var COLUMNS = [
    "name",
    "inputPricePerToken",
    "outputPricePerToken",
    "ttft_ms",
    "inputModality",
    "outputModality",
    "inputTokensDay",
    "outputTokensDay",
    "inputTokensWeek",
    "outputTokensWeek"
  ];

  var NUMERIC_COLUMNS = {
    inputPricePerToken: true,
    outputPricePerToken: true,
    ttft_ms: true,
    inputTokensDay: true,
    outputTokensDay: true,
    inputTokensWeek: true,
    outputTokensWeek: true
  };

  function setError(message) {
    statusEl.textContent = message;
    statusEl.classList.add("error");
  }

  statusEl.textContent = "Cargando modelos\u2026";

  fetch("mock-data.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Respuesta no válida: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (!Array.isArray(data)) {
        throw new Error("Formato de datos no válido: se esperaba una lista de modelos.");
      }

      data.forEach(function (model) {
        var row = document.createElement("tr");
        COLUMNS.forEach(function (key) {
          var cell = document.createElement("td");
          cell.textContent = String(model[key]);
          if (NUMERIC_COLUMNS[key]) {
            cell.classList.add("num");
          }
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });

      statusEl.textContent = data.length + " modelos cargados.";
    })
    .catch(function () {
      tbody.textContent = "";
      setError("No se pudieron cargar los datos de modelos. Revisa que mock-data.json exista y sea válido.");
    });
});
