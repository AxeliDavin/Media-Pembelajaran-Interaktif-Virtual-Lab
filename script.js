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

let totalsoal = 0;
let totalbenar = 0;
let totalsalah = 0;

/*loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    window.location.href = "pertanyaan.html"; 
  }
});*/

button1.onclick = startQuiz;

function startQuiz() {
  button2.style.display = "block";
  button3.style.display = "block";
  button4.style.display = "block";
  stats.style.display = "block";
  totalsoal = 0;
  totalbenar = 0;
  totalsalah = 0;
  update(locations[0]);
}

button1.onclick = startQuiz;

function update(location) {
  if (location.dragAnswer) {
    // Show drag-drop container for drag and drop questions
    document.getElementById('drag-drop-container').style.display = 'block';
    drag1.innerText = location["button text"][0];
    drag2.innerText = location["button text"][1];
    drag3.innerText = location["button text"][2];
    button1.style.display = button2.style.display = button3.style.display = button4.style.display = 'none';
  } else {
    document.getElementById('drag-drop-container').style.display = 'none';
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
  nextQuestion();
}

function salah() {
  totalsalah++;
  totalsoal++; 
  updateScore();
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
    /*button2.style.display = button3.style.display = button4.style.display = 'none';*/
    button1.innerText = "Mengulang";
    dropzone.style.display = 'none';
    textseret.style.display = 'none';
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
  }
];

// Drag and Drop Functions
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

function checkDragAnswer() {
  const dropZone = document.getElementById("drop-zone");
  const droppedItem = dropZone.querySelector("span");
  
  if (droppedItem && droppedItem.innerText === locations[totalsoal].dragAnswer) {
    benar();
  } else {
    salah();
  }
}