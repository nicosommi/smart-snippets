import { copy } from 'fs-extra'

export default async function copyAsync(from: string, to: string) {
  return new Promise(
    (resolve, reject) => {
      copy(from, to, (err: Error) => {
        if (err) return reject(err)
        resolve()
      })
    }
  )
}
