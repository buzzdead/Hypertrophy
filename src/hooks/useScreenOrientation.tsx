import { useEffect, useState } from 'react'
import { Dimensions, Platform, ScaledSize } from 'react-native'
import Orientation, { LANDSCAPE, OrientationType } from 'react-native-orientation-locker'


export const useScreenOrientation = () => 
  {
    const isAndroid = () => Platform.OS === 'android'
    const [screenOrientation, setScreenOrientation] = useState(Orientation.getInitialOrientation())

     useEffect(() => {
      const onChange = (result: OrientationType) => {
        setScreenOrientation(result)
      }

      const onChangeAndroid = (result: { screen: ScaledSize }) => {
        return onChange(
          result.screen.height > result.screen.width
            ? OrientationType.PORTRAIT
            : OrientationType['LANDSCAPE-LEFT'],
        )
      }

      if (isAndroid()) {
        Dimensions.addEventListener('change', onChangeAndroid)
      } else {
        Orientation.addOrientationListener(onChange)
      }
    }, [])

    return {
      isLandscape: screenOrientation.includes(LANDSCAPE),
      screenOrientation
    }
  }