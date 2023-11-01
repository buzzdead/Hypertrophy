import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { colors } from '../utils/util';
import Contingent from './Contingent';

interface NavigationProps {
  textDisplay: number | string;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleGoToLastPage: () => void;
  handleGoToFirstPage: () => void;
  firstPage: boolean;
  lastPage: boolean;
  sideBtnTxt: string;
  sideBtnFnc: () => void;
  disableNavigation?: Boolean;
}

export const Navigation: React.FC<NavigationProps> = React.memo(
  ({
    textDisplay,
    handleNextPage,
    handlePrevPage,
    handleGoToLastPage,
    handleGoToFirstPage,
    firstPage,
    lastPage,
    sideBtnTxt,
    sideBtnFnc,
    disableNavigation = false,
  }) => {
    const myStyles = styles(!disableNavigation);

    return (
      <SafeAreaView>
        <Contingent style={myStyles.pagination} shouldRender={!disableNavigation}>
          <CustomButton
            titleColor={firstPage ? colors.summerDark : colors.summerBlue}
            onPress={handleGoToFirstPage}
            backgroundColor={colors.summerWhite}
            size='S'
            fontSize={30}
            title={'<<'}
          />
          <CustomButton
            size='S'
            titleColor={firstPage ? colors.summerDark : colors.summerBlue}
            fontSize={30}
            backgroundColor={colors.summerWhite}
            onPress={handlePrevPage}
            title={'<'}
          />
          <Text
            style={{
              fontFamily: 'Roboto-Black',
              minWidth: 75,
              textAlign: 'center',
              color: colors.summerDark,
              fontSize: 20,
              paddingTop: 3,
            }}
          >{`${typeof textDisplay === 'number' ? 'Week' : ''} ${textDisplay} `}</Text>
          <CustomButton
            titleColor={lastPage ? colors.summerDark : colors.summerBlue}
            onPress={handleNextPage}
            backgroundColor={colors.summerWhite}
            size='S'
            fontSize={30}
            title={'>'}
          />
          <CustomButton
            titleColor={lastPage ? colors.summerDark : colors.summerBlue}
            onPress={handleGoToLastPage}
            backgroundColor={colors.summerWhite}
            size='S'
            fontSize={30}
            title={'>>'}
          />
        </Contingent>
        <View style={{ bottom: 2, right: 2, position: 'absolute' }}>
          <CustomButton
            title={sideBtnTxt}
            fontSize={typeof textDisplay === 'number' ? 32 : 24}
            titleColor={colors.accent}
            backgroundColor={colors.summerDarkest}
            onPress={sideBtnFnc} // () => navigation?.navigate("AddExercise", {previousExercise: null})}
          />
        </View>
      </SafeAreaView>
    );
  }
);

const styles = (a: boolean | Boolean) =>
  StyleSheet.create({
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.summerWhite,
      width: '100%',
      paddingTop: -3,
      paddingBottom: 5,
      borderTopWidth: a ? 0.5 : 0,
    },
  });
