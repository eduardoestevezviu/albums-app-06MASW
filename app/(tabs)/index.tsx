/**
 * Pantalla de Mi colección: lista de álbumes guardados
 *
 * Muestra todos los álbumes guardados en SQLite 
 */

import { AlbumCard } from '@/components/AlbumCard';
import { colors } from '@/constants/theme';
import { useAlbums } from '@/hooks/useAlbums';
import { Album } from '@/types/album';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function AlbumListScreen() {
  const router = useRouter();
  const { albums, isLoading, loadAlbums } = useAlbums();

  // Recargamos la lista cada vez que la pantalla vuelve a estar visible
  useFocusEffect(
    useCallback(() => {
      loadAlbums();
    }, [loadAlbums])
  );

  // Navega a la pantalla de edición del álbum tocado
  const handleOpenAlbum = (album: Album) => {
    router.push(`/edit/${album.id}`);
  };

  // Navega a la pantalla de creación
  const handleCreate = () => {
    router.push('/create');
  };

  // Mientras carga por primera vez mostramos un indicador
  if (isLoading && albums.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <AlbumCard album={item} onPress={handleOpenAlbum} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Tu colección está vacía</Text>
            <Text style={styles.emptyText}>
              Añade tu primer álbum con el botón de abajo
            </Text>
          </View>
        }
      />

      {/* Botón para crear un álbum nuevo */}
      <Pressable style={styles.fab} onPress={handleCreate}>
        <Ionicons name="add" size={28} color={colors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});