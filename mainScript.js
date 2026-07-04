
// Show/hide info box -------------------------------------------
function showInfo() {
  const box = document.querySelector('.info');
  const button = document.getElementById('get_info');
  if (box.style.display === "none" || box.style.display === "") {
    box.style.display = "block";
    button.style.backgroundColor = "black";
    button.style.color = "white";
  } else {
    box.style.display = "none";
    button.style.backgroundColor = "rgb(204, 204, 204)";
    button.style.color = "black";
  }
}



// Diamond-Square Algorithm ------------------------------------
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
// Diamond step ------------------------------------
function diamond(field, size, chunk, random) {
  for (let i = 0; i < size - 1; i += chunk) {
    for (let j = 0; j < size - 1; j += chunk) {

      let average = (
        field[i + chunk][j + chunk] + // bottomRight
        field[i + chunk][j] + // bottomLeft
        field[i][j] + //topLeft
        field[i][j + chunk] //topRight
      ) / 4;

      field[i + chunk / 2][j + chunk / 2] = average + randomInRange(-random, random);
    }
  }
  return field;
}
// Square step ------------------------------------
function square(field, size, chunk, random) {
  const half = chunk / 2;
  for (let i = 0; i < size; i += half) {
    for (let j = (i + half) % chunk; j < size; j += chunk) {
      let sum = 0;
      let count = 0;

      if (i >= half) { sum += field[i - half][j]; count++; }
      if (i + half < size) { sum += field[i + half][j]; count++; }
      if (j >= half) { sum += field[i][j - half]; count++; }
      if (j + half < size) { sum += field[i][j + half]; count++; }

      field[i][j] = (sum / count) + randomInRange(-random, random);
    }
  }
}

// Diamond-Square for each chunk ------------------------------------
function diamondSquare(field, size, randomFactor, rougness) {
  let chunk = size - 1;
  let random = randomFactor;

  while (chunk > 1) {
    diamond(field, size, chunk, random);
    square(field, size, chunk, random);
    chunk /= 2;
    random *= rougness;
  }

  return field;
}

// Generates height map ------------------------------------
function generate() {
  var randomFactor = Number(document.getElementById('randomness_input').value);
  var size = Number(document.getElementById('input_map_size').value);
  var rougness = Number(document.getElementById('roughness_input').value);
  var startValue = 0;
  var field = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => startValue)
  );

  field[0][0] = Number(document.getElementById('input_a').value);
  field[0][size - 1] = Number(document.getElementById('input_b').value);
  field[size - 1][size - 1] = Number(document.getElementById('input_c').value);
  field[size - 1][0] = Number(document.getElementById('input_d').value);

  console.log("Field [0][0] is now:", field[0][0]);
  console.log("Field [0][size-1] is now:", field[0][size - 1]);
  console.log("Field [size-1][0] is now:", field[size - 1][0]);
  console.log("Field [size-1][size-1] is now:", field[size - 1][size - 1]);

  field = diamondSquare(field, size, randomFactor, rougness);

  drawMap(field, size, randomFactor);
  return field;
}

// Initialize on load ------------------------------------
function init() {
  getRandomInt();
  generate();
}
window.onload = init;

// Get random integers for corner inputs ------------------------------------
function getRandomInt() {
  document.getElementById('input_a').value = Math.floor(Math.random() * 101);
  document.getElementById('input_b').value = Math.floor(Math.random() * 101);
  document.getElementById('input_c').value = Math.floor(Math.random() * 101);
  document.getElementById('input_d').value = Math.floor(Math.random() * 101);
}

// Normalize values between 0 and 1 ------------------------------------
function normalize(field) {
  let minValue = Infinity;
  let maxValue = -Infinity;

  field.forEach(row => {
    row.forEach(value => {
      minValue = Math.min(value, minValue);
      maxValue = Math.max(value, maxValue);
    });
  });

  const range = maxValue - minValue;

  return field.map((row) => {
    return row.map((val) => (val - minValue) / range);
  });
}

