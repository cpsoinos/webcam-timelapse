import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export const putObject = async (Key: string, Body: PutObjectCommandInput['Body'], ContentType: PutObjectCommandInput['ContentType']) => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key,
    Body,
    ContentType
  })

  const result = await R2.send(command)

  return result
}
