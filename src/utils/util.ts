import {DefaultTheme} from 'react-native-paper'

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#2ecc71',
      new: "#66CDAA",
      test: "#F5FFFA",
      test2: "#48D1CC",
    }
  }

export const colors = MyTheme.colors;