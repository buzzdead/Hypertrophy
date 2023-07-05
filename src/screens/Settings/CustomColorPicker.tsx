import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import ColorPickerWheel from 'react-native-wheel-color-picker';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../utils/color';

interface Props {
  currentColor: string;
  changeColor: (color: string) => void;
  onCancel: () => void;
}

const CustomColorPicker: React.FC<Props> = ({
  currentColor,
  changeColor,
  onCancel,
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <View style={{ maxWidth: '90%' }}>
      <ColorPickerWheel
        color={selectedColor}
        onColorChange={handleColorSelection}
      />
      <View
        style={{
          position: 'absolute',
          bottom: '20%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Text style={{textAlign: 'center', padding: 10, fontSize: 24}}>{selectedColor}</Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 50,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <CustomButton size="SM" backgroundColor={colors.summerBlue} title='Ok' onPress={() => changeColor(selectedColor)} />
          <CustomButton size="SM" backgroundColor={'grey'} title='Cancel' onPress={onCancel} />
        </View>
      </View>
    </View>
  );
};

export default CustomColorPicker;
