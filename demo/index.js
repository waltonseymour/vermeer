let targetElement = document.getElementById("canvas");

const onClick = d => {
  console.log(d.y);
};

let v = new vermeer.Plot({ targetElement, onClick });

fetch("https://api.iextrading.com/1.0/stock/spy/chart/2y")
  .then(data => data.json())
  .then(data => {
    const dataset = {
      type: "line",
      style: "green",
      data: data.map(d => {
        return { x: Date.parse(d.date), y: d.close };
      })
    };
    v.addDataset(dataset);
  })
  .then(() =>
    fetch("https://api.iextrading.com/1.0/stock/aapl/chart/2y")
      .then(data => data.json())
      .then(data => {
        const dataset = {
          type: "line",
          style: "blue",
          data: data.map(d => {
            return { x: Date.parse(d.date), y: d.close };
          })
        };

        v.addDataset(dataset);
        v.render();
      })
  );
