let totalsoal = 1;
let totalbenar = 0;
let totalsalah = 0;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const text = document.querySelector("#text");
const soalText = document.querySelector("#soalText");
const benarText = document.querySelector("#benarText");
const salahText = document.querySelector("#salahText");

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
    name: "selesai",
    "button text": ["Mantab", "Mantab", "Mantab", "Mantab"],
    "button functions": [restart, restart, restart, restart],
    text: "Akhir dari latihan olahraga"
  }
];

// initialize buttons
button1.onclick = soal1;
button2.onclick = soal1;
button3.onclick = soal1;
button4.onclick = soal1;

function update(location) {
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button4.innerText = location["button text"][3];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  button4.onclick = location["button functions"][3];
  text.innerHTML = location.text;
}

function benar(){
  if (totalsoal == 5){
    update(locations[5]);
  }
  totalbenar +=1;
  totalsoal +=1;
  salahText.innerText = totalsalah;
  benarText.innerText = totalbenar;
  soalText.innerText = totalsoal;
  update(locations[totalsoal-1]);
}

function salah(){
  if (totalsoal == 5){
    update(locations[5]);
  }
  totalsalah +=1;
  totalsoal +=1;
  salahText.innerText = totalsalah;
  benarText.innerText = totalbenar;
  soalText.innerText = totalsoal;
  update(locations[totalsoal-1]);
}

function soal1(){
  document.getElementById("stats").style.visibility = "visible";
  update(locations[0]);
}

function restart() {
  totalsoal = 1;
  totalbenar = 0;
  totalsalah = 0;
  salahText.innerText = totalbenar;
  benarText.innerText = totalsalah;
  soalText.innerText = totalsoal;
  update(locations[0]);;
}