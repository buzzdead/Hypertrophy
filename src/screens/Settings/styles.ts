import { StyleSheet } from "react-native";
import { colors } from "../../utils/util";

export const deletionStyles = StyleSheet.create({
    container: {
        padding: 50,
        gap: 20
    },
    subContainer: {
        flexDirection: "column", 
        justifyContent: 'center',
        gap: 5,
    },
    title: {
        textAlign: "center", minWidth: 175, fontFamily: 'Roboto-Bold', fontSize: 22, color: colors.summerDarkest, marginBottom: 10,
    }
})