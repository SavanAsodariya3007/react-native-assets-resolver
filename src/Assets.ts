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

export class Asset {
  name: string
  type: string
  hash: string | null = null
  uri: string
  localuri: string | null = null
  width: number | null = null
  height: number | null = null

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
}
