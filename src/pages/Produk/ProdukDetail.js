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
import { showMessage } from 'react-native-flash-message';

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

  const [user, setUser] = useState({});
  useEffect(() => {
    getData('user').then(uu => {
      setUser(uu)
    })
  }, [])
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
          <MyGap jarak={20} />

          {user.level == 'Admin' && <View style={{
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1,
              paddingRight: 5,
            }}>
              <MyButton title="Edit" Icons="create" onPress={() => navigation.navigate('ProdukEdit', item)} warna={colors.primary} />
            </View>
            <View style={{
              flex: 1,
              paddingLeft: 5,
            }}>
              <MyButton onPress={() => {
                Alert.alert(MYAPP, 'Apakah kamu akan hapus ini ?', [
                  {
                    text: 'TIDAK'
                  },
                  {
                    text: 'HAPUS',
                    onPress: () => {
                      axios.post(apiURL + 'produk_delete', {
                        id: item.id
                      }).then(res => {
                        console.log(res.data);
                        if (res.data == 200) {
                          showMessage({
                            type: 'success',
                            message: 'Data berhasil di hapus !'
                          });
                          navigation.goBack();
                        }
                      })
                    }
                  }
                ])
              }} title="Hapus" Icons="trash" warna={colors.danger} />
            </View>
          </View>}
        </View>

      </ScrollView>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})