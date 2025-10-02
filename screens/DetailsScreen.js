import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { fetchMovieDetails, fetchTvDetails } from '../api/tmdb';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function DetailsScreen({ route }) {
  const { id, mediaType } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = mediaType === 'movie' ? await fetchMovieDetails(id) : await fetchTvDetails(id);
        setItem({ ...data, media_type: mediaType });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, mediaType]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (!item) return <Text style={{ padding: 16 }}>Could not load details.</Text>;

  return (
    <ScrollView style={{ flex: 1 }}>
      {item.poster_path ? <Image source={{ uri: `${IMAGE_BASE}${item.poster_path}` }} style={styles.poster} /> : null}
      <View style={{ padding: 12 }}>
        <Text style={styles.title}>{item.title || item.name}</Text>
        <Text style={styles.meta}>{item.release_date || item.first_air_date} • {item.status || ''}</Text>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{item.overview || 'No overview.'}</Text>

        <Text style={styles.sectionTitle}>Additional Info</Text>
        <Text>Vote Average: {item.vote_average}</Text>
        <Text>Vote Count: {item.vote_count}</Text>
        <Text>Genres: {(item.genres || []).map(g => g.name).join(', ')}</Text>
        <Text>Runtime: {item.runtime ? `${item.runtime} mins` : (item.episode_run_time ? `${item.episode_run_time.join(', ')} mins` : 'N/A')}</Text>
        <Text>Homepage: {item.homepage || 'N/A'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  poster: { width: '100%', height: 420 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  meta: { color: '#666', marginTop: 4 },
  sectionTitle: { marginTop: 12, fontWeight: 'bold' },
  overview: { marginTop: 6, lineHeight: 20 },
  backgroundColor: "#fff", 
  padding: 40 
});
