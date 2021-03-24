const fs = require('fs');
fs.writeFileSync('notes.txt', 'heyyy im writing to filesync dude!');
fs.appendFileSync('notes.txt', 'is this really happening???');