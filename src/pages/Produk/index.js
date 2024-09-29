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
    Modal,
    ScrollView, TouchableOpacity, TouchableWithoutFeedback

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
import SweetAlert from 'react-native-sweet-alert';

export default function Produk({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(false);
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

    const [RAK, setRAK] = useState([]);

    const [user, setUser] = useState({});

    const onlyUnique = (value, index, array) => {
        return array.indexOf(value) === index;
    }

    const __getProduct = () => {
        setLoading(true);

        getData('user').then(uu => {
            setUser(uu)
        })
        axios.post(apiURL + 'produk').then(res => {

            let ARR = ['Tampilkan Semua'];

            res.data.map((i, index) => {

                ARR.push(i.letak_rak);


            })

            console.log(ARR.filter(onlyUnique));

            setRAK(ARR.filter(onlyUnique))

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
                                let filterd = data.filter(i => i.key.toLowerCase().indexOf(x.toLowerCase()) > -1);
                                setData(filterd)

                            } else if (x.length == 0) {
                                setData(tmp);
                            }
                        }} placeholderTextColor={colors.border} placeholder='Cari berdasarkan nama atau barcode' style={{
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
                <TouchableWithoutFeedback onPress={() => {
                    setModalVisible(true);
                }}>
                    <View style={{
                        marginLeft: 5,
                        borderWidth: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        height: 50,
                        justifyContent: 'center'
                    }}>
                        <Icon type='ionicon' name='funnel-outline' />
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {!loading &&

                <View style={{
                    flex: 1,
                    position: 'relative'
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

            {user.level == 'Admin' &&
                <View style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colors.primary,
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProudukAdd')} style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Icon type='ionicon' name='add' size={30} color={colors.white} />
                    </TouchableOpacity>


                </View>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',

                }}>
                    <View style={{
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        padding: 20,
                        height: windowHeight / 2,
                        backgroundColor: '#FDFDFD',
                    }}>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                        }}>Letak Rak</Text>

                        <ScrollView>
                            <FlatList data={RAK} renderItem={({ item }) => {
                                return (
                                    <TouchableWithoutFeedback onPress={() => {
                                        if (item == 'Tampilkan Semua') {
                                            setData(tmp)
                                        } else {

                                            setData(tmp.filter(i => i.letak_rak == item))
                                        }
                                        setModalVisible(false)
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 5,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            marginVertical: 5,
                                        }}>
                                            <Icon type='ionicon' name='chevron-forward-circle-outline' />
                                            <Text style={{
                                                fontFamily: fonts.secondary[600],
                                                fontSize: 14,
                                                left: 5,
                                            }}>{item}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})