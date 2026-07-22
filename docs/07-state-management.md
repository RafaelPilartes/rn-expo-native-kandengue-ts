# Gestão de Estado — App Passageiro

## Camadas de Estado

O app usa três mecanismos complementares, cada um com responsabilidades distintas:

```
┌──────────────────────────────────────────┐
│  Zustand (estado global persistido)      │
│  Auth, user profile, preferências        │
├──────────────────────────────────────────┤
│  React Query (server state)              │
│  Corridas, histórico, dados remotos      │
├──────────────────────────────────────────┤
│  Context API (estado de UI)              │
│  Alertas, localização, tema              │
├──────────────────────────────────────────┤
│  useState / useReducer (estado local)    │
│  Formulários, UI de componente           │
└──────────────────────────────────────────┘
```

---

## Zustand — Stores

### AuthStore

```typescript
// storage/store/auth.store.ts
interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}
```

### RideStore

```typescript
// storage/store/ride.store.ts
interface RideStore {
  activeRide: Ride | null
  rideStatus: RideStatus | null
  driverLocation: LatLng | null
  setActiveRide: (ride: Ride | null) => void
  setDriverLocation: (loc: LatLng) => void
}
```

---

## React Query — Convenções

```typescript
// Padrão de query key (array)
queryKey: ['rides', passengerId] // lista de corridas
queryKey: ['ride', rideId] // corrida específica
queryKey: ['driver', driverId] // perfil do motorista

// Exemplo de uso num ViewModel:
const { data: rides, isLoading } = useQuery({
  queryKey: ['rides', user?.uid],
  queryFn: () => RideRepository.getByPassengerId(user!.uid),
  enabled: !!user?.uid,
  staleTime: 30_000 // 30 segundos antes de refetch
})
```

---

## Context API — Contextos Activos

| Context            | Provider        | O que gere                                   |
| ------------------ | --------------- | -------------------------------------------- |
| `AlertContext`     | `AppProvider`   | Sistema de alertas in-app                    |
| `LocationContext`  | `AppProvider`   | Localização do passageiro + modo de tracking |
| `UserRidesContext` | `AppProvider`   | Listener da corrida activa                   |
| `ThemeContext`     | `ThemeProvider` | Dark/Light mode                              |

### LocationContext

```typescript
interface LocationContextType {
  trackingMode: TrackingMode // OFFLINE | PASSIVE | RIDE
  currentLocation: LatLng | null
  setTrackingMode: (mode: TrackingMode) => void
}
```

---

## Providers — Ordem de Inicialização

```tsx
// src/App.tsx
<AppProvider>
  {' '}
  {/* Network + Alert + Location + UserRides */}
  <ThemeProvider>
    {' '}
    {/* Dark/Light mode */}
    <MapProvider>
      {' '}
      {/* expo-maps instance */}
      <NavigationContainer>
        <RootRouter />
      </NavigationContainer>
    </MapProvider>
  </ThemeProvider>
</AppProvider>
```

---

## Padrão de ViewModel

```typescript
// viewModels/RideViewModel.ts
export function useRideViewModel() {
  const { user } = useAuthStore()
  const rideStore = useRideStore()

  // Server state
  const { data: activeRide } = useQuery({
    queryKey: ['ride', 'active', user?.uid],
    queryFn: () => RideRepository.getActiveByPassengerId(user!.uid),
    enabled: !!user?.uid
  })

  // Actions
  const { mutate: requestRide } = useMutation({
    mutationFn: (params: RequestRideParams) => RideRepository.create(params),
    onSuccess: ride => rideStore.setActiveRide(ride)
  })

  return { activeRide, requestRide }
}
```

---

**Anterior**: [06 — Mapas e Localização](06-maps-location.md) | **Próximo**: [08 — Navegação](08-navigation.md)
