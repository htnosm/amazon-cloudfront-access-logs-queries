'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();
const aws_lambda = new aws.Lambda();

const targetS3Bucket = process.env.TARGET_S3_BUCKET;
const targetKeyPrefixesToMove = process.env.TARGET_KEY_PREFIXES_TO_MOVE;
const prefixes = targetKeyPrefixesToMove.split(',');
const moveNewAccessLogFunction = process.env.MOVE_NEW_ACCESS_LOG_FUNCTION;

exports.handler = function(event, context, callback) {
  var params = {
    Bucket: targetS3Bucket, 
    MaxKeys: 1000
  };

  (async() => {
    for(let i = 0; i < prefixes.length; i++) {
      let keyList = [];
      params.Prefix = prefixes[i].trim();
      console.log('prefix: ' + params.Prefix);

      for (let continuationToken = null;;) {
        if (continuationToken) {
          params.ContinuationToken = continuationToken;
        }
  
        const res = await s3.listObjectsV2(params).promise();

        res.Contents.map(v => v.Key).forEach(v => {
          keyList.push(v);
        });

        if (!res.IsTruncated) {
          break;
        }
        continuationToken = res.NextContinuationToken;
      }
      //console.log(keyList);

      for (let j = 0; j < keyList.length; j++) {
        console.log('key: ' + keyList[j]);
        let payload = {
          Records: [
            { s3: {
              bucket: {
                name: targetS3Bucket
              },
              object: {
                key: keyList[j]
              }
            },
            prefix: prefixes[i]
            }
          ]
        };
        try {
          let result = await aws_lambda.invoke({
            FunctionName: moveNewAccessLogFunction,
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(payload)
          }).promise();
        } catch (e) {
          console.log("Error while call lambda",e);
        }
      }
    }
  })();
};