// Draw map on canvas ------------------------------------
function drawMap(field, size) {
  const canvas = document.getElementById('map');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const cellSize = canvas.width / size;

  const colorTiers = [
    { threshold: Number(document.getElementById('height06').value) / 100, color: document.getElementById('color07').value },
    { threshold: Number(document.getElementById('height05').value) / 100, color: document.getElementById('color06').value },
    { threshold: Number(document.getElementById('height04').value) / 100, color: document.getElementById('color05').value },
    { threshold: Number(document.getElementById('height03').value) / 100, color: document.getElementById('color04').value },
    { threshold: Number(document.getElementById('height02').value) / 100, color: document.getElementById('color03').value },
    { threshold: Number(document.getElementById('height01').value) / 100, color: document.getElementById('color02').value },
    { threshold: 1, color: document.getElementById('color01').value }
  ];

  for (let i = 1; i < colorTiers.length; i++) {
    if (colorTiers[i - 1].threshold > colorTiers[i].threshold)
      colorTiers[i - 1].threshold = colorTiers[i].threshold;

  }

  const normalized = normalize(field);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = normalized[i][j];
      let chosenColor = colorTiers[colorTiers.length - 1].color;

      for (let tier of colorTiers) {
        if (value <= tier.threshold) {
          chosenColor = tier.color;
          break;
        }
      }

      //get rid of gaps between pixels
      const xStart = Math.floor(j * cellSize);
      const yStart = Math.floor(i * cellSize);
      const xEnd = Math.floor((j + 1) * cellSize);
      const yEnd = Math.floor((i + 1) * cellSize);
      //------------------------------

      ctx.fillStyle = chosenColor;
      ctx.fillRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
    }
  }
}


//custom presets simple solution --------------------------------
const customPresets = {
  addPreset01: null,
  addPreset02: null,
  addPreset03: null
};

function customPreset(id) {
  const btn = document.getElementById(id);

  if (!customPresets[id]) {
    const settings = {
      size: document.getElementById('input_map_size').value,
      a: document.getElementById('input_a').value,
      b: document.getElementById('input_b').value,
      c: document.getElementById('input_c').value,
      d: document.getElementById('input_d').value,
      randomness: document.getElementById('randomness_input').value,
      roughness: document.getElementById('roughness_input').value,
      colors: [
        document.getElementById('color01').value,
        document.getElementById('color02').value,
        document.getElementById('color03').value,
        document.getElementById('color04').value,
        document.getElementById('color05').value,
        document.getElementById('color06').value,
        document.getElementById('color07').value
      ],
      heights: [
        document.getElementById('height01').value,
        document.getElementById('height02').value,
        document.getElementById('height03').value,
        document.getElementById('height04').value,
        document.getElementById('height05').value,
        document.getElementById('height06').value
      ]
    };

    customPresets[id] = settings;

    btn.innerText = id.replace('addPreset', 'custom ');
    btn.style.backgroundColor = "rgb(219, 195, 208)";
  }

  else {
    const data = customPresets[id];

    document.getElementById('input_map_size').value = data.size;
    document.getElementById('input_a').value = data.a;
    document.getElementById('input_b').value = data.b;
    document.getElementById('input_c').value = data.c;
    document.getElementById('input_d').value = data.d;
    document.getElementById('randomness_input').value = data.randomness;
    document.getElementById('roughness_input').value = data.roughness;

    document.getElementById('color01').value = data.colors[0];
    document.getElementById('color02').value = data.colors[1];
    document.getElementById('color03').value = data.colors[2];
    document.getElementById('color04').value = data.colors[3];
    document.getElementById('color05').value = data.colors[4];
    document.getElementById('color06').value = data.colors[5];
    document.getElementById('color07').value = data.colors[6];


    document.getElementById('height01').value = data.heights[0];
    document.getElementById('height02').value = data.heights[1];
    document.getElementById('height03').value = data.heights[2];
    document.getElementById('height04').value = data.heights[3];
    document.getElementById('height05').value = data.heights[4];
    document.getElementById('height06').value = data.heights[5];

    generate();
  }
}

// presets ----------------------------------------------------

document.querySelectorAll('.preset')[0].addEventListener('click', function () {
  document.getElementById('color01').value = "#15612e";
  document.getElementById('color02').value = "#2e9952";
  document.getElementById('color03').value = "#5cc17e";
  document.getElementById('color04').value = "#f7d9a6";
  document.getElementById('color05').value = "#8bd6ee";
  document.getElementById('color06').value = "#49a3d0";
  document.getElementById('color07').value = "#2a70b2";
  document.getElementById('height01').value = "85";
  document.getElementById('height02').value = "70";
  document.getElementById('height03').value = "60";
  document.getElementById('height04').value = "50";
  document.getElementById('height05').value = "43";
  document.getElementById('height06').value = "35";
  document.getElementById('roughness_input').value = "0.5";
  document.getElementById('randomness_input').value = "80";
  generate();
});

