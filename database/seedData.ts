/**
 * Seeder para poblar la base de datos
 */

import { AlbumInput } from '@/types/album';

export const seedAlbums: AlbumInput[] = [
  { title: 'OK Computer', artist: 'Radiohead', year: 1997, genre: 'Rock', rating: 5, status: 'favorito' },
  { title: 'Thriller', artist: 'Michael Jackson', year: 1982, genre: 'Pop', rating: 5, status: 'escuchado' },
  { title: 'Random Access Memories', artist: 'Daft Punk', year: 2013, genre: 'Electrónica', rating: 4, status: 'favorito' },
  { title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar', year: 2015, genre: 'Hip-Hop', rating: 5, status: 'escuchado' },
  { title: 'Kind of Blue', artist: 'Miles Davis', year: 1959, genre: 'Jazz', rating: 5, status: 'pendiente' },
  { title: 'Nevermind', artist: 'Nirvana', year: 1991, genre: 'Rock', rating: 4, status: 'escuchado' },
  { title: 'Rumours', artist: 'Fleetwood Mac', year: 1977, genre: 'Rock', rating: 4, status: 'pendiente' },
  { title: 'Discovery', artist: 'Daft Punk', year: 2001, genre: 'Electrónica', rating: 5, status: 'favorito' },
  { title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: 1973, genre: 'Rock', rating: 5, status: 'escuchado' },
  { title: 'Blonde', artist: 'Frank Ocean', year: 2016, genre: 'R&B', rating: 4, status: 'pendiente' },
];