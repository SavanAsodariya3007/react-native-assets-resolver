import computeMd5 from 'blueimp-md5'
import * as FileSystem from 'react-native-fs'
import URL from 'url-parse'

export function getFilename(url: string): string {
  const { pathname } = new URL(url, {})
  return pathname.substring(pathname.lastIndexOf('/') + 1)
}

export function getFileExtension(url: string): string {
  const filename = getFilename(url)
  const dotIndex = filename.lastIndexOf('.')
  return dotIndex > 0 ? filename.substring(dotIndex) : ''
}

interface DownloadParams {
  uri: string
  hash: string | null
  type: string
}
export async function downloadAsync({
  uri,
  hash,
  type,
}: DownloadParams): Promise<string> {
  if (uri.startsWith('file://')) {
    return uri
  }
  const cacheFileId = hash || computeMd5(uri)
  const localUri = `file://${FileSystem.CachesDirectoryPath}/ExponentAsset-${cacheFileId}.${type}`
  await FileSystem.downloadFile({
    fromUrl: uri,
    toFile: localUri,
  }).promise
  return localUri
}
