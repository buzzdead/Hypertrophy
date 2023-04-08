import {DefaultTheme} from 'react-native-paper'

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#00FE19',
      new: "#66CDAA",
      summerDarkest: '#222831',
      summerDark: '#393E46',
      summerBlue: '#00ADB5',
      summerWhite: '#EEEEEE',
      summerButton: '#007EDA',

    }
  }

export const colors = MyTheme.colors;