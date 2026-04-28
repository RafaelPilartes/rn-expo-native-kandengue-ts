# Troubleshooting — App Passageiro

## Problemas de Build

### ❌ `Unable to resolve module '@/...'`

```bash
# Limpar cache do Metro
npx expo start --clear

# Se persistir, limpar node_modules
rm -rf node_modules
npm install
npx expo start --clear
```

### ❌ Build iOS falha com Firebase

Verificar `expo-build-properties` no `app.json`:

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

Depois, regenerar código nativo:

```bash
npx expo prebuild --clean
cd ios && bundle exec pod install && cd ..
```

### ❌ `functions/lib/index.js not found` (emuladores)

Não se aplica ao app mobile. Este erro é do backend.

---

## Problemas de Firebase

### ❌ Firebase não inicializa

1. Verificar se `google-services.json` está em `firebase/google-services.json`
2. Verificar se o `bundle ID` no ficheiro corresponde ao de `app.json`
3. Executar `npx expo prebuild` após adicionar o ficheiro

### ❌ FCM token não é registado

1. Verificar se as permissões de notificação foram concedidas
2. Em iOS, o simulador **não suporta FCM** — testar em dispositivo físico
3. Verificar se `@react-native-firebase/messaging` está na lista de plugins do `app.json`

### ❌ Firestore retorna `permission-denied`

1. Verificar as Firestore Security Rules no Firebase Console
2. Confirmar que o utilizador está autenticado (`auth.currentUser !== null`)
3. Verificar se o `uid` corresponde ao documento que está a tentar aceder

---

## Problemas de Localização

### ❌ Localização não funciona

1. Verificar permissões concedidas nas definições do dispositivo
2. Confirmar que `expo-location` e `expo-task-manager` estão instalados
3. Executar `npx expo prebuild` após adicionar permissões ao `app.json`

### ❌ Mapa não carrega (expo-maps)

1. Verificar Google Maps API Key no `app.json`
2. Confirmar que as APIs estão activas no Google Cloud Console:
   - Maps SDK for Android / iOS
   - Places API
3. Verificar que a API Key não tem restrições de bundle ID erradas

---

## Problemas de Navegação

### ❌ `Couldn't find a navigation context`

O componente está fora do `NavigationContainer`. Verificar a estrutura de providers em `App.tsx`.

### ❌ Deep link de notificação não navega

1. Confirmar que o `linking` está configurado no `NavigationContainer`
2. Verificar se o `rideId` no payload da notificação é válido

---

## Outros

### ❌ `MMKV` crash no desenvolvimento

O MMKV não funciona no Expo Go. Requer build nativo (development build via EAS).

### ❌ Imagem não carrega do Firebase Storage

1. Verificar as Storage Security Rules
2. Confirmar que o URL não expirou
3. Para URLs permanentes, usar `getDownloadURL()` após upload

---

**Anterior**: [10 — Padrões de Código](10-code-standards.md) | **Próximo**: [12 — Roadmap](12-roadmap.md)
