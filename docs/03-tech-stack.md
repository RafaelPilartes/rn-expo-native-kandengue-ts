# Tech Stack — App Passageiro

## Stack Principal

| Camada           | Tecnologia           | Versão   |
| ---------------- | -------------------- | -------- |
| Framework mobile | React Native         | 0.81.5   |
| Toolchain        | Expo (Bare Workflow) | ~54.0.25 |
| Linguagem        | TypeScript           | ~5.9.2   |
| Biblioteca UI    | React                | 19.x     |

## Navegação

| Lib                    | Versão | Uso                             |
| ---------------------- | ------ | ------------------------------- |
| React Navigation       | 7.x    | Navegação nativa (stack + tabs) |
| Native Stack Navigator | —      | Transições nativas iOS/Android  |
| Bottom Tabs Navigator  | —      | Navegação principal             |

## Estilização

| Lib                          | Versão  | Uso                            |
| ---------------------------- | ------- | ------------------------------ |
| NativeWind                   | 4.2.1   | Tailwind CSS para React Native |
| React Native Reanimated      | ~4.1.1  | Animações 60fps (Worklets)     |
| React Native Linear Gradient | 2.8.3   | Gradientes                     |
| Lucide React Native          | 0.555.0 | Ícones modernos                |

## Firebase

| Módulo                           | Versão  | Uso                         |
| -------------------------------- | ------- | --------------------------- |
| @react-native-firebase/app       | ^23.5.0 | Inicialização               |
| @react-native-firebase/auth      | ^23.5.0 | Autenticação                |
| @react-native-firebase/firestore | ^23.5.0 | Base de dados em tempo real |
| @react-native-firebase/messaging | ^23.5.0 | Push notifications (FCM)    |
| @react-native-firebase/storage   | ^23.5.0 | Upload de imagens           |

## Mapas e Localização

| Lib               | Versão   | Uso                                  |
| ----------------- | -------- | ------------------------------------ |
| expo-maps         | ~0.12.10 | Visualização de mapas (Apple/Google) |
| expo-location     | ~19.0.7  | GPS e geolocalização                 |
| expo-task-manager | ~14.0.9  | Background tasks                     |
| @mapbox/polyline  | ^1.2.1   | Decode de rotas encoded              |

## Gestão de Estado e Data Fetching

| Lib                  | Versão   | Uso                  |
| -------------------- | -------- | -------------------- |
| Zustand              | ^5.0.8   | Estado global        |
| TanStack React Query | ^5.90.11 | Server state + cache |

## Armazenamento Local

| Lib                         | Versão  | Uso                           |
| --------------------------- | ------- | ----------------------------- |
| react-native-mmkv           | ^4.0.1  | Storage ultra-rápido (sync)   |
| @react-native-async-storage | 2.2.0   | Storage assíncrono (fallback) |
| react-native-keychain       | ^10.0.0 | Armazenamento seguro (tokens) |

## Forms e Validação

| Lib             | Versão  | Uso                   |
| --------------- | ------- | --------------------- |
| React Hook Form | ^7.66.1 | Gestão de formulários |
| Zod             | ^4.1.12 | Validação de schemas  |

## Internacionalização

| Lib           | Versão  | Uso            |
| ------------- | ------- | -------------- |
| i18next       | ^25.6.3 | Framework i18n |
| react-i18next | ^16.3.5 | React bindings |

## HTTP e Rede

| Lib                             | Versão  | Uso                        |
| ------------------------------- | ------- | -------------------------- |
| Axios                           | ^1.13.2 | Cliente HTTP (API Fastify) |
| @react-native-community/netinfo | ^11.4.1 | Monitorização de rede      |

## Outras

| Lib                        | Versão    | Uso                          |
| -------------------------- | --------- | ---------------------------- |
| date-fns                   | ^4.1.0    | Manipulação de datas         |
| react-native-image-picker  | ^8.2.1    | Seleção de imagens           |
| react-native-permissions   | ^5.4.4    | Gestão de permissões         |
| react-native-version-check | ^3.5.0    | Verificação de actualizações |
| react-native-calendars     | ^1.1313.0 | Calendários                  |

## Expo SDK Utilizado

| Plugin                                | Uso                                      |
| ------------------------------------- | ---------------------------------------- |
| `expo-build-properties`               | Configuração iOS (useFrameworks: static) |
| `@react-native-firebase/app` (plugin) | Setup nativo Firebase                    |
| `expo-maps` (plugin)                  | Google Maps API Key injection            |

---

**Anterior**: [02 — Estrutura de Pastas](02-project-structure.md) | **Próximo**: [04 — Setup Local](04-setup-local.md)
