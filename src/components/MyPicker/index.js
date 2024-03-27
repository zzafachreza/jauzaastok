import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { MyDimensi, fonts } from '../../utils/fonts';

export default function MyPicker({
  label,
  iconname,
  onValueChange,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  label2,
  styleLabel,
  colorIcon = colors.primary,
  data = [],
}) {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 0,
        }}>
        <Icon type="ionicon" name={iconname} color={colors.primary} size={MyDimensi / 4} />
        <Text
          style={{
            fontFamily: fonts.primary[400],
            color: colors.white,
            left: 10,
            fontSize: MyDimensi / 4,
            ...styleLabel,
          }}>
          {label}
        </Text>
      </View>

      <View style={{
        borderWidth: 1,
        borderColor: colors.black,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginTop: 5,
        fontFamily: fonts.secondary[400],

      }}>
        <Picker style={{ height: 48, transform: [{ scale: 0.9 }] }}
          selectedValue={value} onValueChange={onValueChange}>
          {data.map(item => {
            return <Picker.Item textStyle={{ fontSize: MyDimensi / 4 }} value={item.value} label={item.label} />;
          })}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
