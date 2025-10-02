import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

export default function ItemCard({ item, onDetailsPress }) {
  const title = item.title || item.name || 'Untitled';
  const subtitle = item.release_date || item.first_air_date || '';
  const poster = item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {poster ? <Image source={{ uri: poster }} style={styles.poster} /> : <View style={styles.posterPlaceholder} />}
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text numberOfLines={3} style={styles.small}>
            {item.vote_average ? `Rating: ${item.vote_average} • Vote Count: ${item.vote_count || 0}` : ''}
          </Text>
          <Button mode="contained" onPress={() => onDetailsPress(item.id, item.media_type || (item.title ? 'movie' : 'tv'))} style={{ marginTop: 8 }}>
            More Details
          </Button>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { margin: 10, padding: 10 },
  row: { flexDirection: 'row' },
  poster: { width: 100, height: 150, borderRadius: 8 },
  posterPlaceholder: { width: 100, height: 150, backgroundColor: '#ddd', borderRadius: 4 },
  info: { flex: 1, marginLeft: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#3d3939ff', marginTop: 4 },
  small: { marginTop: 8, color: '#302d2dff' },
});
