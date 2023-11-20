// const AWS = require("aws-sdk");
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

export const s3 = new AWS.S3();
