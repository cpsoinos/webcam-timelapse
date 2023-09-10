import { platform } from 'os'
import { capture } from '@anthonylzq/node-webcam'
import { resolve } from 'path'

export const captureImage = async () => {
  const filename = `${new Date().toISOString()}.jpeg`
  const location = resolve(__dirname, '../images', filename)
  const result = await capture({
    location,
    type: platform(),
    returnType: 'buffer',
    options: {
      width: 1920,
      height: 1080,
      frames: 60,
      output: 'jpeg',
      saveShots: false
    },
  })

  return { filename, location, result }
}
