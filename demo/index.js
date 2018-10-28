let canvasElement = document.getElementById("canvas");

let v = new vermeer.Vermeer({ canvasElement });

fetch("https://api.iextrading.com/1.0/stock/aapl/chart/5y")
  .then(data => data.json())
  .then(data => {
    const datasets = [
      {
        type: "line",
        style: "blue",
        data: data.map(d => {
          return { x: Date.parse(d.date), y: d.close };
        })
      }
    ];
    v.setDatasets(datasets);
    v.render();
  });
