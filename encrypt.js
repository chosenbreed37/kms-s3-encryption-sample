const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const s3encrypt = require('node-s3-encryption-client');
const crypto = require('crypto');
const fs = require('fs');

const decryptedFile = 'google-decrypted.png';

const algorithm = 'aes-128-ecb';
const algorithm2 = 'AES_256';
const bucketname = 'docs-365';
const kms_key_id = process.env.AWS_KMS_CMK;

module.exports.decrypt = function () {
    
};

module.exports.encrypt = function(file) {
    const item_key = bucketname.concat('/', file);
    fs.readFile(file, (err, buffer) => {

        const params = {
            Body: buffer,
            Bucket: bucketname,
            Key: item_key,
            KmsParams: {
                KeyId: kms_key_id,
                KeySpec: 'AES_256'
            }
        };

        // Use provided putObject function
        s3encrypt.putObject(params, (err, success) => {
            if (err) throw err;
            console.log('Successfully encrypted and uploaded: %s', file);
        })
        //    if (err) throw err;

        // const cipher = crypto.createCipher(algorithm, key);

        // const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

        // const decipher = crypto.createDecipher(algorithm, key);
        // const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        // fs.writeFile(decryptedFile, decrypted, (err) => {
        //     if (err) throw err;
        //     console.log('>>> Successfully save file');
        // })
    });
};