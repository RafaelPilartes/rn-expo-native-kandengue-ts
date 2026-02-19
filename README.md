# Kandengue Atrevido 🚗

> Aplicação mobile de transporte de passageiros - Plataforma completa de mobilidade urbana para iOS e Android

Uma solução moderna de ride-sharing construída com React Native e Expo, oferecendo uma experiência fluida e segura para passageiros solicitarem corridas em tempo real.

---

## 📱 Visão Geral

**Kandengue Atrevido** é a aplicação para passageiros do ecossistema Kandengue, permitindo:

- 🗺️ **Rastreamento em tempo real** de motoristas e corridas
- 📍 **Geolocalização precisa** com suporte a background tracking
- 🔥 **Integração Firebase** para autenticação e dados em tempo real
- 🌐 **Suporte multilíngue** (Português e Inglês)
- 💳 **Sistema de pagamentos** integrado
- 📊 **Histórico de corridas** completo
- 🔔 **Notificações push** para atualizações de corrida
- 🎨 **Interface moderna** com design system customizado

---

## 🚀 Quick Start

### Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para Android)
- [Xcode](https://developer.apple.com/xcode/) (para iOS, apenas macOS)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/RafaelPilartes/rn-expo-native-kandengue-ts.git
cd RnNativeKandengueTs

# Instale as dependências
npm install

# Configure o Firebase
# 1. Adicione google-services.json em ./firebase/ (Android)
# 2. Adicione GoogleService-Info.plist em ./firebase/ (iOS)

# Execute o prebuild (necessário na primeira execução)
npx expo prebuild

# Inicie o servidor de desenvolvimento
npm start
```

### Executar no Dispositivo/Emulador

```bash
# Android
npm run android

# iOS (apenas macOS)
npm run ios

# Web (preview)
npm run web
```

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura limpa e modular** com separação clara de responsabilidades:

```
src/
├── components/        # Componentes reutilizáveis
│   ├── ui/           # Componentes de UI (CustomAlert, Buttons, etc.)
│   ├── map/          # Componentes relacionados ao mapa
│   └── modals/       # Modais customizados
├── screens/          # Telas da aplicação
│   ├── Auth/         # Fluxo de autenticação
│   ├── Main/         # Dashboard e navegação principal
│   └── Rides/        # Gestão de corridas
├── context/          # Context API (Location, Alert, UserRides)
├── providers/        # Provedores de contexto (Map, Network, Theme, App)
├── services/         # Serviços externos (APIs, Firebase)
│   ├── location/     # Serviços de geolocalização
│   ├── google/       # Google Maps API
│   └── permissions/  # Gestão de permissões
├── viewModels/       # Lógica de negócio (MVVM pattern)
├── core/             # Lógica central e utilitários
├── domain/           # Entidades e modelos de domínio
├── data/             # Repositórios e fontes de dados
├── interfaces/       # Interfaces e contratos TypeScript
├── types/            # Definições de tipos
├── hooks/            # Custom React Hooks
├── storage/          # Gestão de armazenamento local (MMKV)
├── routers/          # Configuração de navegação
├── constants/        # Constantes da aplicação
├── helpers/          # Funções auxiliares
├── utils/            # Utilitários gerais
├── locales/          # Arquivos de tradução (i18n)
└── styles/           # Estilos globais e temas
```

### Padrões Arquiteturais

| Padrão                 | Uso                                               |
| ---------------------- | ------------------------------------------------- |
| **MVVM**               | ViewModels gerenciam lógica de negócio            |
| **Context API**        | Gestão de estado global (Location, Alerts, Rides) |
| **Provider Pattern**   | Encapsulamento de lógica complexa                 |
| **Custom Hooks**       | Reutilização de lógica de componentes             |
| **Repository Pattern** | Abstração de fontes de dados                      |

---

## 🎯 Features Principais

### 1. Sistema de Localização

- **Rastreamento em tempo real** com `expo-location` e `expo-task-manager`
- **Três modos de tracking**:
  - `PASSIVE`: Atualização de cidade/região (baixa frequência)
  - `RIDE`: Rastreamento de alta precisão durante corrida ativa
  - `OFFLINE`: Nenhum rastreamento (usuário deslogado)
- **Background tracking** para corridas ativas mesmo com app em segundo plano
- **LocationProvider** centralizado para gestão de permissões e estado

### 2. Integração de Mapas

- **expo-maps** (substituiu react-native-maps)
- **MapProvider** para controle centralizado do mapa
- **Polyline** de rotas decodificadas com `@mapbox/polyline`
- **Markers customizados** para pickup, dropoff e motorista
- **Google Maps API** para geocoding e autocomplete

### 3. Sistema de Alertas Customizados

- **CustomAlert** com animações usando `react-native-reanimated`
- **4 tipos**: `success`, `error`, `warning`, `info`
- **AlertContext** para gestão centralizada
- Substituição completa do `Alert.alert` nativo

### 4. Firebase Integration

```json
{
  "@react-native-firebase/app": "^23.5.0",
  "@react-native-firebase/auth": "^23.5.0",
  "@react-native-firebase/firestore": "^23.5.0",
  "@react-native-firebase/messaging": "^23.5.0",
  "@react-native-firebase/storage": "^23.5.0"
}
```

- **Autenticação** completa (Email/Password, Social Login)
- **Firestore** para dados em tempo real
- **Push Notifications** via Firebase Cloud Messaging
- **Storage** para upload de imagens (perfil, documentos)

### 5. Internacionalização (i18n)

- **react-i18next** para suporte multilíngue
- Tradução dinâmica de toda a UI
- Persistência de preferência de idioma no `StorageManager`

### 6. Network Awareness

- **NetworkProvider** monitora status de conexão (`@react-native-community/netinfo`)
- **NetworkStatusBanner** exibe aviso quando offline
- Retry automático de requisições após reconexão

---

## 🛠️ Stack Tecnológica

### Core

- **React Native** `0.81.5` - Framework mobile
- **Expo** `~54.0.25` - Toolchain e SDK
- **TypeScript** `~5.9.2` - Type safety

### State Management

- **Zustand** `^5.0.8` - Estado global
- **Context API** - Contextos especializados
- **TanStack React Query** `^5.90.11` - Server state

### Navigation

- **React Navigation** `^7.1.22`
  - Native Stack Navigator
  - Bottom Tabs Navigator

### UI & Styling

- **NativeWind** `^4.2.1` - Tailwind CSS para React Native
- **React Native Reanimated** `~4.1.1` - Animações performáticas
- **Lucide React Native** `^0.555.0` - Ícones modernos
- **React Native Linear Gradient** `^2.8.3` - Gradientes

### Maps & Location

- **expo-maps** `~0.12.10` - Visualização de mapas
- **expo-location** `~19.0.7` - Geolocalização
- **expo-task-manager** `~14.0.9` - Background tasks
- **@mapbox/polyline** `^1.2.1` - Decode de rotas

### Firebase

- **@react-native-firebase/** suite `^23.5.0`
  - App, Auth, Firestore, Messaging, Storage

### Storage & Security

- **react-native-mmkv** `^4.0.1` - Storage ultra-rápido
- **@react-native-async-storage/async-storage** `2.2.0` - Fallback storage
- **react-native-keychain** `^10.0.0` - Secure storage

### Forms & Validation

- **react-hook-form** `^7.66.1` - Gestão de formulários
- **zod** `^4.1.12` - Schema validation

### Additional

- **axios** `^1.13.2` - HTTP client
- **date-fns** `^4.1.0` - Manipulação de datas
- **react-native-calendars** `^1.1313.0` - Calendários
- **react-native-image-picker** `^8.2.1` - Seleção de imagens
- **react-native-permissions** `^5.4.4` - Gestão de permissões
- **react-native-version-check** `^3.5.0` - Verificação de atualizações

---

## 📐 Design System

### Cores Principais

```javascript
colors: {
  primary: {
    200: '#e0212d', // Vermelho principal
    500: '#a81922', // Vermelho escuro
  },
  accent: '#F13024',
  baseText: '#022147',
  baseDark: '#000F21',
}
```

### Espaçamento

```javascript
padding: {
  containerXY: '24px',
  'container-sm': '10px',
  'container-md': '15px',
  'container-lg': '25px'
}
```

### Dark Mode

- Suporte completo via `ThemeProvider`
- Classes Tailwind: `dark:bg-baseBgDark`, `dark:text-baseTxtLight`

---

## 🔐 Configuração

### Variáveis de Ambiente

Não se esqueça de configurar:

| Variável            | Descrição                               | Onde configurar                                                                           |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| Google Maps API Key | Chave da API do Google Maps             | `app.json` → `android.config.googleMaps.apiKey` e `ios.config.googleMapsApiKey`           |
| Firebase Config     | Configurações do Firebase               | `./firebase/google-services.json` (Android) e `./firebase/GoogleService-Info.plist` (iOS) |
| EAS Project ID      | ID do projeto Expo Application Services | `app.json` → `extra.eas.projectId`                                                        |

### Permissões Necessárias

**Android (`app.json`):**

```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION",
  "ACCESS_BACKGROUND_LOCATION",
  "FOREGROUND_SERVICE",
  "FOREGROUND_SERVICE_LOCATION",
  "CAMERA",
  "POST_NOTIFICATIONS"
]
```

**iOS (`app.json`):**

```json
"infoPlist": {
  "NSLocationWhenInUseUsageDescription": "...",
  "NSLocationAlwaysAndWhenInUseUsageDescription": "...",
  "NSLocationAlwaysUsageDescription": "...",
  "NSCameraUsageDescription": "..."
}
```

---

## 🧪 Testing

```bash
# Executar testes (quando implementados)
npm test

