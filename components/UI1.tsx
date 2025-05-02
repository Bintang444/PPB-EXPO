import { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';

const HalamanPertama = () => {
    const [name,setName] = useState ('');

    return(
        <View style={styles.container1}>
            <View style={styles.lingakran1}/>
            <View style={styles.lingkaran2}/>
            <View />
            <TextInput style={styles.inputNama} value={name} onChangeText={(Text) => setName(Text)}></TextInput>
        </View>
    )
}

export default HalamanPertama;

const styles = StyleSheet.create({
    container1: {
        margin: 40,
        borderWidth: 1,
        height: 900,
        borderRadius: 20,
    },

    lingakran1: {
        width: 150,
        height: 150,
        backgroundColor: '#2f4f4f',
        borderRadius: 100,
        alignSelf: 'center',
        marginRight: 100
    },

    lingkaran2: {
        width: 150,
        height: 150,
        backgroundColor: 'pink',
        borderRadius: 100,
        position: 'absolute',
        marginLeft: 180
    },

    inputNama: {
        borderWidth: 1,
        width: 250, 
        height: 50,
        alignSelf: 'center',
        borderRadius: 15,

        
    },
})