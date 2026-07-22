# Firebase — App Passageiro

## Serviços Utilizados

| Serviço                      | Uso no App                                |
| ---------------------------- | ----------------------------------------- |
| **Firebase Auth**            | Login/logout, gestão de sessão            |
| **Firestore**                | Corridas em tempo real, perfil, histórico |
| **Firebase Storage**         | Upload de foto de perfil                  |
| **Firebase Cloud Messaging** | Notificações push (corridas, updates)     |

---

## Configuração de Ficheiros Nativos

### Android

O ficheiro `google-services.json` deve estar em:

```
firebase/
  google-services.json   ← Android
```

O plugin `@react-native-firebase/app` no `app.json` injeta-o automaticamente no build:

```json
"plugins": [
  "@react-native-firebase/app",
  "@react-native-firebase/auth",
  ...
]
```

### iOS

O ficheiro `GoogleService-Info.plist` deve estar em:

```
firebase/
  GoogleService-Info.plist   ← iOS
```

Requer `useFrameworks: "static"` no plugin `expo-build-properties`:

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

---

## Coleções Firestore Relevantes

### `users/{uid}` → `UserInterface`

```typescript
// src/interfaces/IUser.ts
interface UserInterface {
  id?: string
  entity_code?: string
  photo?: string
  name: string
  email: string
  phone: string
  password?: string
  status: UserStatus // 'active' | 'inactive' | 'pending' | 'banned'
  availability: UserAvailability // 'available' | 'on_mission'
  current_location?: LocationType
  email_verified?: boolean
  phone_verified?: boolean
  created_at?: Date
  updated_at?: Date
  last_login?: Date
  firebase_uid?: string
  location?: LocationType
  last_location_update?: Date
}
```

### `rides/{rideId}` → `RideInterface`

```typescript
// src/interfaces/IRide.ts
interface RideInterface {
  id?: string
  user: UserInterface
  driver?: DriverInterface
  pickup: GeoLocationType // { description, place_id, name?, latitude, longitude }
  dropoff: GeoLocationType
  status: RideStatusType // ver abaixo
  fare: RideFareInterface
  distance: number
  duration: number
  type: RideType // 'car' | 'motorcycle' | 'bicycle' | 'delivery'
  otp_code?: string
  cancel_reason?: string
  details?: RideDetailsType // para deliveries: receiver, item, payment_method
  proof_pickup_photo?: string
  proof_dropoff_photo?: string
  waiting_start_at?: Date
  waiting_end_at?: Date
  completed_at?: Date
  canceled_at?: Date
  created_at?: Date
  updated_at?: Date
}

// Estados do ride (RideStatusType)
type RideStatusType =
  | 'idle' // aguardando motorista aceitar
  | 'pending' // aceitando / aguardando
  | 'driver_on_the_way' // motorista a caminho do pickup
  | 'arrived_pickup' // motorista chegou ao pickup
  | 'picked_up' // recolheu / iniciou corrida
  | 'arrived_dropoff' // chegou ao destino
  | 'completed' // concluído
  | 'canceled' // cancelado
```

### `rides/{rideId}.fare` → `RideFareInterface`

```typescript
// src/interfaces/IRideFare.ts
interface RideFareInterface {
  total: number
  breakdown: {
    base_fare: number
    distance_cost: number
    wait_cost: number
    insurance_fee: number
    discount?: number
  }
  payouts: {
    driver_earnings: number
    company_earnings: number
    pension_fund: number
  }
}
```

### `rideTracking/{rideId}` → `RideTrackingsInterface`

```typescript
// src/interfaces/IRideTracking.ts
interface RideTrackingsInterface {
  id: string
  ride_id: string
  path: LiveLocationType[] // historial completo de localizações
  created_at?: Date
}

// src/types/ride.ts
type LiveLocationType = {
  latitude: number
  longitude: number
  timestamp: Date
}
```

### `drivers/{uid}` → `DriverInterface`

```typescript
// src/interfaces/IDriver.ts
interface DriverInterface extends UserInterface {
  vehicle?: VehicleInterface
  rating?: number
  is_online: boolean
  is_invisible?: boolean
  current_location?: LocationType // { latitude, longitude, heading?, speed?, accuracy? }
}

// src/interfaces/IVehicle.ts
interface VehicleInterface {
  id: string
  user_id: string
  type: VehicleType // 'car' | 'motorcycle' | 'bicycle' | 'truck' | 'scooter'
  brand: string
  model: string
  color: string
  plate: string
  status: VehicleStatusEnumType // 'under_analysis' | 'validated' | 'rejected'
  isDefault?: boolean
  image?: string
  created_at?: Date
  updated_at?: Date
}
```

---

## Listeners Activos em Cada Contexto

| Ecrã/Contexto  | Colecção                      | Quando                                 |
| -------------- | ----------------------------- | -------------------------------------- |
| Home / Mapa    | `drivers` (nearby)            | Sempre autenticado                     |
| Corrida activa | `rides/{rideId}`              | Durante corrida                        |
| Corrida activa | `rideTracking/{rideId}`       | Durante corrida (posição do motorista) |
| Histórico      | `rides` (query por `user.id`) | Na abertura do ecrã                    |

---

## FCM — Notificações Push

### Registo do Token

```typescript
// notifications/notifications.service.ts
const token = await messaging().getToken()
await FirebaseRideRepository.registerFCMToken(uid, token)
// Guarda em: fcm_tokens/{uid}
```

### Tipos de Notificações Recebidas

| Tipo                 | Trigger               | Payload                  |
| -------------------- | --------------------- | ------------------------ |
| Motorista aceitou    | Cloud Function        | `{ rideId, driverName }` |
| Corrida iniciada     | Cloud Function        | `{ rideId }`             |
| Corrida terminada    | Cloud Function        | `{ rideId, fare.total }` |
| Pagamento confirmado | API Fastify (webhook) | `{ amount, txId }`       |

### Handler de Notificação em Background

```typescript
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage.data)
})
```

---

**Anterior**: [04 — Setup Local](04-setup-local.md) | **Próximo**: [06 — Mapas e Localização](06-maps-location.md)
