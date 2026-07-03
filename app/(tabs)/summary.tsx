/**
 * Pantalla de resumen 
 *
 * Muestra estadísticas de la colección: el número total de álbumes
 * y cuántos hay en cada estado
 */

import { statusLabels } from '@/constants/albumOptions';
import { colors } from '@/constants/theme';
import { useAlbums } from '@/hooks/useAlbums';
import { Album } from '@/types/album';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Calcula la valoración media de una lista de álbumes (0 si está vacía)
function calcAverageRating(albums: Album[]): number {
  if (albums.length === 0) return 0;
  const total = albums.reduce((sum, album) => sum + album.rating, 0);
  return total / albums.length;
}

// Cuenta cuántos álbumes hay de cada género y los devuelve ordenados
function countByGenre(albums: Album[]): { genre: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const album of albums) {
    counts[album.genre] = (counts[album.genre] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

export default function SummaryScreen() {
  const { albums, loadAlbums } = useAlbums();
  const insets = useSafeAreaInsets();

  // Recargamos los datos al mostrar la pantalla para tener cifras al día
  useFocusEffect(
    useCallback(() => {
      loadAlbums();
    }, [loadAlbums])
  );

  // Cuenta cuántos álbumes hay en un estado concreto
  const countByStatus = (status: string) =>
    albums.filter((album) => album.status === status).length;

  // Cálculos derivados de la colección
  const averageRating = calcAverageRating(albums);
  const genreBreakdown = countByGenre(albums);
  const favoriteGenre = genreBreakdown.length > 0 ? genreBreakdown[0].genre : '—';
  const maxGenreCount = genreBreakdown.length > 0 ? genreBreakdown[0].count : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>
      <Text style={styles.sectionTitle}>Resumen de tu colección</Text>

      {/* Tarjeta principal con el total de álbumes */}
      <View style={styles.statCard}>
        <Ionicons name="albums" size={24} color={colors.primary} />
        <Text style={styles.statNumber}>{albums.length}</Text>
        <Text style={styles.statLabel}>Álbumes en total</Text>
      </View>

      {/* Media y género favorito */}
      <View style={[styles.statsRow, { marginTop: 12 }]}>
        <View style={styles.highlightCard}>
          <Ionicons name="star" size={20} color={colors.star} />
          <Text style={styles.highlightNumber}>
            {averageRating.toFixed(1)}
          </Text>
          <Text style={styles.highlightLabel}>Valoración media</Text>
        </View>
        <View style={styles.highlightCard}>
          <Ionicons name="heart" size={20} color={colors.primary} />
          <Text style={styles.highlightNumber}>{favoriteGenre}</Text>
          <Text style={styles.highlightLabel}>Género favorito</Text>
        </View>
      </View>

      {/* Recuento por estado */}
      <Text style={styles.sectionTitle}>Por estado</Text>
      <View style={styles.statsRow}>
        <View style={styles.smallStat}>
          <Text style={styles.smallNumber}>{countByStatus('favorito')}</Text>
          <Text style={styles.smallLabel}>{statusLabels.favorito}</Text>
        </View>
        <View style={styles.smallStat}>
          <Text style={styles.smallNumber}>{countByStatus('escuchado')}</Text>
          <Text style={styles.smallLabel}>{statusLabels.escuchado}</Text>
        </View>
        <View style={styles.smallStat}>
          <Text style={styles.smallNumber}>{countByStatus('pendiente')}</Text>
          <Text style={styles.smallLabel}>{statusLabels.pendiente}</Text>
        </View>
      </View>

      {/* Desglose por género con barras */}
      {genreBreakdown.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Por género</Text>
          <View style={styles.genreCard}>
            {genreBreakdown.map((item) => (
              <View key={item.genre} style={styles.genreRow}>
                <Text style={styles.genreName}>{item.genre}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(item.count / maxGenreCount) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.genreCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  highlightNumber: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  highlightLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  smallStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  smallNumber: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  smallLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  genreCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  genreName: {
    color: colors.text,
    fontSize: 13,
    width: 90,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  genreCount: {
    color: colors.textMuted,
    fontSize: 13,
    width: 24,
    textAlign: 'right',
  },
});