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
    FlatList,
} from 'react-native';
import { windowWidth, fonts, MyDimensi } from '../../utils/fonts';
import { apiURL, getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import ZavalabsScanner from 'react-native-zavalabs-scanner'
import moment from 'moment';
import SweetAlert from 'react-native-sweet-alert';

export default function Produk({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const [key, setKey] = useState('');
    const [data, setData] = useState([]);
    const [tmp, setTmp] = useState([]);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            __getProduct();
        }

    }, [isFocused]);

    const __scanBarcode = () => {
        ZavalabsScanner.showBarcodeReader(result => {
            console.log('barcode : ', result);

            if (result !== null) {
                let filterd = data.filter(i => i.kode_produk.toLowerCase().indexOf(result.toString().toLowerCase()) > -1);
                console.log(filterd);
                if (filterd.length > 0) {
                    navigation.navigate('ProdukDetail', filterd[0]);
                } else {
                    SweetAlert.showAlertWithOptions({
                        title: MYAPP,
                        subTitle: 'Maaf barcode tidak ditemukan !',
                        style: 'error  ',
                        cancellable: true
                    });
                }
            }

        });
    }

    const __getProduct = () => {
        setLoading(true);
        axios.post(apiURL + 'produk').then(res => {
            console.log(res.data);
            setData(res.data);
            setTmp(res.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
        }}>
            <View style={{
                padding: 10,
            }}>
                <Text style={{
                    fontFamily: fonts.secondary[800],
                    fontSize: MyDimensi / 3,
                    marginBottom: 10,
                }}>Daftar Produk</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                padding: 10,
            }}>
                <View style={{
                    flex: 1
                }}>
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        height: 50,
                    }}>
                        <Icon type='ionicon' name='search-outline' color={colors.border} />
                        <TextInput value={key} ref={inputRef} onChangeText={x => {
                            setKey(x);
                            if (x.length > 0) {
                                let filterd = data.filter(i => i.nama_produk.toLowerCase().indexOf(x.toLowerCase()) > -1);
                                setData(filterd)

                            } else if (x.length == 0) {
                                setData(tmp);
                            }
                        }} placeholderTextColor={colors.border} placeholder='Cari berdasarkan nama' style={{
                            flex: 1,
                            fontFamily: fonts.secondary[600],
                            fontSize: MyDimensi / 4
                        }} />
                        {key.length > 0 && <TouchableWithoutFeedback onPress={() => {
                            setKey('');
                            setData(tmp)
                        }}>
                            <Icon type='ionicon' name='close' color={colors.black} />
                        </TouchableWithoutFeedback>}
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={__scanBarcode}>
                    <View style={{
                        marginLeft: 5,
                        borderWidth: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        height: 50,
                        justifyContent: 'center'
                    }}>
                        <Icon type='ionicon' name='barcode-outline' />
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {!loading &&

                <View style={{
                    flex: 1,
                }}>
                    <FlatList data={data} renderItem={({ item, index }) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('ProdukDetail', item)}>
                                <View style={{
                                    padding: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                }}>
                                    <View>
                                        <Image style={{
                                            width: 50,
                                            height: 50,
                                        }} source={{
                                            uri: item.image
                                        }} />
                                    </View>
                                    <View style={{
                                        flex: 1,
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.secondary[600],
                                            fontSize: 14,
                                            color: colors.black
                                        }}>{item.nama_produk}</Text>
                                        <Text style={{
                                            fontFamily: fonts.secondary[400],
                                            fontSize: 14,
                                            color: colors.zavalabs
                                        }}>Rp {new Intl.NumberFormat().format(item.harga)} | {item.kode_produk}</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 20,
                                        color: colors.black
                                    }}>{item.stok}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }} />
                </View>
            }

            {loading && <View style={{
                flex: 1,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator color={colors.primary} />
            </View>}

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})