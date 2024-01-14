import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../utils/color';

interface Props {
    absolute?: boolean
    onChange: (value: number) => void
    defaultValue: number
}
const YearDropdown = ({absolute, onChange, defaultValue = 0}: Props) => {
    const years = [0, 2023, 2024];
    const [selectedYear, setSelectedYear] = useState(defaultValue);
  
    const handleYearChange = (value: number) => {
        onChange(value)
        if(value === selectedYear) return;
      setSelectedYear(value);
      // Add any additional logic you want to perform when the year changes
    };
  
    return (
      <View style={{ paddingLeft: 15, display: 'flex', flexDirection: 'row', alignContent: 'center', position: absolute ? 'absolute' : 'relative', top: 0, left: 0 }}>
        <Text style={{marginTop: 7.5, fontFamily: 'Roboto-Bold', color: colors.summerDark, fontSize: 14 }}>Year: </Text>
        <Dropdown
          data={years}
          renderItem={(item: any) => <View style={{height: 55}}><Text style={{ fontSize: 20, textAlign: 'center' }}>{item === 0 ? "All" : item}</Text></View>}
          onChange={(value: any) => handleYearChange(value)}
          value={selectedYear}
          labelField={'fontsize'}
          style={{width: 55}}
          itemContainerStyle={{height: 55}}
          iconColor={colors.summerDark}
          placeholder={selectedYear === 0 ? "All" : selectedYear.toString()}
          placeholderStyle={{fontFamily: 'Roboto-Bold', fontSize: 14, color: colors.summerDark}}
          valueField={'fontsize'}
        />
      </View>
    );
  };
  
  export default YearDropdown;
  