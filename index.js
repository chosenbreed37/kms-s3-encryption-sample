require('dotenv').config();

const lib = require('./encrypt');

console.log('>>> KMS S3 Encryption Sample');

lib.encrypt('google.png');