document.querySelectorAll('.preset')[1].addEventListener('click', function () {
  document.getElementById('color01').value = "#ffffff";
  document.getElementById('color02').value = "#cccccc";
  document.getElementById('color03').value = "#2e2e2e";
  document.getElementById('color04').value = "#5e5e5e";
  document.getElementById('color05').value = "#957550";
  document.getElementById('color06').value = "#695335";
  document.getElementById('color07').value = "#325d95";
  document.getElementById('height01').value = "80";
  document.getElementById('height02').value = "70";
  document.getElementById('height03').value = "60";
  document.getElementById('height04').value = "52";
  document.getElementById('height05').value = "35";
  document.getElementById('height06').value = "30";
  document.getElementById('roughness_input').value = "0.65";
  document.getElementById('randomness_input').value = "40";
  generate();
});

document.querySelectorAll('.preset')[2].addEventListener('click', function () {
  document.getElementById('color01').value = "#34861d";
  document.getElementById('color02').value = "#55bc4e";
  document.getElementById('color03').value = "#ffc96b";
  document.getElementById('color04').value = "#ffffff";
  document.getElementById('color05').value = "#85fdff";
  document.getElementById('color06').value = "#3e8ad0";
  document.getElementById('color07').value = "#375dcd";
  document.getElementById('height01').value = "70";
  document.getElementById('height02').value = "55";
  document.getElementById('height03').value = "50";
  document.getElementById('height04').value = "49";
  document.getElementById('height05').value = "44";
  document.getElementById('height06').value = "30";
  document.getElementById('roughness_input').value = "0.45";
  document.getElementById('randomness_input').value = "25";
  generate();
});

document.querySelectorAll('.preset')[3].addEventListener('click', function () {
  document.getElementById('color01').value = "#4a4a2a";
  document.getElementById('color02').value = "#6a4a28";
  document.getElementById('color03').value = "#89613c";
  document.getElementById('color04').value = "#8e6a47";
  document.getElementById('color05').value = "#a17651";
  document.getElementById('color06').value = "#78b0a9";
  document.getElementById('color07').value = "#5f9b94";
  document.getElementById('height01').value = "80";
  document.getElementById('height02').value = "75";
  document.getElementById('height03').value = "55";
  document.getElementById('height04').value = "42";
  document.getElementById('height05').value = "35";
  document.getElementById('height06').value = "25";
  document.getElementById('roughness_input').value = "0.6";
  document.getElementById('randomness_input').value = "65";
  generate();
});

document.querySelectorAll('.preset')[4].addEventListener('click', function () {
  document.getElementById('color01').value = "#6d6439";
  document.getElementById('color02').value = "#908b54";
  document.getElementById('color03').value = "#988250";
  document.getElementById('color04').value = "#c4bd8f";
  document.getElementById('color05').value = "#b4ae70";
  document.getElementById('color06').value = "#bea06e";
  document.getElementById('color07').value = "#939fa5";
  document.getElementById('height01').value = "60";
  document.getElementById('height02').value = "55";
  document.getElementById('height03').value = "50";
  document.getElementById('height04').value = "47";
  document.getElementById('height05').value = "23";
  document.getElementById('height06').value = "21";
  document.getElementById('roughness_input').value = "0.7";
  document.getElementById('randomness_input').value = "75";
  generate();
});

document.querySelectorAll('.preset')[5].addEventListener('click', function () {
  document.getElementById('color01').value = "#520801";
  document.getElementById('color02').value = "#811600";
  document.getElementById('color03').value = "#af2700";
  document.getElementById('color04').value = "#dc4600";
  document.getElementById('color05').value = "#e04a00";
  document.getElementById('color06').value = "#f49601";
  document.getElementById('color07').value = "#fde529";
  document.getElementById('height01').value = "75";
  document.getElementById('height02').value = "60";
  document.getElementById('height03').value = "55";
  document.getElementById('height04').value = "40";
  document.getElementById('height05').value = "30";
  document.getElementById('height06').value = "25";
  document.getElementById('roughness_input').value = "0.85";
  document.getElementById('randomness_input').value = "50";
  generate();
});