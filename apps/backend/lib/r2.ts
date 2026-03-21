import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "us-east-1",
  // endpoint: `${process.env.S3_API}`,
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string || "admin",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string || "password",
  },
  forcePathStyle: true,
});

// r2.send(new CreateBucketCommand({ Bucket: "candidates" })).then(() => {
//   console.log("Bucket created successfully");
// }).catch((err) => {
//   console.log("Error creating bucket: ", err);
// });