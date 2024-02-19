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
