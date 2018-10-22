let canvasElement = document.getElementById("canvas");

let datasets = [[]];
for (let i = 0; i < 10000; i++) {
  datasets[0].push({ x: Math.random() * 100, y: Math.random() * 100 });
}

let v = new vermeer.Vermeer({ canvasElement, datasets });
v.render();
