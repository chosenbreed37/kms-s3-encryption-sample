require('dotenv').config();

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const kms = new AWS.KMS();
const s3 = new AWS.S3();
const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-128-cbc';
const bucketname = 'docs-365';
const kms_key_id = process.env.AWS_KMS_CMK;
const metadataKmsKeyName = 'x-amz-key';

function decrypt(file) {
    const item_key = file;
    const decryptedFile = file.repla('-decrypted');
    
    const params = {
        Bucket: bucketname, 
        Key: item_key, 
    };

    getObject(params, (err, data) => {
        if (err) { throw err; }
        fs.writeFile(decryptedFile, data, function (err) {
            if (err) throw err;
            console.log('Successfully downloaded and decrypted: %s', decryptedFile);
        });
    });
};

function getObject(params, callback) {
    s3.getObject(params, function(err, objectData) {
      if (err) {
        callback(err, null);
      } else {
        var metadata = objectData.Metadata || {};
        var kmsKeyBase64 = metadata[metadataKmsKeyName];
        if (kmsKeyBase64) {
          var kmsKeyBuffer = new Buffer(kmsKeyBase64, 'base64');
          kms.decrypt({CiphertextBlob: kmsKeyBuffer}, function(err, kmsData) {
            if (err) {
              callback(err, null);
            } else {
              const decipher = crypto.createDecipher(algorithm, kmsData.Plaintext.toString('base64'));
              const data = Buffer.concat([decipher.update(objectData.Body), decipher.final()]);
              delete objectData.Metadata[metadataKmsKeyName];
              callback(null, data);
            }
          });
        } else {
          callback(null, objectData.Body);
        }
      }
    });  
}

decrypt('google.png');