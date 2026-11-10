//practice 1 Array
//const items = ["Keyboard", "Mouse"];
//items.push("Speaker");
//console.log(items);

// push : menambah elemen di awal
// pop : menghapus elemen terakhir
// unshift : menambah elemen di awal
// shift : menghapus elemen pertama
// splice(index,n) : mengahpus elemen pada index tertentu
// splice(index,0,value) : mennambah elemen pada index tertentu


// practice 2
//const fakultas = ["Peternakan", "Ekonomi"];

//fakultas.push("Teknik")
//console.log(fakultas);

//fakultas.splice(0, 2);  
//console.log(fakultas);

//const fakultas = ["Teknik Elektro", "Teknik Mesin", "Teknik Informatika", "Teknik Kimia"];
//console.log(fakultas);

//fakultas.splice(1, 1, "Teknik Industri")
//console.log(fakultas)

//practive 2 object

//const student = {
//    name: "Ricahrd",
//    age: 21,
//    faculty: "Computer Since"
//};

//console.log(student.name);
//console.log(student["faculty"]);

// const student = {
//   name: "Richard",
//   umur: 21,
//   sapa() {
//     return `halo, saya ${this.name} umur saya ${this.umur} tahun`;
//   }
// };

// console.log(student.sapa());


// spread object

// const fakultas = { nama: "Richard", umur: "21", kampus: "UNKLAB" };

// const { nama, umur, kampus } = fakultas;

// console.log(nama);
// console.log(kampus);

// const fakultasBaru = {...fakultas, nama: "scott", umur: "24" };

// console.log (fakultasBaru)
// console.log (fakultas) 

// nested object

// const akun = {
//   nama: "Richard",
//   alamat: {
//     kota: "Manado",
//     kodepos: "98878",
//     sapa() {
//       return `saya tinggal di ${this.kota}, dengan kodepos ${this.kodepos}`;
//     }
//   }
// };

// console.log(akun.alamat.kodepos);
// console.log(akun.alamat.kota);
// console.log(akun.alamat.sapa());



// const mahasiswa = [
//   {id:1, nama: "richard", nilai: 82},
//   {id:2, nama: "elv", nilai: 60},
//   {id:3, nama: "scott", nilai: 67}
// ];

// console.log(mahasiswa[2].nama);

// const dicari = mahasiswa.find(item => item.nama === "elv");
// console.log(dicari);

// for (const nilai of mahasiswa) {
//   console.log(nilai.nama, nilai.nilai);
// }

//tanpa parameter
// function greet(){
//   console.log("Good morning");
// }

// //menggunakan parameter
// function introduce(name){
//   console.log("My name is "+ name);
// }

// greet();
// introduce("Bule");

// const result = add(10, 5, 6, 7);

// function add(a, b, c, d){
//   return a + d - c;
// }

// console.log(result);

// arrow functiongs

// const add = (a, b)=>{
//   return a + b;
// };
// console.log(add(5,15));

// short version:
// const add = (a, b) => a + b;
// console.log(add(5,15));

// const greet = ()=>{
//   console.log("Hello")
// };
// greet();

// modules
// app.js
function add(a, b){
  return a + b;
}

module.expoerts = {add};

// basic.js
const {add} = require ("./app");

console.log(add(5, 3));