require('dotenv').config();

const lib = require('./encrypt');
const lib2 = require('./decrypt');

console.log('>>> KMS S3 Encryption Sample');

//lib.encrypt('google.png');

lib2.decrypt('google.png');