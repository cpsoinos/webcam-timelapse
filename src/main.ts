import 'dotenv/config'
import { captureImage } from './captureImage'
import { putObject } from './r2Client'
import { unlinkSync } from 'fs'

const main = async () => {
  const { filename, location, result } = await captureImage()

  const uploadResult = await putObject(`images/${filename}`, result, 'image/jpeg')
  console.log(uploadResult)
  unlinkSync(location)
}

main()
