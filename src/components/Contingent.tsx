import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface ContingentProps {
  children: React.ReactNode;
  shouldRender?: boolean | null | undefined;
  disableTernary?: boolean;
  style?: StyleProp<ViewStyle>
}

/**
 * If children is a single component, it will only render if the shouldRender is true.
 *
 * If there are two children, the first child will render when the shouldRender is true, the second if the shouldRender is false.
 *
 * If there are three or more children, everything will be rendered when the shouldRender is true.
 *
 * Default shouldRender: false
 */
export default function Contingent({ children, shouldRender = false, disableTernary = false, style}: ContingentProps) {
  const childElements = React.Children.toArray(children);
  const isTernaryRender = childElements.length === 2;

  const renderContent = () => {
    if (isTernaryRender && !disableTernary) {
      return shouldRender ? childElements[0] : childElements[1];
    } else return shouldRender ? childElements : null;
  };

  return <View style={style}>{renderContent()}</View>;
}
