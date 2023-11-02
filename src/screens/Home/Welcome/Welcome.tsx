import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../../../utils/color';
import { useScreenOrientation } from '../../../hooks/useScreenOrientation';
import { WelcomePage, WelcomePages } from './WelcomePages';
import Swiper from 'react-native-swiper';

interface Props {
  setRead: () => void
}

export const Welcome = ({setRead}: Props) => {
    const screenOrientation = useScreenOrientation()
    const swiperRef = useRef<Swiper | null>(null);
    const indexRef  = useRef(0)

    const updateIndex = (id: number) => {
        indexRef.current = id
    }

  return (
        <Swiper onIndexChanged={(id: number) => updateIndex(id)} ref={swiperRef} >
          {WelcomePages.map((wp, id) => (
            <Card key={id} style={{...styles.card, height: '100%', width: screenOrientation.isLandscape ? hp('100%') : hp('55%')}}>
              <WelcomePage setRead={setRead} finalPage={id === WelcomePages.length - 1} onScroll={() => indexRef.current !== WelcomePages.length -1 && swiperRef.current?.scrollBy(1)} welcomePage={wp} isLandscape={screenOrientation.isLandscape} />
            </Card>
          ))}
        </Swiper>
  );
};

const styles = StyleSheet.create({
  header: { marginTop: 25, fontFamily: 'Roboto-Bold', fontSize: 30, color: colors.summerBlue },
  content: { fontFamily: 'Roboto-Medium', fontSize: 14, flexWrap: 'wrap', color: colors.summerWhite },
  card: { alignItems: 'center', backgroundColor: colors.summerDarkest, alignSelf: 'center'},
  subcontainer: { display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center', marginHorizontal: 20 },
  container: { flex: 1, alignSelf: 'center' },
  swiper: {paddingVertical: 80},
});
