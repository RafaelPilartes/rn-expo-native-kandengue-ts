# Features, Ferramentas e Dependências — App Passageiro

Este documento agrupa as principais features e versões de dependências da stack tecnológica do projeto, servindo como referência rápida do que está implementado.

## Features Principais

### 1. Sistema de Localização e Modos de Tracking

A app possui 3 modos de rastreamento (`src/types/trackingTypes.ts`):

- **PASSIVE**: Baixa frequência, serve para atualizar a região atual do passageiro.
- **RIDE**: Alta frequência (~5s), ativado durante a corrida (foreground + background).
- **OFFLINE**: Nenhum rastreamento quando o utilizador está deslogado.

### 2. Integração Avançada de Mapas

- Usa `expo-maps` (não `react-native-maps`).
- Renderiza rotas codificadas via `@mapbox/polyline`.
- Suporta **Polyline Trimming** e **Rotação do Ícone** em tempo real.
- Usa Google Maps API para geocoding e autocomplete.

### 3. Sistema de Alertas (AlertContext)

- Substituição completa do `Alert.alert` nativo do React Native.
- Componente `CustomAlert` animado com `react-native-reanimated`.
- Possui 4 variantes: `success`, `error`, `warning`, `info`.

### 4. Firebase Auth & Firestore

- Autenticação por Email/Password e Social Login.
- Usa Firestore para realtime database de corridas (`rides`) e localização (`rideTracking`).
- Firebase Storage usado para upload de imagens.

### 5. Internacionalização (i18n) e Network Awareness

- Usa `react-i18next` para traduções dinâmicas na UI (Português/Inglês).
- Usa `@react-native-community/netinfo` para detetar perda de ligação e exibir banners de aviso.

---

## Versões Principais das Bibliotecas

| Categoria    | Biblioteca                 | Versão     |
| ------------ | -------------------------- | ---------- |
| **Core**     | React Native               | `0.81.5`   |
| **Core**     | Expo                       | `~54.0.25` |
| **Core**     | TypeScript                 | `~5.9.2`   |
| **State**    | Zustand                    | `^5.0.8`   |
| **State**    | TanStack React Query       | `^5.90.11` |
| **Nav**      | React Navigation           | `^7.1.22`  |
| **UI**       | NativeWind                 | `^4.2.1`   |
| **UI**       | React Native Reanimated    | `~4.1.1`   |
| **UI**       | Lucide React Native        | `^0.555.0` |
| **Mapas**    | expo-maps                  | `~0.12.10` |
| **Mapas**    | expo-location              | `~19.0.7`  |
| **Mapas**    | expo-task-manager          | `~14.0.9`  |
| **Firebase** | @react-native-firebase/app | `^23.5.0`  |
| **Storage**  | react-native-mmkv          | `^4.0.1`   |
| **Storage**  | react-native-keychain      | `^10.0.0`  |
| **Forms**    | react-hook-form            | `^7.66.1`  |
| **Forms**    | zod                        | `^4.1.12`  |

## Suporte

- **Repositório:** [RafaelPilartes/rn-expo-native-kandengue-ts](https://github.com/RafaelPilartes/rn-expo-native-kandengue-ts)
- **Email:** suporte@kandengue.com

---

**Anterior**: [13 — Design System](13-design-system.md)
