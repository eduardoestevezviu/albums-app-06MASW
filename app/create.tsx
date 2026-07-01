/**
 * Pantalla de creación de un álbum nuevo
 *
 */

import { AlbumForm } from '@/components/AlbumForm';
import { useAlbums } from '@/hooks/useAlbums';
import { AlbumInput } from '@/types/album';
import { useRouter } from 'expo-router';

export default function CreateAlbumScreen() {
  const router = useRouter();
  const { addAlbum } = useAlbums();

  /**
   * Guarda el nuevo álbum y regresa a la pantalla anterior
   */
  const handleCreate = async (album: AlbumInput) => {
    await addAlbum(album);
    router.back();
  };

  return <AlbumForm submitLabel="Guardar álbum" onSubmit={handleCreate} />;
}