import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, FlatList, ScrollView, Modal, Button } from 'react-native';

const Crud = () => {
  type Buku = {
    id: number,
    Judul_Buku: string,
    Nama_Pengarang: string,
    
  }

  const [judul, setJudul] = useState('');
  const [nama, setNama] = useState('');
  const [data, setData] = useState<Buku[]>([]);
  const [selectedItem, setSelectedItem] = useState<Buku | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (item: Buku): void => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };


  const handleButton = () => {
    if (judul === '' && nama === '') {
      Alert.alert('Error', 'Data Harus Lengkap!');
      return;
    }

    axios
      .post('http://192.168.0.139/ulangan_bintang/add.php', { judul, nama })
      .then((response) => {
        Alert.alert('DATA BERHASIL DISIMPAN', response.data.message);
        setJudul('');
        setNama('');
        fetchData();
      })

      .catch((error) => {
        Alert.alert('DATA TIDAK LENGKAP');
      })
  }

  const fetchData = () => {
    axios
      .get('http://192.168.0.139/ulangan_bintang/get.php')
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
        .post('http://192.168.0.139/ulangan_bintang/update.php', {
          id: selectedItem.id,
          judul: selectedItem.Judul_Buku,
          nama: selectedItem.Nama_Pengarang,
        })
        .then((response) => {
          Alert.alert('BUKU BERHASIL DIPERBAHARUI', response.data.message);
          closeModal();
          fetchData();
        })

        .catch((error) => {
          Alert.alert('ERROR', 'BUKU GAGAL DIPERBAHARUI');
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
            .post('http://192.168.0.139/ulangan_bintang/delete.php', { id })
            .then(() => {
              Alert.alert('BUKU BERHASIL DIHAPUS!');
              fetchData();
            })
            .catch((error) => {
              Alert.alert('ERROR', 'BUKU GAGAL DIHAPUS');
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
      <View style={styles.container}>
        <Text style={styles.title}>📚 Daftar Buku</Text>

        <TextInput
          style={styles.input}
          value={judul}
          onChangeText={setJudul}
          placeholder="Judul Buku"
        />
        <TextInput
          style={styles.input}
          value={nama}
          onChangeText={setNama}
          placeholder="Nama Pengarang"
        />

        <TouchableOpacity style={styles.tombolKirim} onPress={handleButton}>
          <Text style={styles.teksTombol}>TAMBAH BUKU</Text>
        </TouchableOpacity>

        <FlatList
          style={styles.daftarData}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.kartuItem}>
              <View>
                <Text style={styles.textItem}>📘 Judul: {item.Judul_Buku}</Text>
                <Text style={styles.textItem}>✍️ Pengarang: {item.Nama_Pengarang}</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => openModal(item)}
                  style={[styles.tombolEdit, { marginRight: 10 }]}
                >
                  <Text style={styles.textEdit}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.tombolHapus}
                >
                  <Text style={styles.textHapus}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedItem && (
                <>
                  <TextInput
                    style={styles.input}
                    value={selectedItem.Judul_Buku}
                    onChangeText={(text) =>
                      setSelectedItem({ ...selectedItem, Judul_Buku: text })
                    }
                    placeholder="Judul Buku"
                  />
                  <TextInput
                    style={styles.input}
                    value={selectedItem.Nama_Pengarang}
                    onChangeText={(text) =>
                      setSelectedItem({ ...selectedItem, Nama_Pengarang: text })
                    }
                    placeholder="Nama Pengarang"
                  />

                  <TouchableOpacity
                    style={[styles.tombolKirim, { backgroundColor: '#6366F1', marginTop: 20 }]}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.teksTombol}>SIMPAN PERUBAHAN</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity onPress={closeModal} style={styles.iconClose}>
                <Text style={styles.iconText}>✖</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Crud;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  tombolKirim: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  teksTombol: {
    color: '#fff',
    fontWeight: 'bold',
  },
  daftarData: {
    marginBottom: 20,
  },
  kartuItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  textItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tombolEdit: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 8,
  },
  textEdit: {
    color: 'white',
    fontWeight: 'bold',
  },
  tombolHapus: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
  },
  textHapus: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  iconClose: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  iconText: {
    fontSize: 25,
    color: '#333',
  },
});