import 'dotenv/config'
import { captureImage } from './captureImage'
import { putObject } from './r2Client'
import { unlink } from 'fs/promises'

const main = async () => {
  const { filename, location, result } = await captureImage()

  const uploadResult = await putObject(`images/${filename}`, result, 'image/jpeg')
  console.log(uploadResult)
  await unlink(location)
}

main()
