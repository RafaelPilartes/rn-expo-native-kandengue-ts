# rn-expo_native-kandengue-ts — App Passageiro

App móvel do passageiro para solicitar corridas, gerir carteira e comunicar com motoristas em tempo real.

---

## Stack e Versões

| Tecnologia                | Versão        |
| ------------------------- | ------------- |
| React Native              | 0.81.5        |
| Expo                      | ~54.0.25      |
| React                     | 19.1.0        |
| TypeScript                | ~5.9.2        |
| @react-native-firebase/\* | ^23.5.0       |
| NativeWind                | ^4.2.1        |
| TanStack React Query      | ^5.90.11      |
| Zustand                   | ^5.0.8        |
| React Navigation          | ^7.x          |
| Zod                       | ^4.1.12       |
| react-hook-form           | ^7.66.1       |
| expo-maps                 | ~0.12.10      |
| expo-location             | ~19.0.7       |
| @notifee/react-native     | ^9.1.8        |
| i18next + react-i18next   | ^25.x / ^16.x |

---

## Como Rodar Localmente

```bash
npm start              # expo start (QR code / dev menu)
npm run android        # expo run:android (requer emulador ou dispositivo)
npm run ios            # expo run:ios (requer macOS + Xcode)
```

> Firebase configurado via `firebase/google-services.json` (Android) e `firebase/GoogleService-Info.plist` (iOS) — não usa `.env`.

---

## Convenções

### Estrutura `src/`

```
src/
├── modules/Api/
│   ├── firebase/     # DAOs: *.dao.ts — acesso direto ao Firestore
│   └── rest/         # ApiDAO (axios) → API Fastify no Railway
├── screens/
│   ├── Auth/         # Login, registo, onboarding
│   ├── Main/         # Home, Notifications, Profile, History
│   ├── Rides/        # RideChoose, RideFlow, RideSummary, RideChat, RideFinished
│   └── MotoBoy/      # fluxo de candidatura a motorista
├── viewModels/       # lógica de negócio separada da UI (hooks por ecrã)
├── hooks/            # hooks reutilizáveis
├── context/          # React Context providers
├── providers/        # QueryClientProvider, NavigationProvider
├── routers/          # React Navigation stacks
├── services/         # serviços nativos (audio, location, notifications, permissions)
├── storage/          # MMKV / AsyncStorage wrappers
├── i18n/ + locales/  # internacionalização (pt/en)
├── domain/           # interfaces e tipos de domínio
├── constants/        # cores, tamanhos, strings
└── styles/           # estilos globais
```

- Componentes em PascalCase; ficheiros de hook em camelCase com prefixo `use`
- DAOs são classes singleton instanciadas no fundo do ficheiro
- Screens organizadas por fluxo (não por componente)

---

## Schema source-of-truth

`RideEntity`, `BreakdownType` e `UserInterface` (incluindo os campos de
promoção: `promotion_id`, `promotion_usage_id`, `driver_matched_at`,
`cancelled_by`, `gross_amount`, `completed_rides`, `last_completed_ride_at`)
estão **replicados manualmente** entre os 3 repos.

A fonte de verdade é o documento **`08 — Firestore Schema`**. Qualquer
alteração tem de ser propagada manualmente.

> ⚠️ A app passageira é responsável por escrever sempre
> `fare.breakdown.gross_amount` em todas as rides (com ou sem promo) — o
> trigger `onRideCompleted` usa este campo para o cálculo imutável.

---

## Conexão Firebase

Usa `@react-native-firebase` (SDK nativo — **não** o JS SDK web).

**Collections acedidas:**

| Collection                      | Uso                                          |
| ------------------------------- | -------------------------------------------- |
| `users`                         | perfil, documentos, notificações, fcm_tokens |
| `drivers`                       | info do motorista atribuído à corrida        |
| `rides`                         | criação e onSnapshot da corrida ativa        |
| `rideTrackings`                 | posição GPS do motorista em tempo real       |
| `rideRates`                     | tarifas para cálculo de preço                |
| `wallets`                       | saldo do passageiro                          |
| `topupRequests`                 | pedidos de carregamento via Unitel Money     |
| `transactions`                  | histórico de transações                      |
| `notifications`                 | notificações persistidas                     |
| `chats` + `chats/{id}/messages` | chat em tempo real com motorista             |
| `documents`                     | documentos de identidade do utilizador       |
| `vehicles`                      | informação do veículo do motorista           |
| `complaints`                    | reclamações após corrida                     |
| `admins`                        | verificação de role admin                    |

**Serviços Firebase:**

- Auth: login por telefone (OTP)
- Firestore: onSnapshot para corridas e tracking em tempo real
- Storage: upload de documentos e fotos de perfil
- Messaging (FCM): receber push notifications via `@notifee`

---

## Como se Conecta com as Outras Partes

- **API Fastify** (Railway): chamada via `ApiDAO` (axios) para wallet topup, registo FCM e envio de notificações
- **App Motorista**: partilha as mesmas collections `rides` e `rideTrackings` (comunicação via Firestore)
- **Painel Admin**: não há comunicação direta — o painel lê as mesmas collections
