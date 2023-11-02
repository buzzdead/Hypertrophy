import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../utils/color';
import React from 'react';
import CustomButton from '../../../components/CustomButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Contingent from '../../../components/Contingent';

export type WelcomePageType = { header: string; content: string[] };

export const WelcomePages: WelcomePageType[] = [
  {
    header: 'Welcome',
    content: [
      'Please take a moment and follow this guide to quickly get you started.',
      'With this app you can keep track of your exercises. Before doing that you might want to take a look at the categories and the exercise types.',
      'You can do so by going to settings and click on categories or exercise types, there you can manage them as you want.',
      'Click next to see how to add a new exercise, and also how to add a new exercise type or a new category',
    ],
  },
  {
    header: 'Exercises',
    content: [
      "There are two ways to add an exercise, but let's focus on the main one.",
      'To add an exercise, simply navigate to the exercises tab down at the bottom, then click on the + icon in the bottom right of the screen.',
      'Next thing you do is select the category and exercise type, then specify sets reps and weight.',
      'You can also add new exercise types and categories here by clicking on the + icon to the right..',
    ],
  },
  {
    header: 'Plans',
    content: [
      'The other way to add an exercise is to first add a plan, then later complete it by clicking on the finish icon on the plan.',
      'To add a new plan, you click on the + button in the Home tab down at the bottom, specify similar to an exercise.',
      'If you have a group of exercises you do one day of the week, you can instead of adding a plan set up a group of plans that you can use to generate all the plans with one click.',
      'To do that you click on the + button in the home screen, then to presets on the top.',
    ],
  },
  {
    header: 'Metric',
    content: [
      'The final thing you need to know is about metrics.',
      'In this app every exercise is calculated to a metric to keep a score of your exercises.',
      'The metric is a calculation based upon the sets, reps and weight you did for an individual exercise.',
      'So if you generally do exercises that is 3 sets x 10 reps, you are already set. If not you can go to settings, then to metrics, and specify how many sets and reps you generally do. ',
    ],
  },
];

interface Props {
  welcomePage: WelcomePageType;
  isLandscape: boolean;
  onScroll: () => void;
  finalPage: boolean;
  setRead: () => void
}

export const WelcomePage = ({ welcomePage, isLandscape, onScroll, finalPage, setRead }: Props) => {
  return (
    <ScrollView>
      <View style={{display: 'flex', alignContent: 'flex-start', gap: 20}}>
      <View style={{ ...styles.subcontainer, width: isLandscape ? hp('80%') : hp('40%'), paddingVertical: isLandscape ? 0 : 50  }}>
        <Text style={styles.header}>{welcomePage.header}</Text>
        {welcomePage.content.map((c, id) => (
          <Text key={id} style={styles.content}>
            {c}
          </Text>
        ))}
        </View>

        <View style={{ display: 'flex', paddingHorizontal: 20, gap: 50, flexDirection: 'row', width: '100%' }}>
          <CustomButton
            title="I've seen enough"
            size='SS'
            onPress={setRead}
            backgroundColor={colors.summerWhite}
            titleColor={colors.summerBlue}
          />
          <Contingent shouldRender={!finalPage}>
            <CustomButton size='SS' title='Next' onPress={onScroll} backgroundColor={colors.summerButton} titleColor={colors.summerWhite} />
            <CustomButton size='SS' title='Ok' onPress={setRead} backgroundColor={colors.summerButton} titleColor={colors.summerWhite} />
          </Contingent>
        </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { marginTop: 25, fontFamily: 'Roboto-Bold', fontSize: 30, color: colors.summerBlue, flex: 1, textAlign: 'center', display: 'flex', width: '100%', justifyContent: 'center' },
  content: { fontFamily: 'Roboto-Medium', fontSize: 14, flexWrap: 'wrap', color: colors.summerWhite, flex: 1, flexGrow: 2 },
  card: { alignItems: 'center', backgroundColor: colors.summerDarkest, width: hp('50%') },
  subcontainer: { display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'flex-start', marginHorizontal: 20},
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
