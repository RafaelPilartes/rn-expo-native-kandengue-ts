# Arquitectura — App Passageiro

## Padrão Arquitectural

O app do passageiro segue **Clean Architecture combinada com MVVM**, com os **Princípios SOLID** aplicados em toda a codebase.

```
┌────────────────────────────────────────┐
│           View Layer                   │
│   Screens/ + Components/               │
│   (apenas apresentação visual)         │
├────────────────────────────────────────┤
│         ViewModel Layer                │
│   viewModels/ (Zustand + React Query)  │
│   (estado + lógica de apresentação)    │
├────────────────────────────────────────┤
│          Domain Layer                  │
│   domain/usecases/                     │
│   (orquestração de regras de negócio)  │
├────────────────────────────────────────┤
│     Repository / Module Layer          │
│   modules/Api/ (firebase/ + rest/)     │
│   (abstracção de fonte de dados)       │
├────────────────────────────────────────┤
│           Core Layer                   │
│   core/entities/ + core/interfaces/   │
│   (domínio puro, sem dependências)     │
└────────────────────────────────────────┘
```

## Fluxo de Dados

```
Screen
  │  chama hook do ViewModel
  ▼
ViewModel (useXxxViewModel)
  │  usa React Query para data fetching
  │  usa Zustand para estado global
  ▼
Use Case (domain/usecases/)
  │  orquestra regras de negócio
  ▼
Repository (modules/Api/index.ts)
  │  firebase/  →  Firestore SDK
  │  rest/      →  Axios → API Fastify
  ▼
Firebase / API Fastify
```

## Gestão de Estado

| Ferramenta              | Responsabilidade                                     |
| ----------------------- | ---------------------------------------------------- |
| **Zustand**             | Estado global persistido (user, auth, preferências)  |
| **React Query**         | Server state (corridas, histórico, dados remotos)    |
| **Context API**         | Estado de UI localizado (alertas, localização, tema) |
| **useState/useReducer** | Estado local de componentes                          |

## Providers Globais

```
AppProvider
  └── NetworkProvider        ← Monitorização de conexão
        └── ThemeProvider    ← Dark/Light mode
              └── MapProvider  ← Estado do mapa (expo-maps)
                    └── App   ← Navegação + Screens
```

## Sistema de Localização

Três modos de tracking, seleccionáveis dinamicamente:

| Modo      | Frequência            | Quando                     |
| --------- | --------------------- | -------------------------- |
| `OFFLINE` | Nenhum                | Utilizador não autenticado |
| `PASSIVE` | Baixa (cidade/região) | App em idle, sem corrida   |
| `RIDE`    | Alta (a cada ~5s)     | Corrida activa             |

O `LocationProvider` centraliza permissões e controlo do modo activo. O `expo-task-manager` garante tracking mesmo com o app em background.

## Comunicação em Tempo Real

```
Firestore Listener (rides/{rideId})
  → useRideSummary hook detecta mudanças de status
  → ViewModel actualiza estado (Zustand)
  → Screen re-renderiza com novos dados

Firestore Listener (rideTracking/{rideId})
  → useDriverRealtimeLocation hook
  → Posição do motorista → marcador no mapa
  → Polyline trimming (remove segmento percorrido)
  → Rotação do ícone baseada em heading
```

## Módulo Api/ — Padrão de Permuta

```
modules/Api/
  firebase/
    ride.firebase.ts      ← queries Firestore
    user.firebase.ts
    driver.firebase.ts
  rest/
    ride.rest.ts          ← chamadas Axios para API Fastify
    user.rest.ts
  index.ts                ← factory: selecciona firebase ou rest
```

---

**Anterior**: [00 — Visão Geral](00-overview.md) | **Próximo**: [02 — Estrutura de Pastas](02-project-structure.md)
