import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Asset } from 'react-native-assets-resolver'


const App = () => {
  useEffect(() => {
    const font_response = Asset.fromModule(require('./assets/fonts/RobotoSlab-Black.ttf'))
    console.log("font_response ", font_response)

    const image_response = Asset.fromModule(require('./assets/images/acheimentIcon.png'))
    console.log("image_response ", image_response)
  },[]);

  return <View />
}

export default App
