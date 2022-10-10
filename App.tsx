import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Image, Text, TextInput, TouchableHighlight, View } from 'react-native';

const availableSearches = ["55 Water St, 10041","240 Kent Ave, 11249","232 Willow Ave, 07030","245 E 63rd St, 10065"]

export default function App() {

  const [filteredData, setFilteredData] = useState([])
  const [query, setQuery] = useState<string | undefined>()
  const [validSearchs] = useState<Array<String>>(() => availableSearches.map(item => item.replace(',', '').toLowerCase().split(' ').join("_")))

  useEffect(() => {
    if (query) {
      const formatedString = query.replace(',', '').toLowerCase().split(' ').filter(item => item !== "").join("_")
      if (validSearchs.includes(formatedString)) {
        setFilteredData([]);
        fetchPlaces(formatedString);
      }
      console.log("55 Water St,  10041".replace(',', '').toLowerCase().split(' ').join("_"));
      
    }

  }, [query])

  const fetchPlaces = (address: String) => {
    const apiUrl = `https://dcom-native-interview.s3.amazonaws.com/api/merchant/query/${address}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(responseJson => {
        setFilteredData(responseJson.merchants);
      }).catch(error => { console.error(error) });
  }

  const ItemView = ({ item }: any) => {
    return <View style={styles.itemViewContainer}>
      <Image style={styles.tinyLogo} source={{ uri: item.logo_url }} />
      <Text style={styles.itemStyle}>
        {item.name}
      </Text>
    </View>
  }

  const ItemSeperatorView = ({ item }: any) => {
    return <View style={{ height: 0.5, width: '100%', backgroundColor: '#c8c8c8' }} />
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          value={query}
          underlineColorAndroid="transparent"
          onChangeText={setQuery}
          placeholder="street address, zip code"
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeperatorView}
          renderItem={ItemView}
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },

  tinyLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemViewContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  itemStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    width: '80%',
  },
  textInputStyle: {
    height: 50,
    width: '80%',
    borderWidth: 1,
    paddingLeft: 20,
    margin: 1,
    borderColor: '#009688',
  }
});
