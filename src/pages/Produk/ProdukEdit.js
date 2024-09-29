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
export default function ProudukEdit({ navigation, route }) {


    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log(route.params)
    const [kirim, setKirim] = useState(route.params)
    useEffect(() => {
        axios.post(apiURL + 'kategori').then(res => {
            console.log(res.data);
            setKategori(res.data);

        });
        setKirim({
            ...kirim,
            newfoto_produk: null
        })
    }, []);

    const sendServer = () => {
        console.log(kirim);
        setLoading(true);
        axios.post(apiURL + 'produk_update', kirim).then(res => {
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
            <MyHeader judul="Edit Produk" onPress={() => navigation.goBack()} />

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
                            newfoto_produk: `data:${response.type};base64, ${response.base64}`,
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
                            uri: kirim.newfoto_produk !== null ? kirim.newfoto_produk : kirim.foto_produk,
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

                <MyGap jarak={10} />
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        flex: 1
                    }}>
                        <MyInput value={kirim.kode_produk} label="Kode Produk" onChangeText={x => {
                            setKirim({
                                ...kirim,
                                kode_produk: x
                            })
                        }} />
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        ZavalabsScanner.showBarcodeReader(result => {
                            console.log('barcode : ', result);

                            if (result !== null) {

                                setKirim({
                                    ...kirim,
                                    kode_produk: result
                                })
                            }

                        })
                    }}>
                        <View style={{
                            marginTop: 25,
                            height: 50,
                            width: 60,
                            marginLeft: 5,
                            backgroundColor: colors.primary,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            <Icon type='ionicon' name='barcode-outline' color={colors.white} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <MyGap jarak={10} />
                <MyPicker label="Kategori" value={kirim.fid_kategori} data={kategori} onValueChange={x => {
                    setKirim({
                        ...kirim,
                        fid_kategori: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Nama Produk" value={kirim.nama_produk} onChangeText={x => {
                    setKirim({
                        ...kirim,
                        nama_produk: x
                    })
                }} />

                <MyGap jarak={10} />
                <MyInput label="Stok" value={kirim.stok} keyboardType='number-pad' onChangeText={x => {
                    setKirim({
                        ...kirim,
                        stok: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Harga" value={kirim.harga} keyboardType='number-pad' onChangeText={x => {
                    setKirim({
                        ...kirim,
                        harga: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Minimal Stok" value={kirim.minimal_stok} keyboardType='number-pad' onChangeText={x => {
                    setKirim({
                        ...kirim,
                        minimal_stok: x
                    })
                }} />
                <MyGap jarak={10} />
                <MyInput label="Letak Rak" value={kirim.letak_rak} onChangeText={x => {
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