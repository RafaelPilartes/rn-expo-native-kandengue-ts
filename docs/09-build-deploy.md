# Build e Deploy — App Passageiro

## Estratégia de Build

O app usa **EAS (Expo Application Services)** para builds geridos na cloud, sem necessidade de macOS local para builds iOS.

## Perfis de Build (`eas.json`)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "apk" },
      "ios": { "simulator": false }
    }
  }
}
```

## Comandos de Build

### Android

```bash
# Development build (com dev client)
eas build --platform android --profile development

# Preview (APK directo)
eas build --platform android --profile preview

# Produção (Google Play)
eas build --platform android --profile production
```

### iOS

```bash
# Development (TestFlight interno)
eas build --platform ios --profile development

# Preview (TestFlight)
eas build --platform ios --profile preview

# Produção (App Store)
eas build --platform ios --profile production
```

## Submeter para Stores

```bash
# Google Play
eas submit --platform android

# App Store
eas submit --platform ios
```

## Build Local (alternativa)

```bash
# Gerar código nativo antes do build local
npx expo prebuild --clean

# Android
npx expo run:android --variant release

# iOS (macOS apenas)
npx expo run:ios --configuration Release
```

## Variáveis de Ambiente no EAS

Variáveis sensíveis podem ser configuradas no EAS:

```bash
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "..."
```

## Checklist de Deploy

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` sem warnings críticos
- [ ] `app.json` com versão correcta (`version` + `buildNumber`/`versionCode`)
- [ ] Firebase config files presentes (`google-services.json`, `GoogleService-Info.plist`)
- [ ] Google Maps API Key válida e com bundle ID restrito
- [ ] `eas build` concluído sem erros
- [ ] Teste em dispositivo físico (iOS + Android)
- [ ] FCM token registado após login
- [ ] Permissões de localização a funcionar

---

**Anterior**: [08 — Navegação](08-navigation.md) | **Próximo**: [10 — Padrões de Código](10-code-standards.md)
