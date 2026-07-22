# Setup Local — App Passageiro

## Pré-requisitos

| Ferramenta         | Versão mínima | Download                                                             |
| ------------------ | ------------- | -------------------------------------------------------------------- |
| Node.js            | ≥ 18.x        | [nodejs.org](https://nodejs.org/)                                    |
| npm                | ≥ 9.x         | (incluído no Node.js)                                                |
| Git                | qualquer      | [git-scm.com](https://git-scm.com/)                                  |
| EAS CLI            | latest        | `npm install -g eas-cli`                                             |
| Java JDK (Android) | 11+           | Android Studio inclui                                                |
| Android Studio     | Hedgehog+     | [developer.android.com/studio](https://developer.android.com/studio) |
| Xcode (iOS)        | ≥ 14          | App Store (macOS apenas)                                             |

> ⚠️ iOS só pode ser desenvolvido/buildado em macOS.

---

## 1. Clonar e Instalar

```bash
git clone https://github.com/RafaelPilartes/rn-expo-native-kandengue-ts.git
cd rn-expo_native-kandengue-ts

npm install
```

---

## 2. Configurar Firebase

O app usa Firebase para auth, Firestore e FCM. Precisas dos ficheiros de configuração nativa:

1. Acede ao [Firebase Console](https://console.firebase.google.com/)
2. Selecciona o projecto Kandengue
3. **Android** → Descarrega `google-services.json` → coloca em `firebase/google-services.json`
4. **iOS** → Descarrega `GoogleService-Info.plist` → coloca em `firebase/GoogleService-Info.plist`

> ⚠️ Bundle ID do passageiro: `com.kandengueatrevido.ride` — deve corresponder ao registado no Firebase Console.

> ⚠️ Estes ficheiros **não estão versionados** (`.gitignore`). Obtém-nos com a equipa.

---

## 3. Configurar Google Maps

A API Key do Google Maps é necessária para geocoding, autocomplete e mapas.

Edita o `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TUA_API_KEY_ANDROID"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TUA_API_KEY_IOS"
      }
    }
  }
}
```

APIs necessárias no Google Cloud Console:

- Maps SDK for Android
- Maps SDK for iOS
- Places API
- Directions API

### Variáveis de Ambiente

Não te esqueças de configurar no `.env` ou nas properties do Expo:

| Variável            | Descrição                               | Onde configurar                                                                           |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| Google Maps API Key | Chave da API do Google Maps             | `app.json` → `android.config.googleMaps.apiKey` e `ios.config.googleMapsApiKey`           |
| Firebase Config     | Configurações do Firebase               | `./firebase/google-services.json` (Android) e `./firebase/GoogleService-Info.plist` (iOS) |
| EAS Project ID      | ID do projeto Expo Application Services | `app.json` → `extra.eas.projectId`                                                        |

---

## 4. Permissões Necessárias (app.json)

A aplicação requer permissões nativas para funcionar. Se as alterares, deves fazer novo prebuild.

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
  "NSLocationWhenInUseUsageDescription": "Permite usar o GPS para corridas.",
  "NSLocationAlwaysAndWhenInUseUsageDescription": "Permite usar GPS em background.",
  "NSLocationAlwaysUsageDescription": "Rastreio em background activo.",
  "NSCameraUsageDescription": "Para fotos de perfil."
}
```

---

## 5. Prebuild (Geração de Código Nativo)

O Expo Bare Workflow requer geração de código nativo antes do primeiro build:

```bash
npx expo prebuild
```

**Para iOS** (após prebuild):

```bash
cd ios
bundle install           # instala CocoaPods se necessário
bundle exec pod install
cd ..
```

> ⚠️ Este passo é necessário sempre que adicionas novos plugins nativos ao `app.json`.

---

## 5. Executar em Desenvolvimento

### Android

```bash
npm run android
# ou
npx expo run:android
```

### iOS (macOS apenas)

```bash
npm run ios
# ou
npx expo run:ios
```

### Limpar cache

```bash
npx expo start --clear
```

---

## 6. Scripts Disponíveis

| Comando            | Descrição                                     |
| ------------------ | --------------------------------------------- |
| `npm start`        | Inicia o servidor Metro                       |
| `npm run android`  | Build e lança no emulador/dispositivo Android |
| `npm run ios`      | Build e lança no simulador/dispositivo iOS    |
| `npm run web`      | Preview web (experimental)                    |
| `npm run lint`     | Verificação ESLint                            |
| `npx tsc --noEmit` | Verificação de tipos TypeScript               |

---

## Verificação

Após lançar o app, verifica:

- [ ] Ecrã de login visível (Firebase Auth iniciado)
- [ ] Login com email/password funciona
- [ ] Mapa carrega (Google Maps API Key válida)
- [ ] Permissões de localização solicitadas

---

**Anterior**: [03 — Tech Stack](03-tech-stack.md) | **Próximo**: [05 — Firebase](05-firebase.md)
