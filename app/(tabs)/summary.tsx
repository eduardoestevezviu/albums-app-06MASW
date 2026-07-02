/**
 * Pantalla de resumen 
 *
 * Muestra estadísticas de la colección: el número total de álbumes
 * y cuántos hay en cada estado
 */

import { statusLabels } from '@/constants/albumOptions';
import { colors } from '@/constants/theme';
import { useAlbums } from '@/hooks/useAlbums';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>
      <Text style={styles.sectionTitle}>Resumen de tu colección</Text>

      <View style={styles.statCard}>
        <Ionicons name="albums" size={24} color={colors.primary} />
        <Text style={styles.statNumber}>{albums.length}</Text>
        <Text style={styles.statLabel}>Álbumes en total</Text>
      </View>

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

      <Text style={styles.sectionTitle}>Acerca de</Text>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutText}>
          Albums App es una aplicación para catalogar tus álbumes de
          música favoritos.
        </Text>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>
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
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
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
    marginTop: 12,
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
  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  aboutText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  version: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
  },
});