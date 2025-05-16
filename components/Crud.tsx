import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, FlatList, ScrollView, Modal, Button } from 'react-native';

const Crud = () => {
  type Catatan = {
    id: number,
    Nama: string,
    Catatanku: string,
    Hobi: string,
    Tanggal: string
  }

  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');
  const [hobi, setHobi] = useState('');
  const [data, setData] = useState<Catatan[]>([]);
  const [selectedItem, setSelectedItem] = useState<Catatan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (item: Catatan): void => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };


  const handleButton = () => {
    if (nama === '' && catatan === '' && hobi === '') {
      Alert.alert('Error', 'Data Harus Lengkap!');
      return;
    }

    axios
      .post('http://192.168.0.139/ppb_bintang/add.php', { nama, catatan, hobi })
      .then((response) => {
        Alert.alert('DATA BERHASIL DISIMPAN', response.data.message);
        setNama('');
        setCatatan('');
        setHobi('');
        fetchData();
      })

      .catch((error) => {
        Alert.alert('DATA TIDAK LENGKAP');
      })
  }

  const fetchData = () => {
    axios
      .get('http://192.168.0.139/ppb_bintang/get.php')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data)
        } else {
          setData([])
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Gagal mengambil data dari database!');
      })
  }

  const handleUpdate = () => {
    if (selectedItem) {
      axios
        .post('http://192.168.0.139/ppb_bintang/update.php', {
          id: selectedItem.id,
          Nama: selectedItem.Nama,
          Catatanku: selectedItem.Catatanku,
          Hobi: selectedItem.Hobi
        })
        .then((response) => {
          Alert.alert('CATATAN BERHASIL DIPERBAHARUI', response.data.message);
          closeModal();
          fetchData();
        })

        .catch((error) => {
          Alert.alert('ERROR', 'CATATAN GAGAL DIPERBAHARUI');
        })

    }
  }

  const handleDelete = (id: number) => {
    Alert.alert('KONFIRMASI', 'Apakah anda yakin akan menghapus catatan ini?', [
      {
        text: 'Batal',
        style: 'cancel'
      },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          axios
            .post('http://192.168.0.139/ppb_bintang/delete.php', { id })
            .then(() => {
              Alert.alert('CATATAN BERHASIL DIHAPUS!');
              fetchData();
            })
            .catch((error) => {
              Alert.alert('ERROR', 'CATATAN GAGAL DIHAPUS');
            })
        }
      }
    ])
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View>
        <View>
          <Text style={styles.title}>MY CATATAN</Text>
          <TextInput style={styles.inputNama} value={nama} onChangeText={(text) => setNama(text)} placeholder='Masukkan Nama Anda' />
          <TextInput style={styles.inputCatatan} value={catatan} onChangeText={(text) => setCatatan(text)} multiline={true} placeholder='Masukkan Catatan Anda' />
          <TextInput style={styles.inputHobi} value={hobi} onChangeText={(text) => setHobi(text)} placeholder='Masukkan Hobi Anda' />
        </View>

        <TouchableOpacity style={styles.tombolKirim} onPress={handleButton}>
          <Text style={styles.teksTombol}>Kirim</Text>
        </TouchableOpacity>

        <FlatList
          style={styles.daftarData}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)}>
              <View style={styles.kartuItem}>
                <Text>Nama: {item.Nama}</Text>
                <Text>Catatan: {item.Catatanku}</Text>
                <Text>Hobi: {item.Hobi}</Text>
                <Text>Tanggal: {item.Tanggal}</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteButtonText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Modal */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
          </View>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <TextInput
                  style={styles.inputNama}
                  value={selectedItem.Nama}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, Nama: text })}
                />
                <TextInput
                  style={styles.inputCatatan}
                  value={selectedItem.Catatanku}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, Catatanku: text })}
                />
                <TextInput
                  style={styles.inputHobi}
                  value={selectedItem.Hobi}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, Hobi: text })}
                />

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                  <Text style={styles.updateButtonText}>UPDATE</Text>
                </TouchableOpacity>

              </>
            )}

            <TouchableOpacity onPress={closeModal} style={styles.iconClose}>
              <Text style={{ fontSize: 25 }}>✖</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>

  )
}

export default Crud;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 40,
    fontWeight: 'bold',
    color: '#166534',
  },

  inputNama: {
    borderColor: '#15803D',
    borderWidth: 2,
    width: 400,
    height: 50,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },

  inputCatatan: {
    borderColor: '#15803D',
    borderWidth: 2,
    width: 400,
    height: 120,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },

  inputHobi: {
    borderColor: '#15803D',
    borderWidth: 2,
    width: 400,
    height: 50,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },

  tombolKirim: {
    backgroundColor: '#22C55E',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginRight: 35,
    width: 130,
    alignSelf: 'flex-end',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  teksTombol: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  daftarData: {
    marginTop: 20
  },

  kartuItem: {
    borderWidth: 1,
    borderColor: '#4ADE80',
    backgroundColor: '#D1FAE5',
    padding: 10,
    width: 400,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(192, 192, 192, 0.66)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    position: 'absolute',
    left: 60,
    bottom: 400
  },

  iconClose: {
    position: 'absolute',
    right: 10
  },

  updateButton: {
    backgroundColor: '#4CAF50', // warna hijau fresh
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // buat Android
  },

  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  deleteButton: {
  backgroundColor: '#f44336', // merah terang
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

deleteButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 1,
}
});