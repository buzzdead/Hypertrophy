import {DefaultTheme} from 'react-native-paper'

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#2ecc71',
    }
  }

export const colors = MyTheme.colors;