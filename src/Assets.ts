import { getAssetByID } from 'react-native/Libraries/Image/AssetRegistry'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

import * as Utils from './utils'

export type AssetDescriptor = {
  name: string
  type: string
  hash?: string | null
  uri: string
  width?: number | null
  height?: number | null
}

type DownloadPromiseCallbacks = {
  resolve: (value?: unknown) => void
  reject: (error: Error) => void
}

export class Asset {
  name: string
  type: string
  hash: string | null = null
  uri: string
  width: number | null = null
  height: number | null = null

  // states for download server resource
  localuri: string | null = null
  downloading: boolean = false
  downloaded: boolean = false

  // Tracking all the downloading resources and it's state
  _downloadCallbacksQueue: DownloadPromiseCallbacks[] = []

  constructor(args: AssetDescriptor) {
    const { name, type, uri, width, height, hash = null } = args
    this.name = name
    this.type = type
    this.hash = hash
    this.uri = uri

    if (typeof width === 'number') {
      this.width = width
    }
    if (typeof height === 'number') {
      this.height = height
    }
  }

  static fromModule(module_id: number | string): Asset {
    if (typeof module_id === 'string') {
      return Asset.fromURI(module_id)
    }

    const meta = getAssetByID(module_id)
    const { uri } = resolveAssetSource(module_id)
    return new Asset({
      name: meta.name,
      type: meta.type,
      hash: meta.hash,
      width: meta.width,
      height: meta.height,
      uri,
    })
  }

  static fromURI(uri: string): Asset {
    let type = ''
    if (uri.indexOf(';base64') > -1) {
      type = uri.split(';')[0].split('/')[1]
    } else {
      const extension = Utils.getFileExtension(uri)
      type = extension.startsWith('.') ? extension.substring(1) : extension
    }

    const asset = new Asset({
      name: '',
      type,
      hash: null,
      uri,
    })

    return asset
  }

  async downloadAsync(): Promise<this> {
    if (this.downloaded) {
      return this
    }

    if (this.downloading) {
      await new Promise((resolve, reject) => {
        this._downloadCallbacksQueue.push({ resolve, reject })
      })
      return this
    }

    try {
      this.localuri = await Utils.downloadAsync({
        uri: this.uri,
        type: this.type,
        hash: this.hash,
      })
      this.downloaded = true
      this._downloadCallbacksQueue.forEach(({ resolve }) => resolve())
    } catch (e) {
      this._downloadCallbacksQueue.forEach(({ reject }) =>
        reject(e as unknown as Error)
      )
      throw e
    } finally {
      this.downloading = false
      this._downloadCallbacksQueue = []
    }
    return this
  }
}
