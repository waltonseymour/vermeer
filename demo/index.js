let canvasElement = document.getElementById("canvas");

let v = new vermeer.Vermeer({ canvasElement });

var j = 400;

function render() {
  let datasets = [[]];
  for (let i = 0; i < 7000; i++) {
    datasets[0].push({
      x: i,
      y: Math.sin((i + 10) / (0.1 * j)),
      style: `rgb(${(i / 2) % 200}, ${(i / 5) % 200}, ${(i / 10) % 200})`
    });
  }
  j++;
  v.setDatasets(datasets);
  v.render();
  requestAnimationFrame(render);
}

render();
