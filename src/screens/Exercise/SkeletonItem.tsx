import {View, StyleSheet} from "react-native";
import { colors } from "../../utils/color";

const SkeletonItem: React.FC = () => {
  return (
    <View style={{...styles.container, backgroundColor: "#ddd"}}>
      <View style={styles.subContainer}>
        <View style={{...styles.skeletonText, height: 18}} />
        <View style={{...styles.skeletonText, height: 16}} />
        <View style={{flexDirection: "row", marginTop: 10}}>
          <View style={{...styles.skeletonText, height: 16, flex: 1, marginRight: 10}} />
          <View style={{...styles.skeletonText, height: 16, flex: 1}} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: 'center',
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: colors.summerWhite,
    borderRadius: 10,
    width: "97.5%",
  },
  subContainer: {
    flexDirection: "column",
    width: "100%",
  },
  skeletonText: {
    backgroundColor: 'grey',
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
});

export default SkeletonItem;
