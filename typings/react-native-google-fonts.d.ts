declare module "react-native-google-fonts" {
    import { TextStyle } from "react-native";
  
    export function useFonts(fonts: {
      [fontName: string]: number;
    }): [boolean, { [fontName: string]: TextStyle }];
  }
  