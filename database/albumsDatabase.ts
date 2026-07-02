/**
 * Capa de acceso a la base de datos SQLite
 *
 * Abre la base de datos y crea la tabla de álbumes si no existe, y define
 * las operaciones de lectura y escritura de álbumes
 */

import { Album, AlbumInput } from '@/types/album';
import * as SQLite from 'expo-sqlite';
import { seedAlbums } from './seedData';

const DATABASE_NAME = 'albums.db';

// Guardamos una única conexión y la reutilizamos en toda la app
let database: SQLite.SQLiteDatabase | null = null;
// Guardamos la promesa de sembrado para no repetirlo aunque se llame varias veces
let seedPromise: Promise<void> | null = null;

/**
 * Abre la base de datos (solo la primera vez) y garantiza que la
 * tabla de álbumes existe. Devuelve la conexión a la base de datos
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Creamos la tabla solo si no existía todavía
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      rating INTEGER NOT NULL,
      status TEXT NOT NULL
    );
  `);

  return database;
}

/**
 * Recupera todos los álbumes ordenados por título
 */
export async function fetchAllAlbums(): Promise<Album[]> {
  const db = await getDatabase();
  const albums = await db.getAllAsync<Album>(
    'SELECT * FROM albums ORDER BY title COLLATE NOCASE ASC'
  );
  return albums;
}

/**
 * Recupera un único álbum por su id
 */
export async function fetchAlbumById(id: number): Promise<Album | null> {
  const db = await getDatabase();
  const album = await db.getFirstAsync<Album>(
    'SELECT * FROM albums WHERE id = ?',
    id
  );
  return album ?? null;
}

/**
 * Inserta un nuevo álbum y devuelve el id 
 */
export async function insertAlbum(album: AlbumInput): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO albums (title, artist, year, genre, rating, status) VALUES (?, ?, ?, ?, ?, ?)',
    album.title,
    album.artist,
    album.year,
    album.genre,
    album.rating,
    album.status
  );
  return result.lastInsertRowId;
}

/**
 * Actualiza los datos de un álbum existente identificado por su id
 */
export async function updateAlbum(id: number, album: AlbumInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE albums SET title = ?, artist = ?, year = ?, genre = ?, rating = ?, status = ? WHERE id = ?',
    album.title,
    album.artist,
    album.year,
    album.genre,
    album.rating,
    album.status,
    id
  );
}

/**
 * Borra un álbum de la base de datos por su id
 */
export async function deleteAlbum(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM albums WHERE id = ?', id);
}

/**
 * Seeder para poblar la base de datos con datos de ejemplo si está vacía
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  // Si ya se está sembrando (o se sembró), reutilizamos esa misma promesa
  if (seedPromise) {
    return seedPromise;
  }
  
  seedPromise = (async () => {
    const db = await getDatabase();

    const row = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) AS total FROM albums'
    );

    if (row && row.total > 0) {
      return;
    }

    for (const album of seedAlbums) {
      await insertAlbum(album);
    }
  })();
}