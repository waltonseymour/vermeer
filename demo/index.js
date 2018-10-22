let canvasElement = document.getElementById("canvas");

let datasets = [[]];
for (let i = 0; i < 6000; i++) {
  datasets[0].push({ x: i, y: Math.sin((i + j) / 10) });
}
let v = new vermeer.Vermeer({ canvasElement, datasets });

var j = 1;
setInterval(function() {
  let datasets = [[]];
  for (let i = 0; i < 10000; i++) {
    datasets[0].push({ x: i, y: Math.sin((i + 10 * j) / 50) });
  }
  j++;
  v.setDatasets(datasets);
  v.render();
});
