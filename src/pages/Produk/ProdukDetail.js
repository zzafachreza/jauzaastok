import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { windowWidth, fonts, MyDimensi } from '../../utils/fonts';
import { apiURL, getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

export default function ProdukDetail({ navigation, route }) {
  const item = route.params;

  const MyList = ({ label, value }) => {
    return (
      <View
        style={{
          marginVertical: 2,
          paddingTop: 2,
          paddingHorizontal: 10,
          backgroundColor: colors.background,
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[600],
            color: colors.primary,
          }}>
          {label}
        </Text>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            color: colors.black,
          }}>
          {value}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      <MyHeader judul="Produk Detail" onPress={() => navigation.goBack()} />

      <ScrollView>
        <Image source={{
          uri: item.image
        }} style={{
          width: windowWidth / 2,
          height: windowWidth / 2,
          alignSelf: 'center'
        }} />
        <View style={{
          padding: 20,
        }}>
          <MyList label="Nama Kategori" value={item.nama_kategori} />
          <MyList label="Nama Produk" value={item.nama_produk} />
          <MyList label="Kode Produk" value={item.kode_produk} />
          <MyList label="Harga" value={'Rp ' + new Intl.NumberFormat().format(item.harga)} />
          <MyList label="Stok" value={item.stok} />
          <MyList label="Minimal Stok" value={item.minimal_stok} />
          <MyList label="Letak Rak" value={item.letak_rak} />
        </View>
      </ScrollView>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})