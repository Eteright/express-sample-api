// async_testing.js
'use strict';

// async read file testing
console.log("issue async read file testing...");
var fs = require('fs');
var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};
async function asyncReadFile(){
  var f1 = await readFile('./test/data/a.txt');
  var f2 = await readFile('./test/data/b.txt');
  console.log(f1.toString());
  console.log(f2.toString());
};
asyncReadFile();
console.log("--- async read file code endline ---");

// async timer testing
console.log("issue async timer testing...");
const timeout = function (delay) {  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
async function timer () {  
  console.log('=> timer started')
  await Promise.resolve(timeout(100));
  console.log('=> timer finished')
}
timer();
console.log("--- async timer code endline ---");
