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

function encrypt(file) {
    const item_key = file;
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

        putObject(params, (err, success) => {
            if (err) throw err;
            console.log('Successfully encrypted and uploaded: %s', file);
        })
    });
};

function putObject(params, callback) {
    const kmsParams = params.KmsParams
    if (kmsParams && kmsParams.KeyId) {
        kms.generateDataKey(kmsParams, function(err, kmsData) {
            if (err) {
                callback(err, null);
            } else {
                const cipher = crypto.createCipher(algorithm, kmsData.Plaintext.toString('base64'));
                const encrypted = Buffer.concat([cipher.update(params.Body), cipher.final()]);
                params.Body = encrypted;
                params.Metadata = params.Metadata || {};
                params.Metadata[metadataKmsKeyName] = kmsData.CiphertextBlob.toString('base64');
                putObject2(params, callback);
            }
        })
    } else {
        putObject2(params, callback);
    }
}

function putObject2(params, callback) {
  delete params.KmsParams;
  s3.putObject(params, callback);
}


encrypt('google.png');