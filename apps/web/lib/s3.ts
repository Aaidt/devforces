import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "ap-south-1",
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "minio",
    secretAccessKey: "minio123"
  },
  forcePathStyle: true
});
