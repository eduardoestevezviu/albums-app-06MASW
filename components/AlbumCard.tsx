/**
 * Componente reutilizable: AlbumCard
 *
 * Representa un único álbum dentro del listado como una tarjeta con
 * su título, artista, año, género, estado y valoración
 * Al pulsarla, ejecuta la función onPress que le pasa la pantalla
 */

import { statusLabels } from '@/constants/albumOptions';
import { colors } from '@/constants/theme';
import { Album } from '@/types/album';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
}

export function AlbumCard({ album, onPress }: AlbumCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(album)}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {album.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusLabels[album.status]}</Text>
        </View>
      </View>

      <Text style={styles.artist} numberOfLines={1}>
        {album.artist}
      </Text>

      <Text style={styles.meta}>
        {album.genre} · {album.year}
      </Text>

      <Text style={styles.rating}>{'★'.repeat(album.rating)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    backgroundColor: colors.surfaceLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  artist: {
    color: colors.text,
    fontSize: 14,
    marginTop: 4,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  rating: {
    color: colors.star,
    fontSize: 15,
    marginTop: 8,
  },
});