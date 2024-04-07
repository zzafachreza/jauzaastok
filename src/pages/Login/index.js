import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Animated, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, BackHandler, Alert, Linking, ImageBackground } from 'react-native';
import { fonts, windowWidth, colors, windowHeight, MyDimensi } from '../../utils';
import { MyInput, MyGap, MyButton } from '../../components';
import axios from 'axios';
import { apiURL, api_token, MYAPP, storeData } from '../../utils/localStorage';
import { showMessage } from 'react-native-flash-message';
import { TouchableNativeFeedback } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import { color } from 'react-native-reanimated';

export default function Login({ navigation }) {

  const [kirim, setKirim] = useState({
    api_token: api_token,
    username: null,
    password: null
  });
  const [loading, setLoading] = useState(false);

  const [comp, setComp] = useState({});

  const card = new Animated.Value(-30);
  const img = new Animated.Value(-20);

  const masuk = () => {
    if (kirim.username == null && kirim.password == null) {
      Alert.alert(MYAPP, 'username dan Password tidak boleh kosong !');
    } else if (kirim.username == null) {
      Alert.alert(MYAPP, 'username tidak boleh kosong !');
    } else if (kirim.password == null) {
      Alert.alert(MYAPP, 'Password tidak boleh kosong !');
    } else {
      setLoading(true);
      console.log(kirim);
      axios.post(apiURL + 'login', kirim)
        .then(res => {
          setLoading(false);
          console.log(res.data);
          if (res.data.status == 404) {
            showMessage({
              type: 'danger',
              message: res.data.message
            })
          } else {
            storeData('user', res.data.data);
            navigation.replace('MainApp')
          }
        });
    }
  }

  useEffect(() => {
    Animated.timing(card, {
      toValue: 1,
      duration: 850,
      useNativeDriver: false,
    }).start();
    Animated.timing(img, {
      toValue: 0,
      duration: 850,
      useNativeDriver: false,
    }).start();
    axios.post(apiURL + 'company').then(res => {
      setComp(res.data.data);
    })
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary, position: "relative" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={require('../../assets/back.png')} style={{
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: colors.primary
        }}>
          <Animated.Image source={require('../../assets/logo.png')} style={{
            marginTop: 10,
            width: windowWidth / 1.5,
            height: windowWidth / 2,
            alignSelf: "center"
          }} />
          <Animated.View style={{
            padding: 0,
            margin: 0,
            bottom: card,
            borderRadius: 10,
            alignItems: 'center', // Center the white background view
          }}>
            <View style={{
              width: '100%', // Set the width to full screen
              paddingHorizontal: 40,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: fonts.primary[600],
                fontSize: MyDimensi / 2.5,
                marginTop: 20
              }}>
                LOGIN
              </Text>
              <MyGap jarak={50} />
              <MyInput label="Username" onChangeText={x => {
                setKirim({
                  ...kirim,
                  username: x
                })
              }} iconname="person" placeholder="Masukan username" />
              <MyGap jarak={20} />
              <MyInput label="Password" onChangeText={x => {
                setKirim({
                  ...kirim,
                  password: x
                })
              }} iconname="key" placeholder="Masukan password" secureTextEntry={true} />
              <TouchableOpacity onPress={() => {
                let urlWA = 'https://wa.me/' + comp.tlp + `?text=Hallo admin saya lupa password . . .`;
                Linking.openURL(urlWA)
              }} style={{ marginTop: 0 }}>
                <Text style={{
                  textAlign: 'right',
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                  fontSize: MyDimensi / 4,
                  marginTop: 10,
                }}>Lupa password ?</Text>
              </TouchableOpacity>
              <MyGap jarak={40} />
              <MyGap jarak={0} />
              {!loading &&
                <MyButton
                  onPress={masuk}
                  title="Login"
                  Icons="log-in-outline"
                />
              }
              {loading && <ActivityIndicator size="large" color={colors.primary} />}

              <View style={{ marginTop: '50%' }}></View>
            </View>
          </Animated.View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
