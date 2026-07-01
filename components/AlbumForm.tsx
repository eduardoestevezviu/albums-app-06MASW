/**
 * Componente reutilizable: AlbumForm
 *
 * Formulario con todos los campos de un álbum. Se reutiliza en dos
 * pantallas: la de creación de un álbum nuevo y la de edición de uno
 * existente
 */

import { musicGenres, statusLabels } from '@/constants/albumOptions';
import { colors } from '@/constants/theme';
import { AlbumInput, AlbumStatus } from '@/types/album';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface AlbumFormProps {
  initialValues?: AlbumInput;        
  submitLabel: string;               
  onSubmit: (album: AlbumInput) => void;  
}

// Formulario en blanco
const emptyAlbum: AlbumInput = {
  title: '',
  artist: '',
  year: new Date().getFullYear(),
  genre: musicGenres[0],
  rating: 3,
  status: 'pendiente',
};

const statusOptions = Object.keys(statusLabels) as AlbumStatus[];

export function AlbumForm({
  initialValues,
  submitLabel,
  onSubmit,
}: AlbumFormProps) {
  // Guardamos cada campo del formulario en su propio estado
  const startValues = initialValues ?? emptyAlbum;
  const [title, setTitle] = useState(startValues.title);
  const [artist, setArtist] = useState(startValues.artist);
  const [year, setYear] = useState(String(startValues.year));
  const [genre, setGenre] = useState(startValues.genre);
  const [rating, setRating] = useState(startValues.rating);
  const [status, setStatus] = useState<AlbumStatus>(startValues.status);
  const [error, setError] = useState('');

  /**
   * Valida los campos y, si todo es correcto, avisa al padre con los
   * datos del álbum listos para guardar
   */
  const handleSubmit = () => {
    const parsedYear = parseInt(year, 10);

    if (!title.trim() || !artist.trim()) {
      setError('El título y el artista son obligatorios');
      return;
    }
    const currentYear = new Date().getFullYear();
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear) {
      setError('Introduce un año válido');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      artist: artist.trim(),
      year: parsedYear,
      genre,
      rating,
      status,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ej. OK Computer"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Artista</Text>
      <TextInput
        style={styles.input}
        value={artist}
        onChangeText={setArtist}
        placeholder="Ej. Radiohead"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Año</Text>
      <TextInput
        style={styles.input}
        value={year}
        onChangeText={setYear}
        placeholder="Ej. 1997"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        maxLength={4}
      />

      <Text style={styles.label}>Género</Text>
      <View style={styles.chipGroup}>
        {musicGenres.map((option) => {
          const isSelected = option === genre;
          return (
            <Pressable
              key={option}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setGenre(option)}>
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Valoración</Text>
      <View style={styles.chipGroup}>
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = value === rating;
          return (
            <Pressable
              key={value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setRating(value)}>
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {value} ★
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Estado</Text>
      <View style={styles.chipGroup}>
        {statusOptions.map((option) => {
          const isSelected = option === status;
          return (
            <Pressable
              key={option}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setStatus(option)}>
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {statusLabels[option]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>
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
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.text,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});