# Executar linter
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

## 📦 Build & Deploy

### Development Build (EAS)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Build para Android
eas build --platform android --profile development

# Build para iOS
eas build --platform ios --profile development
```

### Production Build

```bash
# Android APK/AAB
eas build --platform android --profile production

# iOS IPA
eas build --platform ios --profile production
```

### Configuração de Build (`eas.json`)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## 📚 Estrutura de Dados

### Principais Entidades

| Entidade   | Descrição                                  |
| ---------- | ------------------------------------------ |
| `User`     | Dados do passageiro (perfil, preferências) |
| `Ride`     | Corrida (status, localização, preço)       |
| `Driver`   | Informações do motorista                   |
| `Location` | Coordenadas GPS (lat, lng, timestamp)      |
| `Payment`  | Métodos e histórico de pagamentos          |

### Tipos de Tracking (`src/types/trackingTypes.ts`)

```typescript
type TrackingMode = 'PASSIVE' | 'RIDE' | 'OFFLINE'

// PASSIVE: Determinar cidade/região atual (baixa frequência)
// RIDE: Rastreamento de alta frequência durante corrida ativa
// OFFLINE: Sem rastreamento (usuário deslogado)
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Código

- Use **TypeScript** para type safety
- Siga o padrão **ESLint** configurado
- Escreva **código limpo e autoexplicativo**
- Documente funções complexas com **JSDoc/TSDoc**
- Use **Conventional Commits** para mensagens de commit

