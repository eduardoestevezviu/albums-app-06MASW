/**
 * Hook personalizado: useAlbums
 *
 * Encapsula toda la interacción con la base de datos de álbumes y proporciona
 * un estado local de la lista de álbumes y su estado de carga
 */

import {
  deleteAlbum,
  fetchAllAlbums,
  insertAlbum,
  updateAlbum,
} from '@/database/albumsDatabase';
import { Album, AlbumInput } from '@/types/album';
import { useCallback, useEffect, useState } from 'react';

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Recarga la lista completa de álbumes desde la base de datos
   * y la guarda en el estado local
   */
  const loadAlbums = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedAlbums = await fetchAllAlbums();
      setAlbums(storedAlbums);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Al montar el hook cargamos los álbumes automáticamente
  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  /**
   * Añade un nuevo álbum y refresca la lista
   */
  const addAlbum = useCallback(
    async (album: AlbumInput) => {
      await insertAlbum(album);
      await loadAlbums();
    },
    [loadAlbums]
  );

  /**
   * Edita un álbum existente y refresca la lista
   */
  const editAlbum = useCallback(
    async (id: number, album: AlbumInput) => {
      await updateAlbum(id, album);
      await loadAlbums();
    },
    [loadAlbums]
  );

  /**
   * Borra un álbum y refresca la lista
   */
  const removeAlbum = useCallback(
    async (id: number) => {
      await deleteAlbum(id);
      await loadAlbums();
    },
    [loadAlbums]
  );

  return {
    albums,
    isLoading,
    loadAlbums,
    addAlbum,
    editAlbum,
    removeAlbum,
  };
}