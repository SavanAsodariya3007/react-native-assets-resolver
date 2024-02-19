import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Asset } from 'react-native-assets-resolver'

const App = () => {
  const [image, setImage] = useState('')
  useEffect(() => {
    async function fetchData() {
      // const font_response = Asset.fromModule(
      //   require('./assets/fonts/RobotoSlab-Black.ttf')
      // )
      // console.log('font_response ', font_response)

      // const image_response = Asset.fromModule(
      //   require('./assets/images/acheimentIcon.png')
      // )
      // console.log('image_response ', image_response)

      const remote_response = Asset.fromURI(
        'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=600'
      )
      await remote_response.downloadAsync?.()
      setImage(remote_response.localuri)
      console.log('remote_response ', remote_response)

      const remote_font = Asset.fromURI(
        'https://tmpfiles.org/4251063/inter-black.ttf'
      )
      await remote_font.downloadAsync?.()
      console.log('remote_font ', JSON.stringify(remote_font, null, 2))
    }
    fetchData()
  }, [])

  return image !== '' ? (
    <View>
      <Image source={{ uri: image }} style={{ height: 120, width: 120 }} />
    </View>
  ) : (
    <View />
  )
}

export default App