---

## 🐛 Troubleshooting

### Problema: Erro "Couldn't find a navigation context"

**Solução:** Certifique-se de que o componente está renderizado dentro do `NavigationContainer`.

### Problema: Build iOS falha com Firebase

**Solução:** Verifique se `useFrameworks: "static"` está configurado em `expo-build-properties`:

```json
[
  "expo-build-properties",
  {
    "ios": {
      "useFrameworks": "static",
      "buildReactNativeFromSource": true
    }
  }
]
```

### Problema: Localização não funciona

**Solução:**

1. Verifique se as permissões estão configuradas em `app.json`
2. Execute `npx expo prebuild` para regenerar código nativo
3. Confirme que as permissões foram concedidas no dispositivo

### Problema: Metro bundler não inicia

**Solução:**

```bash
# Limpe o cache
npx expo start --clear

# Ou
rm -rf node_modules
npm install
npx expo start
```

---

## 📄 Licença

Este projeto é proprietário e pertence à **Kandengue**.

---

## 📞 Suporte

- **Repositório:** [RafaelPilartes/rn-expo-native-kandengue-ts](https://github.com/RafaelPilartes/rn-expo-native-kandengue-ts)
- **Issues:** Para reportar bugs ou sugerir features
- **Email:** suporte@kandengue.com

---

## 🙏 Agradecimentos

- [Expo Team](https://expo.dev/) - Pela incrível plataforma de desenvolvimento
- [React Native Community](https://reactnative.dev/) - Pelo framework e bibliotecas
- [Firebase](https://firebase.google.com/) - Pela infraestrutura backend

---

**Nota:** Certifique-se de nunca commitar suas chaves de API ou arquivos de configuração sensíveis (Firebase) no repositório. Use `.gitignore` adequadamente.
