import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Menu } from 'react-native-paper';
import MovieCard from '../components/movieCard';
import { fetchSearch } from '../api/tmdb';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie'); 
  const [menuVisible, setMenuVisible] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('Enter the keyword to search press Search button.');
  const [loading, setLoading] = useState(false);

const onSearch = async () => {
  const trimmed = query.trim();

  if (!trimmed) {
    setResults([]);
    setMessage('Please enter a search keyword or query');
    return;
  }

  setLoading(true);
  try {
    const data = await fetchSearch(trimmed, type, 1);
    setResults(data.results || []);
    setMessage(`${data.total_results || 0} results for "${trimmed}"`);
  } catch (e) {
    console.error(e);
    setMessage('Error in fetching the search results.');
    setResults([]);
  } finally {
    setLoading(false);
  }
};

  const onDetailsPress = (id, inferredType) => {
    const mediaType = inferredType || type;
    navigation.navigate('Details', { id, mediaType });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchForm}>
        <TextInput label="Search" value={query} onChangeText={setQuery} style={{ flex: 1 }} />
        <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)} style={{ marginLeft: 8 }}>{type}</Button>
        }>
          <Menu.Item onPress={() => { setType('movie'); setMenuVisible(false); }} title="movie" />
          <Menu.Item onPress={() => { setType('tv'); setMenuVisible(false); }} title="tv" />
          <Menu.Item onPress={() => { setType('multi'); setMenuVisible(false); }} title="multi" />
        </Menu>
        <Button mode="contained" onPress={onSearch} style={{ marginLeft: 8 }}>Search</Button>
      </View>

      {loading ? <Text style={{ padding: 16 }}>Searching...</Text> : (
        <>
          {results.length === 0 ? (
            <Text style={{ padding: 16 }}>{message}</Text>
          ) : (
            <FlatList data={results} renderItem={({ item }) => <MovieCard item={item} onDetailsPress={onDetailsPress} />} keyExtractor={(item) => `${item.id}-${item.media_type || type}`} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchForm: { flexDirection: 'row', justifyContent: 'flex-start', padding: 55, flexWrap: 'wrap', alignItems: 'center' },
});
