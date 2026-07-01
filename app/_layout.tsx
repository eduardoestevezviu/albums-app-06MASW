import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Layout raíz: define el Stack de navegación principal de la app.
export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1625' },
          headerTintColor: '#f4f1fa',
          headerTitleStyle: { fontWeight: '700' },
        }}>
        {/* Grupo de pestañas: es la pantalla principal */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Pantalla de creación, se abrirá como modal encima de las tabs. */}
        <Stack.Screen
          name="create"
          options={{ title: 'Nuevo álbum', presentation: 'modal' }}
        />

        {/* Pantalla de edición de un álbum concreto. */}
        <Stack.Screen name="edit/[id]" options={{ title: 'Editar álbum' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}