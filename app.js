document.addEventListener("DOMContentLoaded", function () {
  var statusEl = document.getElementById("status");
  var tbody = document.getElementById("models-body");
  var searchInput = document.getElementById("filter-name");
  var inputModalitySelect = document.getElementById("filter-input-modality");
  var outputModalitySelect = document.getElementById("filter-output-modality");
  var sortButtons = Array.prototype.slice.call(
    document.querySelectorAll("#models-table thead button[data-key]")
  );

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

  var allModels = [];
  var state = {
    sortKey: null,
    sortDir: "asc",
    search: "",
    inputModality: "all",
    outputModality: "all"
  };

  function setError(message) {
    statusEl.textContent = message;
    statusEl.classList.add("error");
  }

  function compareBy(key, dir) {
    var factor = dir === "desc" ? -1 : 1;
    if (NUMERIC_COLUMNS[key]) {
      return function (a, b) {
        return (a[key] - b[key]) * factor;
      };
    }
    return function (a, b) {
      return String(a[key]).localeCompare(String(b[key])) * factor;
    };
  }

  function applyState() {
    var query = state.search.toLowerCase();
    var visible = allModels.filter(function (model) {
      if (query && String(model.name).toLowerCase().indexOf(query) === -1) {
        return false;
      }
      if (state.inputModality !== "all" && model.inputModality !== state.inputModality) {
        return false;
      }
      if (state.outputModality !== "all" && model.outputModality !== state.outputModality) {
        return false;
      }
      return true;
    });

    if (state.sortKey !== null) {
      visible = visible.slice().sort(compareBy(state.sortKey, state.sortDir));
    }

    render(visible);
    updateSortIndicators();
  }

  function render(visible) {
    tbody.textContent = "";

    visible.forEach(function (model) {
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

    statusEl.classList.remove("error");
    if (visible.length === 0) {
      statusEl.textContent = "Sin resultados para los filtros activos.";
    } else {
      statusEl.textContent = visible.length + " de " + allModels.length + " modelos.";
    }
  }

  function updateSortIndicators() {
    sortButtons.forEach(function (button) {
      var th = button.parentElement;
      var old = button.querySelector(".sort-indicator");
      if (old) {
        button.removeChild(old);
      }
      if (button.getAttribute("data-key") === state.sortKey) {
        var dir = state.sortDir === "desc" ? "descending" : "ascending";
        th.setAttribute("aria-sort", dir);
        var mark = document.createElement("span");
        mark.className = "sort-indicator";
        mark.textContent = state.sortDir === "desc" ? "▼" : "▲";
        button.appendChild(mark);
      } else {
        th.setAttribute("aria-sort", "none");
      }
    });
  }

  sortButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.getAttribute("data-key");
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        state.sortDir = "asc";
      }
      applyState();
    });
  });

  searchInput.addEventListener("input", function () {
    state.search = searchInput.value;
    applyState();
  });

  inputModalitySelect.addEventListener("change", function () {
    state.inputModality = inputModalitySelect.value;
    applyState();
  });

  outputModalitySelect.addEventListener("change", function () {
    state.outputModality = outputModalitySelect.value;
    applyState();
  });

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

      allModels = data;
      applyState();
    })
    .catch(function () {
      tbody.textContent = "";
      setError("No se pudieron cargar los datos de modelos. Revisa que mock-data.json exista y sea válido.");
    });
});
