import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react'
import { FlatList, TextInput, TouchableOpacity } from 'react-native-web';
import axios from 'axios';

export default function App() {

  const [ambos, setAmbos] = useState([]) // Armazenar objeto { frase, sentimento } como uma lista única

  const [frase, setFrase] = useState('')

  const implementarAmbos = () => {
    adicionarFrase()
    conversaGpt(frase)
  }

  const capturarFrase = (fraseDigitada) => {
    setFrase(fraseDigitada)
  }

  const conversaGpt = (texto) => {
    axios
      .post('http://localhost:4000/sentimentos', {texto})
      .then((response) => {
        const sentimentoBackend = response.data.sentimento
        let sentimentoObtido = sentimentoBackend.trim()

        const verificaSentimento = /(Positivo|Negativo|Neutro)/i
        const match = sentimentoObtido.match(verificaSentimento)
  
        if (match) {
          const sentimentoExtraido = match[0]
          setAmbos((ambos) => [...ambos, { frase, sentimento: sentimentoExtraido }])
        }
      })
  }

  const adicionarFrase = () => {
    setFrase('')
  }

  return (
    <View style={styles.container}>
      <View style={styles.entradaView}>
        <TextInput 
          placeholder='Insira uma frase...'
          style={styles.sentimentoTextInput}
          onChangeText={capturarFrase}
          value={frase}
        />
        <Button 
          title='OK'
          onPress={implementarAmbos}
        />
      </View>
      
      <FlatList
        data={ambos}
        renderItem={({ item }) => (

          <View style={styles.itemNaLista}>
            <Text>Frase: {item.frase}</Text>
            <Text>Sentimento: {item.sentimento}</Text>
          </View>

        )}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    width: '100%',
    alignItems: 'center'
  },
  sentimentoTextInput: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    marginBottom: 4,
    padding: 12,
    textAlign: 'center'
  },
  entradaView: {
    width: '80%',
    marginBottom: 4
  },
  itemNaLista: {
    padding: 12,
    backgroundColor: '#CCC',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 8,
    textAlign: 'center'
  },
  lembretesView: {
    width: '80%'
  }
})


