import {DefaultTheme} from "react-native-paper";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#42e942",
    new: "#66CDAA",
    summerDarkest: "#222831",
    summerDark: "#393E46",
    summerBlue: "#00ADB5",
    summerWhite: "#EEEEEE",
    summerButton: "#007EDA",
    sidebarColor: "#F2F8D8",
    graphColor: "#096625",
    delete: '#Cb2727',
    test1: "#A9907E",
    test2: "#ABC4AA",
    test3: "#675D50",
    test4: "#19A7CE",
    test5: "#146C94",
    test6: "#000000",
    test7: "#FFBF9B",
    test8: "#B46060",
    categories: {
      Shoulders: "#067228",
      Shoulder: "#067228",
      Legs: "#2B7206",
      Arms: "#928128",
      Abs: "#4D0672",
      Back: "#066F72",
      Chest: "#721906",
      Default: "#0A0672",
    },
  },
};
export type CatColors = keyof typeof MyTheme.colors.categories;

export const colors = MyTheme.colors;
