import axios from 'axios';
import React, {useState, useEffect } from 'react'; 
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native'; 
 
const Crud = () => {
  type Catatan = {
    id: number,
    Nama: string,
    Catatanku: string,
    Hobi: string,
    Tanggal: string
  } 

  const [nama,setNama] = useState (''); 
  const [catatan,setCatatan] = useState (''); 
  const [hobi, setHobi] = useState ('');
  const [data, setData] = useState<Catatan[]>([]); 


  const handleButton = () => {
    if (nama === '' && catatan === '' && hobi === '' ) {
      Alert.alert('Error', 'Data Harus Lengkap!');
      return;
    }

    axios
    .post('http://192.168.0.139/ppb_bintang/add.php', {nama,catatan,hobi})
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

  useEffect(() => {
    fetchData();
  }, []);
   
  return ( 

       
      <View style={styles.container}> 
        <View> 
        <Text style={styles.teks}>Catatan Saya </Text> 
          <Text style={styles.teks1}>Nama :</Text> 
          <TextInput style={styles.input} value={nama} onChangeText={(text) => setNama(text)} placeholder='Masukan Namamu' /> 
          <Text style={styles.teks2}>Catatan :</Text> 
          <TextInput style={styles.input1} value={catatan} onChangeText={(text) => setCatatan(text)} multiline={true} placeholder='Masukan Catatanmu' /> 
          <Text style={styles.teks3}>Hobi :</Text> 
          <TextInput style={styles.input2} value={hobi} onChangeText={(text) => setHobi(text)} placeholder='Masukan Hobimu' /> 
        </View> 
        <View> 
            <View style={styles.buttonContainer} > 
                <TouchableOpacity style={styles.button}  onPress={handleButton}> 
                    <Text style={styles.buttonText}>Kirim</Text> 
                </TouchableOpacity>   
            </View> 
            <FlatList
    data={data}
    style={styles.list}
    contentContainerStyle={{ paddingBottom: 100 }}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.cardText}>Nama: {item.Nama}</Text>
        <Text style={styles.cardText}>Catatan: {item.Catatanku}</Text>
        <Text style={styles.cardText}>Hobi: {item.Hobi}</Text>
        <Text style={styles.cardText}>Tanggal: {item.Tanggal}</Text>
      </View>
    )}
  />

        </View>
      </View> 
  ); 
} 

export default Crud;
 
const styles = StyleSheet.create({ 
  container: { 
    marginTop: 30, 
    marginLeft: 65, 
    marginRight: 65, 
    borderWidth: 3, 
    height: 650, 
    borderRadius: 12, 
    borderColor: '#7dafc8', 
  }, 
 
  teks: { 
    textAlign: 'center', 
    fontSize: 25, 
    marginTop: 40, 
    fontWeight: 'bold'  
  }, 
 
  teks1: { 
    fontSize: 18, 
    marginTop: 50, 
    marginLeft: 15 
  }, 
 
  teks2: { 
    fontSize: 18, 
    marginTop: 20, 
    marginLeft: 15 
  }, 

  teks3: { 
    fontSize: 18, 
    marginTop: 20, 
    marginLeft: 15 
  }, 
 
  input: { 
    borderColor: '#7dafc8', 
    borderWidth: 2, 
    width: 320, 
    height: 50, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 10, 
    paddingHorizontal: 20, 
  }, 
 
  input1: { 
    borderColor: '#7dafc8', 
    borderWidth: 2, 
    width: 320, 
    height: 120, 
    borderRadius: 7, 
    alignSelf: 'center', 
    marginTop: 10, 
    paddingHorizontal: 20, 
    textAlignVertical: 'top' 
  }, 

  input2: { 
    borderColor: '#7dafc8', 
    borderWidth: 2, 
    width: 320, 
    height: 50, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 10, 
    paddingHorizontal: 20, 
  },
 
  buttonContainer: { 
    alignSelf: 'flex-end', 
    width: '42%', 
    height: '35%', 
    marginTop: 40, 
 
  }, 
 
  button: { 
    backgroundColor: '#7dafc8', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 10, 
    marginRight: 15 
  }, 
 
  buttonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center', 
  }, 
  list: {
    marginBottom: -70,
    marginHorizontal: 15,
    maxHeight: 250,
  },
  
  card: {
    backgroundColor: '#e6f2fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#7dafc8',
  },
  
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
  
});