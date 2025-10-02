import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';
import MovieCard from '../components/movieCard';
import { fetchMovieList, fetchTvList } from '../api/tmdb';

export default function ListScreen({ route, navigation }) {
  const mediaType = route.params.type;
  const movieSubtypes = [
    { key: 'now_playing', label: 'Now Playing' },
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'upcoming', label: 'Upcoming' },
  ];
  const tvSubtypes = [
    { key: 'airing_today', label: 'Airing Today' },
    { key: 'on_the_air', label: 'On The Air' },
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
  ];

  const [subtype, setSubtype] = useState(mediaType === 'movie' ? 'popular' : 'popular');
  const [menuVisible, setMenuVisible] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tmdbPage, setTmdbPage] = useState(1);
  const [clientPage, setClientPage] = useState(1); 

  useEffect(() => {
    fetchList();
  }, [subtype, tmdbPage]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = mediaType === 'movie' ? await fetchMovieList(subtype, tmdbPage) : await fetchTvList(subtype, tmdbPage);
      setResults(data.results || []);
      setTotalResults(data.total_results || 0);
      setClientPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onDetailsPress = (id, inferredType) => {
    const typeForDetails = inferredType || mediaType;
    navigation.navigate('Details', { id, mediaType: typeForDetails });
  };

  
  const ITEMS_PER_CLIENT_PAGE = 10;
  const startIdx = (clientPage - 1) * ITEMS_PER_CLIENT_PAGE;
  const pageItems = results.slice(startIdx, startIdx + ITEMS_PER_CLIENT_PAGE);

  const nextTmdbPage = () => {
    setTmdbPage((p) => p + 1);
  };

  const availableClientPages = Math.ceil(results.length / ITEMS_PER_CLIENT_PAGE) || 1;

  const subOptions = mediaType === 'movie' ? movieSubtypes : tvSubtypes;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.controls}>
        <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)}>{`Subtype: ${subtype}`}</Button>
        }>
          {subOptions.map(opt => (
            <Menu.Item key={opt.key} onPress={() => { setSubtype(opt.key); setMenuVisible(false); setTmdbPage(1); }} title={opt.label} />
          ))}
        </Menu>
        <Button onPress={() => { setTmdbPage(1); fetchList(); }}>Refresh</Button>
      </View>

      {loading ? <Text style={{ padding: 16 }}>Loading...</Text> : (
        <>
          <FlatList data={pageItems} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (
            <MovieCard item={item} onDetailsPress={onDetailsPress} />
          )} ListEmptyComponent={<Text style={{ padding: 16 }}>No results</Text>} />
          <Divider />
          <View style={styles.pagination}>
        
            {Array.from({ length: availableClientPages }, (_, i) => i + 1).map(p => (
              <Button key={p} mode={p === clientPage ? 'contained' : 'outlined'} onPress={() => setClientPage(p)} style={{ marginRight: 6 }}>
                {p}
              </Button>
            ))}
            
            <Button mode="text" onPress={nextTmdbPage} style={{ marginLeft: 12 }}>Next TMDB page</Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: { flexDirection: 'row', justifyContent: 'flex-start', padding: 55, gap: 30, flexWrap: 'wrap' },
  pagination: { flexDirection: 'row', padding: 10, alignItems: 'center', flexWrap: 'wrap' },
  backgroundColor: "#9c8383ff", 
  padding: 10,
  paddingTop: 40,
});
