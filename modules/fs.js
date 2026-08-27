const fs = require('fs');
 
 const content = fs.readFileSync('hello.js', 'utf-8'); 
 console.log(content); 
 
 fs.readFile('hello.js', 'utf-8', (err, data) => {
     if (err) { console.error(err);
         return; } console.log(data);
         }); 
 
 fs.writeFileSync('output.txt', 'Hello, World!');
 
 const path = require('path');
 console.log(path.join(__dirname, 'files', 'data.json'));
 console.log(path.extname('photo.jpg')); 