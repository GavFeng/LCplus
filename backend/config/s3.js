require("dotenv").config();
const sharp = require("sharp");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.S3_BUCKET;
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

// Configure S3 Image Upload
const uploadImageToS3 = async (fileBuffer, problemId = "general") => {
  // Process Image 800px WebP 80% quality
  const buffer = await sharp(fileBuffer)
    .resize(800)
    .webp({ quality: 80 })
    .toBuffer();

  const key = `problems/${problemId}/${Date.now()}.webp`;

  // Send to the AWS S3 bucket
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "image/webp",
  }));

  if (!CLOUDFRONT_URL) throw new Error("CLOUDFRONT_URL not set");

  // Construct the image URL using CloudFront
  const imageUrl = `${CLOUDFRONT_URL.replace(/\/$/, "")}/${key}`;

  return { imageUrl, key };
};

const deleteImageFromS3 = async (key) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Failed to delete image from S3:", key, err.message);
  }
};

module.exports = { uploadImageToS3, deleteImageFromS3 };