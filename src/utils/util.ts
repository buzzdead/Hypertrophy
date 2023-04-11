import {DefaultTheme} from 'react-native-paper'

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#42e942',
      new: "#66CDAA",
      summerDarkest: '#222831',
      summerDark: '#393E46',
      summerBlue: '#00ADB5',
      summerWhite: '#EEEEEE',
      summerButton: '#007EDA',
      sidebarColor: '#9a9e9a',
      test1: '#A9907E',
      test2: '#ABC4AA',
      test3: '#675D50',
      test4: '#19A7CE',
      test5: '#146C94',
      test6: '#000000',
      test7: '#FFBF9B',
      test8: '#B46060',

    }
  }

export const colors = MyTheme.colors;

export const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
