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
export default function EditKategori({ navigation, route }) {


    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(false);
    const [old, setOld] = useState([]);
    const [kirim, setKirim] = useState(route.params)
    const [kategoripilih, setKategoripilih] = useState('');
    useEffect(() => {

        getData('produk').then(res => {

            setOld(res);
        })

        axios.post(apiURL + 'kategori').then(res => {
            console.log(res.data)
            setKategori(res.data);
            setKirim({
                ...kirim,
                fid_kategori: res.data[0].id,
            })
            setKategoripilih(res.data[0].label)

        });
        setKirim({
            ...kirim,
            newfoto_produk: null
        })
    }, []);

    const sendServer = () => {
        console.log(kirim);
        setLoading(true);
        axios.post(apiURL + 'kategori_update', {
            fid_kategori: kirim.fid_kategori,
            id_produk: route.params.id_produk
        }).then(res => {
            console.log('hasil', res.data);
            setLoading(false);
            showMessage({
                type: 'success',
                message: 'Kategori berhasil diubah menjadi ' + kategoripilih
            });
            const NEWDATA = old.map(item => {
                return {
                    ...item,
                    nama_kategori: kategoripilih,
                };
            });
            console.log(NEWDATA);
            storeData('produk', NEWDATA);
            navigation.goBack();
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


                <Text style={{
                    textAlign: 'center',
                    fontFamily: fonts.secondary[800],
                    fontSize: 20,
                    marginBottom: 10,
                }}>{kategoripilih}</Text>
                <MyPicker label="Pilih Kategori" value={kirim.fid_kategori} data={kategori} onValueChange={x => {
                    setKirim({
                        ...kirim,
                        fid_kategori: x
                    });
                    setKategoripilih(kategori.filter(i => i.id == x)[0].label)

                }} />

                <MyGap jarak={10} />
                {!loading && <MyButton onPress={sendServer} title="Simpan" />}
                <MyGap jarak={30} />
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})