import React, { useEffect, useRef, useState } from 'react';
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
    FlatList, TouchableOpacity, TouchableWithoutFeedback, ScrollView
} from 'react-native';
import { windowWidth, fonts, MyDimensi, windowHeight } from '../../utils/fonts';
import { apiURL, getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader, MyInput, MyPicker } from '../../components';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import ZavalabsScanner from 'react-native-zavalabs-scanner'
import moment from 'moment';
import Modal from "react-native-modal";
import SweetAlert from 'react-native-sweet-alert';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
export default function ProudukAdd({ navigation, route }) {

    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(false);
    const [kirim, setKirim] = useState({
        fid_kategori: '',
        nama_produk: '',
        kode_produk: '',
        stok: '',
        harga: '',
        minimal_stok: '',
        lokasi_rak: '',
        foto_produk: 'https://zavalabs.com/nogambar.jpg',
    })
    useEffect(() => {
        axios.post(apiURL + 'kategori').then(res => {
            console.log(res.data);
            setKategori(res.data);
            setKirim({
                ...kirim,
                fid_kategori: res.data[0].value
            })
        })
    }, []);

    const sendServer = () => {
        // setLoading(true);
        axios.post(apiURL + 'produk_add', kirim).then(res => {
            console.log(res.data);
            if (res.data.status == 200) {
                showMessage({
                    type: 'success',
                    message: res.data.message
                });
                navigation.goBack();
            }
        })
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
        }}>
            <MyHeader judul="Tambah Produk" onPress={() => navigation.goBack()} />

            <ScrollView style={{
                flex: 1,
                padding: 20,
            }}>

                <TouchableWithoutFeedback onPress={() => {
                    launchImageLibrary({
                        includeBase64: true,
                        quality: 1,
                        mediaType: "photo",
                        maxWidth: 500,
                        maxHeight: 500
                    }, response => {
                        // console.log('All Response = ', response);

                        setKirim({
                            ...kirim,
                            foto_produk: `data:${response.type};base64, ${response.base64}`,
                        });
                    });
                }}>
                    <View style={{
                        alignSelf: 'center',
                        backgroundColor: colors.border,
                        borderRadius: 10,
                        width: 100,
                        height: 100,
                        overflow: 'hidden'
                    }}>
                        <Image style={{
                            width: 100,
                            height: 100,
                        }} source={{
                            uri: kirim.foto_produk
                        }} />
                    </View>
                </TouchableWithoutFeedback>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 4,
                    color: colors.primary,
                    textAlign: 'center',
                    marginBottom: 10,
                }}>Upload Foto Produk</Text>



                <MyPicker label="Kategori" data={kategori} onValueChange={x => {
                    setKirim({
                        ...kirim,
                        fid_kategori: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Nama Produk" onChangeText={x => {
                    setKirim({
                        ...kirim,
                        nama_produk: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Kode Produk" onChangeText={x => {
                    setKirim({
                        ...kirim,
                        kode_produk: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Stok" keyboardType='number-pad' onChangeText={x => {
                    setKirim({
                        ...kirim,
                        stok: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Harga" keyboardType='number-pad' onChangeText={x => {
                    setKirim({
                        ...kirim,
                        harga: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Minimal Stok" keyboardType='number-pad' onChangeText={x => {
                    setKirim({
                        ...kirim,
                        minimal_stok: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Letak Rak" onChangeText={x => {
                    setKirim({
                        ...kirim,
                        letak_rak: x
                    })
                }} />
                <MyGap jarak={10} />
                {!loading && <MyButton onPress={sendServer} title="Simpan" />}
                <MyGap jarak={30} />
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})