const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");
const text = document.getElementById("text");
const soalText = document.getElementById("soalText");
const benarText = document.getElementById("benarText");
const salahText = document.getElementById("salahText");
const drag1 = document.getElementById("drag1");
const drag2 = document.getElementById("drag2");
const drag3 = document.getElementById("drag3");
const dropzone = document.getElementById("drop-zone");
const textseret = document.getElementById("textseret");
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('drawingCanvas');
const clearCanvasButton = document.getElementById('clearCanvas');
const ctx = canvas.getContext('2d');
const canvasSubmit = document.getElementById("canvasSubmit");
const canvas1 = document.getElementById('drawingCanvas1');
const canvas2 = document.getElementById('drawingCanvas2');
const textgambar1 = document.getElementById('selectCanvas1');
const textgambar2 = document.getElementById('selectCanvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const doublecanvas = document.getElementById('canvas-container-two');
const displayusername = document.getElementById('displayusername');
const buttonlogout = document.getElementById('buttonlogout');

let totalsoal = 0;
let totalbenar = 0;
let totalsalah = 0;

window.onload = () => {
  if (!sessionStorage.username) {
      location.href = '/index';
  } else {
      let totalQuestions = parseInt(sessionStorage.totalQuestions || '0');
      if (totalQuestions > 0) {
          let correctAnswers = parseInt(sessionStorage.correctAnswers || '0');
          let wrongAnswers = parseInt(sessionStorage.wrongAnswers || '0');
          benarText.innerText = correctAnswers;
          salahText.innerText = wrongAnswers;
          soalText.innerText = totalQuestions + 1;
          totalsoal = totalQuestions;
          totalbenar = correctAnswers;
          totalsalah = wrongAnswers;
          button2.style.display = "block";
          button3.style.display = "block";
          button4.style.display = "block";
          stats.style.display = "block";

          update(locations[totalQuestions]);
      } else {
        button2.style.display = "block";
        button3.style.display = "block";
        button4.style.display = "block";
        stats.style.display = "block";
        update(locations[0]);
      }
  }
};

buttonlogout.onclick = () => {
  const scoreData = {
      username: sessionStorage.username,
      totalQuestions: totalsoal,
      correctAnswers: totalbenar,
      wrongAnswers: totalsalah
  };

  buttonlogout.disabled = true;

  fetch('/update-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          sessionStorage.clear(); 
          location.href = '/index'; 
      } else {
          alert('Error updating score. Please try again.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Failed to update score. Please try again later.');
  })
  .finally(() => {
      buttonlogout.disabled = false;
  });
};

displayusername.innerText = sessionStorage.username;

let isDrawing = false;  

button1.onclick = startQuiz;

function startQuiz() {
  button2.style.display = "block";
  button3.style.display = "block";
  button4.style.display = "block";
  stats.style.display = "block";
  totalsoal = 0;
  totalbenar = 0;
  totalsalah = 0;
  resetDragDrop();
  clearCanvas();
  update(locations[0]);
}

button1.onclick = startQuiz;

function update(location) {
  if (location.dragAnswer) {
    document.getElementById('drag-drop-container').style.display = 'block';
    textseret.style.display = 'block';
    dropzone.style.display = 'block';
    drag1.innerText = location["button text"][0];
    drag2.innerText = location["button text"][1];
    drag3.innerText = location["button text"][2];
    button1.style.display = button2.style.display = button3.style.display = button4.style.display = 'none';
  } else if(location.canvasQuestion) {
    document.getElementById('drag-drop-container').style.display = 'none';
    textseret.style.display = 'none';
    dropzone.style.display = 'none';
    canvasContainer.style.display = 'block';
    canvasSubmit.style.display = 'block';
    canvasSubmit.innerText = location["button text"][0];
    canvasSubmit.onclick = location["button functions"][0];
  } else if(location.canvasSelection) {
    document.getElementById('canvas-container-two').style.display = 'block';
    document.getElementById('drag-drop-container').style.display = 'none';
    document.getElementById('canvas-container').style.display = 'none';
    button1.style.display = button2.style.display = button3.style.display = button4.style.display = 'none';
    canvas1.style.display = canvas2.style.display ='block';
    textgambar1.style.display = 'block';
    textgambar1.innerText = location["button text"][0];
    textgambar1.onclick = location["button functions"][0];
    textgambar2.style.display = 'block';
    textgambar2.innerText = location["button text"][1];
    textgambar2.onclick = location["button functions"][1];
    if (location.preDrawnCanvas) {
      loadPreDrawnImages();
    }
  } else {
    document.getElementById('drag-drop-container').style.display = 'none';
    textseret.style.display = 'none';
    dropzone.style.display = 'none';
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button4.innerText = location["button text"][3];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    button4.onclick = location["button functions"][3];
  }
  text.innerHTML = location.text;
}

