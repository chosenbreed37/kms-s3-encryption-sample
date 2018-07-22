const fs = require('fs');
const crypto = require('crypto');

const file = 'google.png';
const decryptedFile = 'google-decrypted.png';
const key = 'encryption-key';
const algorithm = 'aes-128-cbc';

fs.readFile(file, (err, buffer) => {

    if (err) throw err;

    const cipher = crypto.createCipher(algorithm, key);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    const decipher = crypto.createDecipher(algorithm, key);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    fs.writeFile(decryptedFile, decrypted, (err) => {
        if (err) throw err;
        console.log('>>> Successfully save file');
    })
});
