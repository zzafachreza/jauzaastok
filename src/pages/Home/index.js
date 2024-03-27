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
} from 'react-native';
import { windowWidth, fonts, MyDimensi } from '../../utils/fonts';
import { getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

export default function Home({ navigation, route }) {

  const [stok, setStok] = useState({
    masuk: 0,
    keluar: 0,
  });

  const isFocused = useIsFocused();
  useEffect(() => {

    if (isFocused) {
      __getStok();
    }

  }, [isFocused]);


  const __getStok = () => {
    axios.post(urlAPI + 'stok').then(res => {
      console.log(res.data);
      setStok(res.data)
    })
  }


  return (
    <ImageBackground source={require('../../assets/back.png')} style={{
      flex: 1,
    }}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
      }}>

        <Image source={require('../../assets/logo.png')} style={{
          width: 200,
          height: 100,
        }} />

      </View>
      <View style={{
        flex: 1.5,
        backgroundColor: colors.white,
      }}>
        <View style={{
          borderRadius: 10,
          marginHorizontal: 20,
          backgroundColor: colors.white,
          elevation: 0.5,
          marginTop: -50,
          padding: 20,

        }}>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: MyDimensi / 4,
          }}>Hari ini, {moment().format('dddd DD MMMM YYYY')}</Text>

          <View style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
            <View style={{
              flex: 1,
            }}>
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: MyDimensi / 4,
                color: colors.zavalabs
              }}>Stok Masuk</Text>

              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: MyDimensi / 1.5,
                color: colors.success
              }}>{new Intl.NumberFormat().format(stok.masuk)}</Text>
            </View>
            <View style={{
              flex: 1,
            }}>
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: MyDimensi / 4,
                color: colors.zavalabs
              }}>Stok Keluar</Text>

              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: MyDimensi / 1.5,
                color: colors.danger
              }}>{new Intl.NumberFormat().format(stok.keluar)}</Text>
            </View>
          </View>
        </View>

        <View style={{
          flex: 1,
          // justifyContent: 'center',
          padding: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
            <View style={{
              flex: 1,
              padding: 10,
            }}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('StokIn')}>
                <View style={{
                  backgroundColor: colors.background,
                  // borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Image source={require('../../assets/a1.png')} style={{
                    width: 100,
                    height: 100,
                  }} />
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 4,
                    marginTop: 10,
                  }}>Stok Masuk</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{
              flex: 1,
              padding: 10,
            }}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('StokOut')}>
                <View style={{
                  backgroundColor: colors.background,
                  // borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Image source={require('../../assets/a2.png')} style={{
                    width: 100,
                    height: 100,
                  }} />
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 4,
                    marginTop: 10,
                  }}>Stok Keluar</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground >
  )
}

const styles = StyleSheet.create({})