/**
 * Definición del modelo de datos de un álbum musical
 */

// Estados posibles de escucha de un álbum
export type AlbumStatus = 'pendiente' | 'escuchado' | 'favorito';

export interface Album {
  id: number;
  title: string;   
  artist: string;  
  year: number;    
  genre: string;   
  rating: number;  
  status: AlbumStatus;
}

/**
 * Datos de un álbum antes de guardarlo (aún no tiene id, porque lo
 * asigna sola la base de datos). Se usa en los formularios.
 */
export type AlbumInput = Omit<Album, 'id'>;