
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    Modal,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import { windowWidth, windowHeight, fonts, MyDimensi } from '../../utils/fonts';
import { apiURL, getData, MYAPP } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import ZavalabsScanner from 'react-native-zavalabs-scanner';
import SweetAlert from 'react-native-sweet-alert';
import FastImage from 'react-native-fast-image';
import { Alert } from 'react-native';

export default function Produk({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const [key, setKey] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [rakOptions, setRakOptions] = useState([]);
    const [user, setUser] = useState({});
    const isFocused = useIsFocused();
    const [searchKeyword, setSearchKeyword] = useState('');

    const [limit] = useState(25);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelect = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };


    const handleLoadMore = () => {
        if (!loading && !isLoadMore && hasNext) {
            fetchData();
        }
    };


    useEffect(() => {
        fetchData(true);
    }, []);

    const fetchData = async (reset = false, keyword = '') => {
        if (!hasNext && !reset) return;

        if (reset) {
            setOffset(0);
            setHasNext(true);
        }

        if (!reset) setIsLoadMore(true);
        else setLoading(true);

        try {
            const userData = await getData('user');
            setUser(userData);

            const response = await axios.post(apiURL + 'produk', {
                limit,
                offset: reset ? 0 : offset,
                keyword: keyword ?? '',
            });

            const newData = response.data || [];

            if (reset) {
                setData(newData);
                setFilteredData(newData);
            } else {
                const combined = [...data, ...newData];
                setData(combined);
                setFilteredData(combined);
            }

            if (newData.length < limit) {
                setHasNext(false);
            } else {
                setOffset(prev => prev + limit);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            if (!reset) setIsLoadMore(false);
            else setLoading(false);
        }
    };



    const handleSearch = (text) => {
        setKey(text);
        fetchData(true, text); // panggil server berdasarkan input keyword
    };

    const __scanBarcode = () => {
        ZavalabsScanner.showBarcodeReader(result => {
            if (result) {
                const found = data.find(item => item.kode_produk.toLowerCase().includes(result.toLowerCase()));
                if (found) {
                    navigation.navigate('ProdukDetail', found);
                } else {
                    SweetAlert.showAlertWithOptions({
                        title: MYAPP,
                        subTitle: 'Maaf barcode tidak ditemukan!',
                        style: 'error',
                        cancellable: true,
                    });
                }
            }
        });
    };

    const renderItem = useCallback(({ item }) => {
        const isChecked = selectedItems.includes(item.id);

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                        {isChecked && <Text style={styles.checkboxTick}>✓</Text>}
                    </View>
                </TouchableOpacity>

                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.itemImage}
                    source={{
                        uri: item.image,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                />

                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{item.nama_produk}</Text>
                    <Text style={styles.itemSubtitle}>
                        Rp {new Intl.NumberFormat().format(item.harga)} | {item.kode_produk}
                    </Text>
                    <Text style={[
                        styles.itemStock,
                        {
                            color: item.stok <= item.minimal_stok && item.stok > 0 ? colors.warning
                                : item.stok == 0 ? colors.danger
                                    : colors.black,
                        }
                    ]}>
                        {item.stok}
                    </Text>

                    <TouchableOpacity
                        style={styles.detailButton}
                        onPress={() => navigation.navigate('ProdukDetail', item)}
                    >
                        <Text style={styles.detailButtonText}>Detail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [selectedItems]);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Daftar Produk</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Icon type='ionicon' name='search-outline' color={colors.border} />
                    <TextInput
                        ref={inputRef}
                        value={key}
                        onChangeText={handleSearch}
                        placeholderTextColor={colors.border}
                        placeholder="Cari nama atau barcode"
                        style={styles.searchInput}
                    />
                    {key.length > 0 && (
                        <TouchableWithoutFeedback onPress={() => {
                            setKey('');
                            setFilteredData(data);
                        }}>
                            <Icon type='ionicon' name='close' color={colors.black} />
                        </TouchableWithoutFeedback>
                    )}
                </View>
                <TouchableWithoutFeedback onPress={() => Alert.alert(MYAPP, 'Silahkan pilih tindakan', [
                    {
                        text: 'Batal'
                    },
                    {
                        text: 'Edit Kategori',
                        onPress: () => {
                            console.log(selectedItems)
                        }
                    }, {
                        text: 'Hapus',
                        onPress: () => {
                            axios.post(apiURL + 'delete_all', {
                                id_produk: selectedItems
                            }).then(res => {
                                if (res.data == 200) {
                                    const updatedData = data.filter(item => !selectedItems.includes(item.id));
                                    setData(updatedData);
                                    setFilteredData(updatedData);
                                    setSelectedItems([]); // kosongkan setelah delete
                                }
                            }).catch(err => {
                                console.error('Delete failed:', err);
                            });
                        }
                    }
                ])}>
                    <View style={styles.iconButton}>
                        {selectedItems.length > 0 &&

                            <View style={{
                                position: 'absolute',
                                width: 20,
                                height: 20,
                                top: -10,
                                right: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                backgroundColor: colors.primary,
                            }}><Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: 10,
                                color: colors.white,
                            }}>{selectedItems.length}</Text>

                            </View>
                        }
                        <Icon type='ionicon' name='open-outline' />
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => fetchData(true)}>
                    <View style={styles.iconButton}>
                        <Icon type='ionicon' name='refresh-outline' />
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={__scanBarcode}>
                    <View style={styles.iconButton}>
                        <Icon type='ionicon' name='barcode-outline' />
                    </View>
                </TouchableWithoutFeedback>


            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={20}
                    maxToRenderPerBatch={50}
                    windowSize={10}
                    removeClippedSubviews={true}
                    updateCellsBatchingPeriod={50}
                    getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={isLoadMore && (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} />
                    )}
                />

            )}

            {/* Modal Filter */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Letak Rak</Text>
                        <ScrollView>
                            {rakOptions.map((rak, index) => (
                                <TouchableOpacity key={index} onPress={() => {
                                    if (rak === 'Tampilkan Semua') {
                                        setFilteredData(data);
                                    } else {
                                        setFilteredData(data.filter(i => i.letak_rak === rak));
                                    }
                                    setModalVisible(false);
                                }}>
                                    <View style={styles.rakItem}>
                                        <Icon type='ionicon' name='chevron-forward-circle-outline' />
                                        <Text style={styles.rakText}>{rak}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Button Tambah Produk */}
            {user.level === 'Admin' && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('ProudukAdd')}
                    style={styles.addButton}
                >
                    <Icon type="ionicon" name="add" size={30} color={colors.white} />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );


}

const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkboxTick: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    detailButton: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    detailButtonText: {
        color: 'white',
        fontFamily: fonts.secondary[600],
        fontSize: 12,
    },

    container: { flex: 1, backgroundColor: colors.white },
    header: { padding: 10 },
    headerTitle: { fontFamily: fonts.secondary[800], fontSize: MyDimensi / 3 },
    searchContainer: { flexDirection: 'row', padding: 10 },
    searchInputContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
    },
    searchInput: { flex: 1, fontFamily: fonts.secondary[600], fontSize: MyDimensi / 4 },
    iconButton: {
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
    },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    itemContainer: { padding: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
    itemImage: { width: 50, height: 50 },
    itemTextContainer: { flex: 1, paddingLeft: 10 },
    itemTitle: { fontFamily: fonts.secondary[600], fontSize: 14, color: colors.black },
    itemSubtitle: { fontFamily: fonts.secondary[400], fontSize: 14, color: colors.zavalabs },
    itemStock: { fontFamily: fonts.secondary[600], fontSize: 20 },
    modalContainer: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { padding: 20, height: windowHeight / 2, backgroundColor: '#FDFDFD', borderTopWidth: 1, borderTopColor: colors.border },
    modalTitle: { fontFamily: fonts.secondary[600], fontSize: 20 },
    rakItem: { flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 10, borderWidth: 1, marginVertical: 5 },
    rakText: { fontFamily: fonts.secondary[600], fontSize: 14, marginLeft: 5 },
    addButton: { position: 'absolute', bottom: 10, right: 10, justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary },
});
