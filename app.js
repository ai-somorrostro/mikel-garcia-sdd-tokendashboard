document.addEventListener("DOMContentLoaded", function () {
  var statusEl = document.getElementById("status");
  var tbody = document.getElementById("models-body");
  var searchInput = document.getElementById("filter-name");
  var inputModalitySelect = document.getElementById("filter-input-modality");
  var outputModalitySelect = document.getElementById("filter-output-modality");
  var sortButtons = Array.prototype.slice.call(
    document.querySelectorAll("#models-table thead button[data-key]")
  );
  var chartsSection = document.querySelector(".charts");
  var priceChart = document.getElementById("price-chart");
  var priceDesc = document.getElementById("price-chart-desc");
  var minisBox = document.getElementById("consumption-minis");
  var minisDesc = document.getElementById("minis-desc");
  var chartsEmpty = document.getElementById("charts-empty");
  var drawer = document.getElementById("detail-drawer");
  var backdrop = document.getElementById("drawer-backdrop");
  var detailTitle = document.getElementById("detail-title");
  var detailBody = document.getElementById("detail-body");
  var detailClose = document.getElementById("detail-close");

  var SVG_NS = "http://www.w3.org/2000/svg";

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
  var selectedName = null;
  var openerName = null;

  function setError(message) {
    statusEl.textContent = message;
    statusEl.classList.add("error");
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  function svgTitle(text) {
    var t = svgEl("title", {});
    t.textContent = text;
    return t;
  }

  function clearSvg(svg) {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  function renderPriceChart(visible) {
    clearSvg(priceChart);

    var W = 640;
    var H = 320;
    var padTop = 12;
    var padBottom = 64;
    var padSide = 8;
    var usableH = H - padTop - padBottom;
    var maxV = Math.max.apply(null, visible.map(function (m) {
      return m.outputPricePerToken;
    }));
    var n = visible.length;
    var groupW = (W - padSide * 2) / n;
    var barW = Math.min(28, groupW * 0.28);

    var title = svgEl("title", { id: "price-chart-title" });
    title.textContent = "Comparativa de precios por token";
    priceChart.appendChild(title);

    visible.forEach(function (model, i) {
      var cx = padSide + groupW * i + groupW / 2;

      [["inputPricePerToken", "series-in", "Input"], ["outputPricePerToken", "series-out", "Output"]].forEach(function (cfg, j) {
        var key = cfg[0];
        var cls = cfg[1];
        var label = cfg[2];
        var h = Math.max(1, (model[key] / maxV) * usableH);
        var x = cx + (j === 0 ? -barW - 1 : 1);
        var bar = svgEl("rect", {
          x: x.toFixed(1),
          y: (padTop + usableH - h).toFixed(1),
          width: barW.toFixed(1),
          height: h.toFixed(1),
          "class": cls
        });
        bar.appendChild(svgTitle(model.name + " · " + label + ": " + String(model[key]) + " $/token"));
        priceChart.appendChild(bar);
      });

      var name = String(model.name);
      var short = name.length > 12 ? name.slice(0, 11) + "…" : name;
      var lab = svgEl("text", {
        x: cx.toFixed(1),
        y: String(H - padBottom + 16),
        "text-anchor": "middle",
        "class": "axis-label"
      });
      lab.textContent = short;
      lab.appendChild(svgTitle(name));
      priceChart.appendChild(lab);
    });

    var maxLab = svgEl("text", {
      x: String(padSide),
      y: String(padTop),
      "class": "axis-value"
    });
    maxLab.textContent = "max " + String(maxV) + " $/tok";
    priceChart.appendChild(maxLab);

    priceDesc.textContent = "Precios input y output de " + n + " modelos en escala lineal.";
  }

  function miniBar(total, inTok, outTok, maxTotal, label) {
    var svg = svgEl("svg", { viewBox: "0 0 200 12", role: "presentation" });
    var wIn = maxTotal > 0 ? (inTok / maxTotal) * 200 : 0;
    var wOut = maxTotal > 0 ? (outTok / maxTotal) * 200 : 0;
    var rIn = svgEl("rect", { x: "0", y: "1", width: Math.max(wIn, total > 0 ? 1 : 0).toFixed(1), height: "10", "class": "series-in" });
    var rOut = svgEl("rect", { x: wIn.toFixed(1), y: "1", width: Math.max(wOut, total > 0 ? 1 : 0).toFixed(1), height: "10", "class": "series-out" });
    rIn.appendChild(svgTitle(label + " input: " + String(inTok) + " tokens"));
    rOut.appendChild(svgTitle(label + " output: " + String(outTok) + " tokens"));
    svg.appendChild(rIn);
    svg.appendChild(rOut);
    return svg;
  }

  function renderMinis(visible) {
    minisBox.textContent = "";

    var title = document.createElement("p");
    title.id = "minis-title";
    title.className = "sr-only";
    title.textContent = "Consumo de tokens por modelo";
    minisBox.appendChild(title);

    var maxDay = Math.max.apply(null, visible.map(function (m) {
      return m.inputTokensDay + m.outputTokensDay;
    }));
    var maxWeek = Math.max.apply(null, visible.map(function (m) {
      return m.inputTokensWeek + m.outputTokensWeek;
    }));

    visible.forEach(function (model) {
      var row = document.createElement("div");
      row.className = "mini-row";

      var name = document.createElement("span");
      name.className = "mini-name";
      name.textContent = String(model.name);
      name.title = String(model.name);
      row.appendChild(name);

      var bars = document.createElement("div");
      bars.className = "mini-bars";

      var dayTotal = model.inputTokensDay + model.outputTokensDay;
      var weekTotal = model.inputTokensWeek + model.outputTokensWeek;

      [["Día", dayTotal, model.inputTokensDay, model.outputTokensDay, maxDay],
       ["Semana", weekTotal, model.inputTokensWeek, model.outputTokensWeek, maxWeek]].forEach(function (cfg) {
        var line = document.createElement("div");
        line.className = "mini-line";
        var tag = document.createElement("span");
        tag.className = "mini-tag";
        tag.textContent = cfg[0] + " " + (cfg[0] === "Día" ? (dayTotal / 1e6).toFixed(2) : (weekTotal / 1e6).toFixed(1)) + "M";
        line.appendChild(tag);
        line.appendChild(miniBar(cfg[1], cfg[2], cfg[3], cfg[4], String(model.name) + " " + cfg[0].toLowerCase()));
        bars.appendChild(line);
      });

      row.appendChild(bars);
      minisBox.appendChild(row);
    });

    var desc = document.createElement("p");
    desc.id = "minis-desc";
    desc.className = "sr-only";
    desc.textContent = "Consumo diario y semanal apilado input mas output de " + visible.length + " modelos.";
    minisBox.appendChild(desc);
    minisDesc = desc;
  }

  function renderCharts(visible) {
    chartsSection.hidden = false;
    if (visible.length === 0) {
      clearSvg(priceChart);
      minisBox.textContent = "";
      chartsEmpty.hidden = false;
      return;
    }
    chartsEmpty.hidden = true;
    renderPriceChart(visible);
    renderMinis(visible);
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
    renderCharts(visible);
    updateSortIndicators();

    if (selectedName !== null) {
      var stillVisible = false;
      for (var i = 0; i < visible.length; i++) {
        if (String(visible[i].name) === selectedName) {
          stillVisible = true;
          break;
        }
      }
      if (!stillVisible) {
        closeDetail();
      }
    }
  }

  function render(visible) {
    tbody.textContent = "";

    visible.forEach(function (model) {
      var row = document.createElement("tr");
      row.setAttribute("tabindex", "0");
      row.setAttribute("data-name", String(model.name));
      row.setAttribute("title", "Ver detalle de " + String(model.name));
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

  function findModel(name) {
    for (var i = 0; i < allModels.length; i++) {
      if (String(allModels[i].name) === name) {
        return allModels[i];
      }
    }
    return null;
  }

  function globalMax(fn) {
    if (allModels.length === 0) {
      return 0;
    }
    return Math.max.apply(null, allModels.map(fn));
  }

  function detailRow(dl, term, value) {
    var dt = document.createElement("dt");
    dt.textContent = term;
    var dd = document.createElement("dd");
    dd.textContent = value;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function detailBlock(title, rows) {
    var sec = document.createElement("section");
    sec.className = "detail-block";
    var h = document.createElement("h3");
    h.textContent = title;
    sec.appendChild(h);
    var dl = document.createElement("dl");
    rows.forEach(function (r) {
      detailRow(dl, r[0], r[1]);
    });
    sec.appendChild(dl);
    return sec;
  }

  function renderDetail(model) {
    detailBody.textContent = "";
    detailTitle.textContent = String(model.name);
    drawer.setAttribute("aria-label", "Detalle de " + String(model.name));

    var costDay = model.inputTokensDay * model.inputPricePerToken +
      model.outputTokensDay * model.outputPricePerToken;
    var costWeek = model.inputTokensWeek * model.inputPricePerToken +
      model.outputTokensWeek * model.outputPricePerToken;
    var dayTotal = model.inputTokensDay + model.outputTokensDay;
    var allDay = 0;
    allModels.forEach(function (m) {
      allDay += m.inputTokensDay + m.outputTokensDay;
    });
    var share = allDay > 0 ? (dayTotal / allDay) * 100 : 0;
    var ratio = model.inputTokensDay > 0 ? model.outputTokensDay / model.inputTokensDay : 0;
    var rank = 1;
    allModels.forEach(function (m) {
      if (m.ttft_ms < model.ttft_ms) {
        rank++;
      }
    });

    detailBody.appendChild(detailBlock("Precios", [
      ["Input $/token", String(model.inputPricePerToken)],
      ["Output $/token", String(model.outputPricePerToken)],
      ["Ratio output/input", (model.outputPricePerToken / model.inputPricePerToken).toFixed(2) + "x"]
    ]));

    detailBody.appendChild(detailBlock("Latencia", [
      ["TTFT", String(model.ttft_ms) + " ms"],
      ["Ranking TTFT", rank + " de " + allModels.length]
    ]));

    detailBody.appendChild(detailBlock("Modalidades", [
      ["Entrada", String(model.inputModality)],
      ["Salida", String(model.outputModality)]
    ]));

    detailBody.appendChild(detailBlock("Consumo y coste", [
      ["Tokens in día", String(model.inputTokensDay)],
      ["Tokens out día", String(model.outputTokensDay)],
      ["Tokens in semana", String(model.inputTokensWeek)],
      ["Tokens out semana", String(model.outputTokensWeek)],
      ["Coste estimado día", "$" + costDay.toFixed(2)],
      ["Coste estimado semana", "$" + costWeek.toFixed(2)],
      ["Cuota del total diario", share.toFixed(1) + "%"],
      ["Ratio out/in diario", ratio.toFixed(2) + "x"]
    ]));

    var priceSec = document.createElement("section");
    priceSec.className = "detail-block";
    var priceH = document.createElement("h3");
    priceH.textContent = "Precio input vs output";
    priceSec.appendChild(priceH);
    var maxPrice = globalMax(function (m) { return m.outputPricePerToken; });
    var priceSvg = svgEl("svg", { viewBox: "0 0 200 60", role: "img" });
    var priceTitle = svgTitle("Precio de " + String(model.name));
    priceSvg.appendChild(priceTitle);
    [["inputPricePerToken", "series-in", "Input", 8], ["outputPricePerToken", "series-out", "Output", 34]].forEach(function (cfg) {
      var h = maxPrice > 0 ? Math.max(1, (model[cfg[0]] / maxPrice) * 44) : 1;
      var bar = svgEl("rect", {
        x: "20", y: String(52 - h), width: "150", height: String(h), "class": cfg[1]
      });
      bar.appendChild(svgTitle(cfg[2] + ": " + String(model[cfg[0]]) + " $/token"));
      priceSvg.appendChild(bar);
      var lab = svgEl("text", { x: "4", y: String(cfg[3]), "class": "axis-label" });
      lab.textContent = cfg[2];
      priceSvg.appendChild(lab);
    });
    priceSec.appendChild(priceSvg);
    detailBody.appendChild(priceSec);

    var consSec = document.createElement("section");
    consSec.className = "detail-block";
    var consH = document.createElement("h3");
    consH.textContent = "Consumo día y semana";
    consSec.appendChild(consH);
    var maxDay = globalMax(function (m) { return m.inputTokensDay + m.outputTokensDay; });
    var maxWeek = globalMax(function (m) { return m.inputTokensWeek + m.outputTokensWeek; });
    consSec.appendChild(miniBar(dayTotal, model.inputTokensDay, model.outputTokensDay, maxDay, String(model.name) + " día"));
    consSec.appendChild(miniBar(
      model.inputTokensWeek + model.outputTokensWeek,
      model.inputTokensWeek, model.outputTokensWeek, maxWeek, String(model.name) + " semana"));
    detailBody.appendChild(consSec);
  }

  function openDetail(name, openerRow) {
    var model = findModel(name);
    if (!model) {
      return;
    }
    selectedName = String(model.name);
    openerName = openerRow && openerRow.getAttribute
      ? openerRow.getAttribute("data-name")
      : selectedName;
    renderDetail(model);
    drawer.hidden = false;
    backdrop.hidden = false;
    window.requestAnimationFrame(function () {
      drawer.classList.add("open");
      backdrop.classList.add("open");
    });
    detailClose.focus();
  }

  function focusOpener() {
    var target = null;
    if (openerName) {
      var rows = tbody.querySelectorAll('tr[data-name]');
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute("data-name") === openerName) {
          target = rows[i];
          break;
        }
      }
    }
    (target || searchInput).focus();
  }

  function closeDetail() {
    if (selectedName === null) {
      return;
    }
    selectedName = null;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    window.setTimeout(function () {
      if (selectedName === null) {
        drawer.hidden = true;
        backdrop.hidden = true;
      }
    }, 260);
    focusOpener();
  }

  function rowFromEvent(ev) {
    var el = ev.target;
    while (el && el !== tbody) {
      if (el.tagName === "TR" && el.getAttribute("data-name")) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  tbody.addEventListener("click", function (ev) {
    var row = rowFromEvent(ev);
    if (row) {
      openDetail(row.getAttribute("data-name"), row);
    }
  });

  tbody.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" && ev.key !== " ") {
      return;
    }
    var row = rowFromEvent(ev);
    if (row) {
      ev.preventDefault();
      openDetail(row.getAttribute("data-name"), row);
    }
  });

  detailClose.addEventListener("click", closeDetail);

  backdrop.addEventListener("click", closeDetail);

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && selectedName !== null) {
      closeDetail();
    }
  });

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
      clearSvg(priceChart);
      minisBox.textContent = "";
      chartsSection.hidden = true;
      selectedName = null;
      drawer.hidden = true;
      backdrop.hidden = true;
      setError("No se pudieron cargar los datos de modelos. Revisa que mock-data.json exista y sea válido.");
    });
});
