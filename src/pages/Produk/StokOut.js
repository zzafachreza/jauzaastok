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
    FlatList, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { windowWidth, fonts, MyDimensi, windowHeight } from '../../utils/fonts';
import { apiURL, getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import ZavalabsScanner from 'react-native-zavalabs-scanner'
import moment from 'moment';
import Modal from "react-native-modal";
import SweetAlert from 'react-native-sweet-alert';
import { showMessage } from 'react-native-flash-message';

export default function StokOut({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const [key, setKey] = useState('');
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [cek, setCek] = useState({});
    const [tmp, setTmp] = useState([]);
    const [jumlah, setJumlah] = useState(0)
    const inputQty = useRef();
    useEffect(() => {
        __getProduct();
    }, []);

    const __scanBarcode = () => {
        ZavalabsScanner.showBarcodeReader(result => {
            console.log('barcode : ', result);

            if (result !== null) {
                let filterd = data.filter(i => i.kode_produk.toLowerCase().indexOf(result.toString().toLowerCase()) > -1);
                console.log(filterd);
                if (filterd.length > 0) {
                    setOpen(true);

                    setCek(filterd[0]);
                    setTimeout(() => {
                        inputQty.current.focus();
                    }, 500)
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
            <MyHeader judul="Stok Keluar" onPress={() => navigation.goBack()} />
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
                        <TextInput ref={inputRef} onChangeText={x => {
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
                            <TouchableWithoutFeedback onPress={() => {
                                setOpen(true);

                                setCek({
                                    ...item,
                                    index: index
                                });
                                setTimeout(() => {
                                    inputQty.current.focus();
                                }, 500)
                            }}>
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

            <Modal isVisible={open} animationIn="fadeIn" animationOut="fadeOut" onBackButtonPress={() => {

                setOpen(false);
                setTimeout(() => {
                    setJumlah(0);
                }, 500)
            }}>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10, }}>
                    <View style={{
                        height: windowHeight / 2.5,
                        backgroundColor: colors.white,
                        borderRadius: 10,
                        padding: 10,
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: fonts.secondary[600],
                            fontSize: MyDimensi / 2.5
                        }}>Jumlah Stok Keluar</Text>
                        <Text style={{
                            marginTop: 10,
                            textAlign: 'center',
                            fontFamily: fonts.secondary[400],
                            fontSize: MyDimensi / 4
                        }}>{cek.nama_produk}</Text>

                        <View style={{
                            paddingHorizontal: 20,
                            flexDirection: 'row', alignItems: 'center',
                            marginTop: 20,
                        }}>
                            <TouchableWithoutFeedback onPress={() => {
                                if (jumlah > 0) {
                                    setJumlah(parseFloat(jumlah) - 1)
                                }
                            }}>
                                <View style={{
                                    width: 30,
                                    marginHorizontal: 10,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 15,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    backgroundColor: colors.white
                                }}><Icon type='ionicon' color={colors.primary} size={20} name='remove-outline' />
                                </View>
                            </TouchableWithoutFeedback>

                            <TextInput ref={inputQty} onChangeText={x => setJumlah(x)} keyboardType='number-pad' placeholder='0' value={jumlah.toString()} style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: MyDimensi / 1.5
                            }} />

                            <TouchableOpacity onPress={() => {
                                setJumlah(parseFloat(jumlah) + 1)
                            }}>
                                <View style={{
                                    marginHorizontal: 10,
                                    width: 30,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 15,
                                    borderWidth: 1,
                                    borderColor: colors.primary,
                                    backgroundColor: colors.secondary
                                }}><Icon type='ionicon' color={colors.primary} size={20} name='add-outline' />
                                </View>
                            </TouchableOpacity>


                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 10,
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: MyDimensi / 4,
                                color: colors.black,
                                marginHorizontal: 5,
                            }}>{cek.stok}</Text>
                            <View><Icon type='ionicon' name='arrow-forward-outline' size={10} /></View>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: MyDimensi / 4,
                                color: colors.black,
                                marginHorizontal: 5,
                            }}>{parseFloat(cek.stok) - parseFloat(jumlah)}</Text>
                        </View>


                        <View style={{
                            marginTop: 20,
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                flex: 1,
                                paddingHorizontal: 5,
                            }}>
                                <MyButton onPress={() => {
                                    setOpen(false);
                                    setTimeout(() => {
                                        setJumlah(0);
                                    }, 500)
                                }} warna={colors.secondary} title="Batal" colorText={colors.primary} />
                            </View>
                            <View style={{
                                flex: 1,
                                paddingHorizontal: 5,
                            }}>
                                <MyButton onPress={() => {
                                    console.log(cek);

                                    let TMP = [...data];
                                    TMP[cek.index].stok = parseFloat(cek.stok) - parseFloat(jumlah);

                                    axios.post(apiURL + 'stok_update', {
                                        tipe: 'OUT',
                                        fid_produk: cek.id,
                                        qty: parseFloat(jumlah),
                                        newqty: parseFloat(cek.stok) - parseFloat(jumlah)
                                    }).then(res => {
                                        console.log(res.data);
                                        showMessage({
                                            type: 'success',
                                            message: 'Stok keluar berhasil di update !'
                                        })
                                    })
                                    setOpen(false);
                                    setTimeout(() => {
                                        setJumlah(0);
                                    }, 500)

                                }} warna={colors.primary} title="Kirim" colorText={colors.white} />
                            </View>
                        </View>


                    </View>


                </View>
            </Modal>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})