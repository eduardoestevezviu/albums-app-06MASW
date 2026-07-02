/**
 * Pantalla de edición de un álbum existente
 *
 * Usa una ruta dinámica de Expo Router: el id del álbum viaja en la
 * URL (edit/[id])
 */

import { AlbumForm } from '@/components/AlbumForm';
import { colors } from '@/constants/theme';
import { fetchAlbumById } from '@/database/albumsDatabase';
import { useAlbums } from '@/hooks/useAlbums';
import { Album, AlbumInput } from '@/types/album';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function EditAlbumScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { editAlbum, removeAlbum } = useAlbums();

  // Recogemos el id de la ruta dinámica y lo convertimos a número
  const { id } = useLocalSearchParams<{ id: string }>();
  const albumId = Number(id);

  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargamos el álbum que se va a editar a partir de su id
  useEffect(() => {
    const loadAlbum = async () => {
      const found = await fetchAlbumById(albumId);
      setAlbum(found);
      setIsLoading(false);
    };
    loadAlbum();
  }, [albumId]);

  /**
   * Pide confirmación y, si el usuario acepta, borra el álbum y
   * vuelve al listado
   */
  const handleDelete = () => {
    Alert.alert(
      'Borrar álbum',
      '¿Seguro que quieres borrar este álbum? Esta acción no se puede deshacer',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await removeAlbum(albumId);
            router.back();
          },
        },
      ]
    );
  };

  /**
   * Añadimos el botón de borrar a la cabecera de la pantalla
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleDelete} hitSlop={10} style={{ marginLeft: 8 }}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </Pressable>
      ),
    });
  }, [navigation]);

  /**
   * Guarda los cambios del álbum y vuelve al listado
   */
  const handleUpdate = async (updated: AlbumInput) => {
    await editAlbum(albumId, updated);
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // Si no se encuentra el álbum (por ejemplo, ya borrado), avisamos
  if (!album) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>No se ha encontrado el álbum</Text>
      </View>
    );
  }

  return (
    <AlbumForm
      initialValues={{
        title: album.title,
        artist: album.artist,
        year: album.year,
        genre: album.genre,
        rating: album.rating,
        status: album.status,
      }}
      submitLabel="Guardar cambios"
      onSubmit={handleUpdate}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  notFound: {
    color: colors.textMuted,
    fontSize: 15,
  },
});