const AWS = require("aws-sdk");

const uploadToS3 = async ({ content, key, folder = "_media" }) => {
  const { S3_BUCKET } = process.env;

  AWS.config.setPromisesDependency(require("bluebird"));
  AWS.config.update({
    region: "us-east-1",
  });
  const S3 = new AWS.S3();
  const base64Data = Buffer.from(
    content.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const fileName = `google-slide-${key}.png`;
  var params = {
    Key: `${folder}/${fileName}`,
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: "image/png",
    Bucket: S3_BUCKET,
    ACL: "public-read",
    Metadata: {
      CacheControl: "public, max-age=31536000",
    },
  };

  await S3.upload(params).promise();
  return `https://${S3_BUCKET}.s3.amazonaws.com/${folder}/${fileName}`;
};

module.exports = { uploadToS3 };