function benar() {
  totalbenar++;
  totalsoal++;
  updateScore();
  sessionStorage.totalQuestions = totalsoal;
  sessionStorage.correctAnswers = totalbenar;
  sessionStorage.wrongAnswers = totalsalah;
  nextQuestion();
}

function salah() {
  totalsalah++;
  totalsoal++; 
  updateScore();
  sessionStorage.totalQuestions = totalsoal;
  sessionStorage.correctAnswers = totalbenar;
  sessionStorage.wrongAnswers = totalsalah;
  nextQuestion();
}


function updateScore() {
  soalText.innerText = totalsoal + 1;
  benarText.innerText = totalbenar; 
  salahText.innerText = totalsalah; 
}

function nextQuestion() {
  if (totalsoal < locations.length) {
    if (totalsoal > 4){
      dropzone.innerText ="";
    }
    update(locations[totalsoal]);
  } else {
    text.innerHTML = "Quiz selesai! <br> Benar: " + totalbenar + ", Salah: " + totalsalah;
    button1.style.display = 'block';
    button1.innerText = "Mengulang";
    dropzone.style.display = 'none';
    textseret.style.display = 'none';
    canvasContainer.style.display = 'none';
    canvas1.style.display = 'none';
    canvas2.style.display = 'none';
    textgambar1.style.display = 'none';
    textgambar2.style.display = 'none';
    doublecanvas.style.display ='none';
    button1.onclick = startQuiz;
    totalsoal = 0;
    totalbenar = 0;
    totalsalah = 0;
    updateScore();
    stats.style.display = "none";
  }
}

const locations = [
  {
    name: "soal1",
    "button text": ["Mengurangi stress", "Meningkatkan berat badan", "Menurunkan kadar oksigen dalam darah", "Menyebabkan kelelahan ekstrem"],
    "button functions": [benar, salah, salah, salah],
    text: "Manakah dari berikut ini yang merupakan manfaat utama dari olahraga teratur?"
  },
  {
    name: "soal2",
    "button text": ["Volume oksigen maksimal yang dapat dihirup tubuh", "Kapasitas paru-paru untuk menyimpan udara", "Jumlah oksigen yang dilepaskan otot saat berkontraksi", "Jumlah karbon dioksida yang dihasilkan selama olahraga"],
    "button functions": [benar, salah, salah, salah],
    text: 'Apa yang dimaksud dengan "VO2 Max"?'
  },
  {
    name: "soal3",
    "button text": ["Rotasi", "Fleksi", "Ekstensi", "Abduksi"],
    "button functions": [benar, salah, salah, salah],
    text: "Gerakan memutar tubuh secara berulang dalam olahraga disebut?"
  },
  {
    name: "soal4",
    "button text": ["Ketahanan otot terhadap cedera", "Kemampuan tubuh untuk mempertahankan kekuatan selama latihan", "Ketahanan jantung dan paru-paru dalam mengangkut oksigen selama aktivitas fisik", "Kemampuan otot untuk berkontraksi dengan cepat"],
    "button functions": [salah, salah, benar, salah],
    text: 'Apa yang dimaksud dengan "kardiorespiratori endurance"?'
  },
  {
    name: "soal5",
    "button text": ["Push-up", "Squat", "Pull-up", "Peregangan"],
    "button functions":  [salah, salah, salah, benar],
    text: "Berikut adalah jenis-jenis latihan kekuatan, kecuali:"
  },
  {
    name: "soal6",
    "button text": ["Sprint", "Tenis", "Endurance", ""],
    "button functions": [null, null, null, null],
    text: "Olahraga yang dilakukan dengan memukul bola menggunakan raket disebut?",
    dragAnswer: "Tenis",
  },
  {
    name: "soal7",
    "button text": ["Sprint", "Tenis", "Endurance", ""],
    "button functions": [null, null, null, null],
    text: "Nomor lari terpendek dalam cabang atletik disebut?",
    dragAnswer: "Sprint",
  },
  {
    name: "soal8",
    "button text": ["Sprint", "Tenis", "Endurance", ""],
    "button functions": [null, null, null, null],
    text: "Istilah untuk latihan fisik yang meningkatkan daya tahan otot disebut?",
    dragAnswer: "Endurance",
  },
  {
    name: "soal9",
    text: "Silakan gambar sebuah bola basket di dalam area canvas:",
    "button text": ["Submit"],
    "button functions": [checkCanvasDrawing],
    dragAnswer: false,
    canvasQuestion: true,
  },
  {
    name: "soal10",
    text: "Pilih gambar lapangan baseball:",
    "button text": ["Gambar 1", "Gambar 2", "", ""],
    "button functions": [salah, benar, null, null],
    dragAnswer: false,
    canvasQuestion: false,
    canvasSelection: true,
    preDrawnCanvas: true,
  }
];

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  checkDragAnswer();
}

