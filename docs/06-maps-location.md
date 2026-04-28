# Mapas e Localização — App Passageiro

## Bibliotecas de Mapas

| Lib                 | Uso                                                              |
| ------------------- | ---------------------------------------------------------------- |
| `expo-maps`         | Renderização do mapa (Apple Maps no iOS, Google Maps no Android) |
| `expo-location`     | Leitura de coordenadas GPS do passageiro                         |
| `expo-task-manager` | Background tracking (modo RIDE)                                  |
| `@mapbox/polyline`  | Decodificação de rotas encoded (Google Directions API)           |

---

## MapProvider — Controlo Central do Mapa

O `MapProvider` centraliza o estado e controlo do mapa:

```
MapProvider
  ├── ref para instância do mapa (expo-maps)
  ├── animateCamera() — mover câmara suavemente
  ├── fitBounds() — ajustar zoom para mostrar origem + destino
  └── estado: { region, isMapReady }
```

---

## Sistema de Localização — Três Modos

```typescript
type TrackingMode = 'OFFLINE' | 'PASSIVE' | 'RIDE'
```

| Modo      | Frequência     | Trigger                    | Uso de bateria |
| --------- | -------------- | -------------------------- | -------------- |
| `OFFLINE` | Nenhum         | Utilizador não autenticado | Zero           |
| `PASSIVE` | Baixa (cidade) | App idle                   | Mínimo         |
| `RIDE`    | Alta (~5s)     | Corrida activa             | Moderado       |

### Transição de Modos

```
Login → PASSIVE
Corrida aceite → RIDE (background task iniciada)
Corrida terminada → PASSIVE (background task parada)
Logout → OFFLINE
```

---

## Rastreamento do Motorista em Tempo Real

O passageiro acompanha o motorista via listener Firestore:

```typescript
// hooks/useDriverRealtimeLocation.ts
const unsubscribe = firestore()
  .collection('rideTracking')
  .doc(rideId)
  .onSnapshot(snap => {
    const data = snap.data()
    setDriverLocation(data.location)
    setDriverHeading(data.heading)
    setDriverPath(data.path)
  })
```

### Polyline Trimming

O mapa mostra apenas o segmento **não percorrido** da rota:

```typescript
// Quando o motorista avança, remove coordenadas já passadas
function trimPolyline(fullRoute: LatLng[], driverLocation: LatLng): LatLng[] {
  const closestIndex = findClosestPointIndex(fullRoute, driverLocation)
  return fullRoute.slice(closestIndex) // apenas o restante
}
```

### Rotação do Ícone do Motorista

O marcador do motorista roda baseado no `heading` (direcção de deslocamento):

```tsx
<Marker
  coordinate={driverLocation}
  rotation={driverHeading} // graus: 0=Norte, 90=Leste, etc.
>
  <DriverCarIcon />
</Marker>
```

---

## Markers no Mapa

| Marker                | Cor / Ícone                  | Condição                   |
| --------------------- | ---------------------------- | -------------------------- |
| Posição do utilizador | Azul (ponto)                 | Sempre (PASSIVE/RIDE)      |
| Motorista             | Ícone de carro (com rotação) | Corrida aceite/activa      |
| Pickup (origem)       | Verde                        | Corrida aceite/in_progress |
| Destino               | Vermelho                     | Sempre durante corrida     |

---

## Geocoding e Autocomplete

O passageiro usa o Google Places API para pesquisa de endereços:

```typescript
// services/google/places.service.ts
const results = await fetchPlaceSuggestions(query)
// → Google Places Autocomplete API
// → converte para { placeId, description, lat, lng }
```

---

**Anterior**: [05 — Firebase](05-firebase.md) | **Próximo**: [07 — Gestão de Estado](07-state-management.md)
