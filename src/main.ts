import 'dotenv/config'
import { captureImage } from './captureImage'
import { putObject } from './r2Client'
import { unlinkSync } from 'fs'

const main = async () => {
  const { filename, location, result } = await captureImage()

  try {
    await putObject(`images/${filename}`, result, 'image/jpeg')
    console.log('Uploaded image to R2: ', `images/${filename}`)
  } catch (err) {
    console.error(err)
  }
  unlinkSync(location)
}

main()