let draggedElement = null;

function touchStartHandler(e) {
  draggedElement = e.target;
  e.target.style.opacity = "0.5";  
}

function touchMoveHandler(e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];

}

function touchEndHandler(e) {
  const dropZone = document.elementFromPoint(
    e.changedTouches[0].clientX,
    e.changedTouches[0].clientY
  );
  
  if (dropZone && dropZone.id === "drop-zone") {
    dropZone.appendChild(draggedElement);
    checkDragAnswer();
  }
  
  draggedElement = null;
}

drag1.addEventListener("touchstart", touchStartHandler, { passive: true });
drag2.addEventListener("touchstart", touchStartHandler, { passive: true });
drag3.addEventListener("touchstart", touchStartHandler, { passive: true });

document.addEventListener("touchmove", touchMoveHandler, { passive: false });
document.addEventListener("touchend", touchEndHandler, { passive: true });

function checkDragAnswer() {
  const dropZone = document.getElementById("drop-zone");
  const droppedItem = dropZone.querySelector("span");
  
  if (droppedItem && droppedItem.innerText === locations[totalsoal].dragAnswer) {
    benar();
  } else {
    salah();
  }
}
function resetDragDrop() {
  dropzone.innerHTML = "<p></p>";
  document.getElementById('drag-items').appendChild(drag1);
  document.getElementById('drag-items').appendChild(drag2);
  document.getElementById('drag-items').appendChild(drag3);
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

clearCanvasButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('touchstart', (e) => {
  isDrawing = true;
  const touch = e.touches[0];
  ctx.beginPath();
  ctx.moveTo(touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top);
  e.preventDefault(); 
});

canvas.addEventListener('touchmove', (e) => {
  if (isDrawing) {
    const touch = e.touches[0];
    ctx.lineTo(touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top);
    ctx.stroke();
  }
  e.preventDefault(); 
});

canvas.addEventListener('touchend', () => {
  isDrawing = false;
});

function checkCanvasDrawing() {
  const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let hasDrawing = false;

  for (let i = 0; i < canvasData.data.length; i += 4) {
    if (canvasData.data[i + 3] !== 0) {
      hasDrawing = true;
      break;
    }
  }

  if (hasDrawing) {
    benar();
  } else {
    salah();
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleLogin(event) {
  event.preventDefault();
  window.location.href = 'pertanyaan.html';
}

canvas1.addEventListener('mousedown', (e) => {
  isDrawingCanvas1 = true;
  ctx1.beginPath();
  ctx1.moveTo(e.offsetX, e.offsetY);
});

canvas1.addEventListener('mousemove', (e) => {
  if (isDrawingCanvas1) {
    ctx1.lineTo(e.offsetX, e.offsetY);
    ctx1.stroke();
  }
});

canvas1.addEventListener('mouseup', () => {
  isDrawingCanvas1 = false;
});

canvas2.addEventListener('mousedown', (e) => {
  isDrawingCanvas2 = true;
  ctx2.beginPath();
  ctx2.moveTo(e.offsetX, e.offsetY);
});

canvas2.addEventListener('mousemove', (e) => {
  if (isDrawingCanvas2) {
    ctx2.lineTo(e.offsetX, e.offsetY);
    ctx2.stroke();
  }
});

canvas2.addEventListener('mouseup', () => {
  isDrawingCanvas2 = false;
});

function checkCanvasForDrawing(ctx) {
  const canvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < canvasData.data.length; i += 4) {
    if (canvasData.data[i + 3] !== 0) {
      return true;
    }
  }
  return false;
}

function loadPreDrawnImages() {
  const img1 = new Image();
  img1.src = 'futsal.jpg'; 
  img1.onload = function() {
    ctx1.drawImage(img1, 0, 0, canvas1.width, canvas1.height);
  };

  const img2 = new Image();
  img2.src = 'baseball.png'; 
  img2.onload = function() {
    ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);
  };
}
