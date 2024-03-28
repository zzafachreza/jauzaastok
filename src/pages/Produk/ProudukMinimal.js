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

export default function ProdukMinimal({ navigation, route }) {
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

    const [cek, setCek] = useState('');

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
        axios.post(apiURL + 'produk_minimal').then(res => {
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
                }}>Daftar Produk minimal dan habis</Text>
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
                    position: 'relative'
                }}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 10, }}>
                        <TouchableWithoutFeedback onPress={() => {
                            setCek('');
                            setData(tmp);
                        }}>
                            <View style={{
                                marginHorizontal: 10,
                                padding: 5,
                                borderRadius: 2,
                                backgroundColor: colors.primary
                            }}>
                                <Text style={{
                                    color: colors.white,
                                    fontFamily: fonts.secondary[600],
                                    color: colors.white
                                }}>Semua Habis & Menipis</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                            setCek(0);
                            setData(tmp.filter(i => i.tipe == 0));
                        }}>
                            <View style={{
                                marginHorizontal: 10,
                                padding: 5,
                                borderRadius: 2,
                                backgroundColor: colors.danger
                            }}>
                                <Text style={{
                                    color: colors.white,
                                    fontFamily: fonts.secondary[600],
                                    color: colors.white
                                }}>Habis</Text>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={() => {
                            setCek(1);

                            setData(tmp.filter(i => i.tipe == 1));
                        }}>
                            <View style={{
                                marginHorizontal: 10,
                                padding: 5,
                                borderRadius: 2,
                                backgroundColor: colors.warning
                            }}>
                                <Text style={{

                                    fontFamily: fonts.secondary[600],
                                    color: colors.black
                                }}>Menipis</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
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
                                        paddingLeft: 10,
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
                                        color: item.stok <= item.minimal_stok && item.stok > 0 ? colors.warning : item.stok == 0 ? colors.danger : colors.black,
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