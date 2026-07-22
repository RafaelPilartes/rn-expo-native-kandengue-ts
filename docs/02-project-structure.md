# Estrutura de Pastas — App Passageiro

## Árvore Completa

```
rn-expo_native-kandengue-ts/
│
├── android/                    # Projecto Android nativo (gerado pelo prebuild)
├── firebase/                   # Ficheiros de configuração Firebase (gitignored)
│   ├── google-services.json    # Android
│   └── GoogleService-Info.plist # iOS
├── assets/                     # Ícones, splash screen, imagens globais
├── plugins/                    # Expo config plugins customizados
│
├── src/
│   ├── App.tsx                  # Componente raiz da aplicação
│   │
│   ├── core/                    # ★ Domain Layer — entidades e contratos puros
│   │   ├── entities/           # Modelos de domínio (Ride, User, Driver, ...)
│   │   └── interfaces/         # Contratos TypeScript (IRideRepository, ...)
│   │
│   ├── domain/                  # Use Cases — orquestração de lógica de negócio
│   │   └── usecases/
│   │       ├── ride/
│   │       └── user/
│   │
│   ├── modules/                 # Módulos de integração externa
│   │   └── Api/
│   │       ├── firebase/       # Implementação DAO via Firebase SDK
│   │       ├── rest/           # Implementação DAO via Axios (API Fastify)
│   │       └── index.ts        # Factory: selecciona firebase ou rest
│   │
│   ├── services/                # Serviços de hardware e APIs nativas
│   │   ├── location/           # expo-location (tracking GPS)
│   │   ├── google/             # Google Maps / Places API
│   │   ├── notifications/      # FCM token registration + handlers
│   │   ├── permissions/        # Gestão de permissões (location, camera, ...)
│   │   ├── audio/              # Áudio in-app
│   │   └── picker/             # Selecção de imagens
│   │
│   ├── viewModels/              # ★ ViewModel Layer (MVVM)
│   │   ├── AuthViewModel.ts
│   │   ├── RideViewModel.ts
│   │   ├── LocationViewModel.ts
│   │   └── ProfileViewModel.ts
│   │
│   ├── screens/                 # Telas da aplicação (View Layer — só UI)
│   │   ├── Auth/               # Login, Registo, Recuperação de senha
│   │   ├── Main/               # Home, perfil, histórico
│   │   └── Rides/              # Mapa de pedido, corrida activa, summary
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                 # Botões, inputs, alertas base
│   │   ├── map/                # Marcadores, polylines, overlays
│   │   └── modals/             # Modais customizados
│   │
│   ├── context/                 # React Context API (estado de UI)
│   │   ├── AlertContext.tsx
│   │   ├── LocationContext.tsx
│   │   └── UserRidesContext.tsx
│   │
│   ├── providers/               # Providers globais que envolvem a App
│   │   ├── AppProvider.tsx
│   │   ├── NetworkProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── MapProvider.tsx
│   │
│   ├── routers/                 # Configuração de navegação (React Navigation)
│   │   ├── AuthRouter.tsx
│   │   ├── MainRouter.tsx
│   │   └── RootRouter.tsx
│   │
│   ├── storage/                 # Persistência local
│   │   ├── store/              # Zustand stores
│   │   └── storageManager.ts   # MMKV wrapper
│   │
│   ├── hooks/                   # Custom hooks reutilizáveis
│   ├── helpers/                 # Funções auxiliares puras
│   ├── utils/                   # Utilitários gerais
│   ├── constants/               # Constantes da aplicação
│   ├── config/                  # Configurações (firebase, env, ...)
│   ├── data/                    # Dados estáticos e mocks
│   ├── types/                   # TypeScript types e enums
│   ├── interfaces/              # Interfaces adicionais (legacy)
│   ├── i18n/                    # Configuração do i18next
│   ├── locales/                 # Ficheiros de tradução
│   │   ├── pt/                 # Português
│   │   └── en/                 # Inglês
│   └── styles/                  # Estilos globais (global.css para NativeWind)
│
├── app.json                     # Configuração Expo (bundle ID, permissões, plugins)
├── eas.json                     # Configuração EAS Build (dev, preview, prod)
├── babel.config.js              # Configuração Babel (NativeWind, paths)
├── metro.config.js              # Configuração Metro bundler
├── tailwind.config.js           # Configuração NativeWind/Tailwind
├── tsconfig.json                # Configuração TypeScript
└── package.json                 # Dependências e scripts
```

## Convenções por Pasta

| Pasta          | Deve conter                      | Não deve conter           |
| -------------- | -------------------------------- | ------------------------- |
| `core/`        | Entities e interfaces puras      | Código com side effects   |
| `domain/`      | Use cases e regras de negócio    | Código de UI ou framework |
| `modules/Api/` | DAOs (Firebase e REST)           | Lógica de negócio         |
| `services/`    | Acesso a hardware e APIs nativas | Lógica de UI              |
| `viewModels/`  | Estado + lógica de apresentação  | Código de renderização    |
| `screens/`     | Apenas composição de componentes | Lógica de negócio         |
| `components/`  | Componentes reutilizáveis        | Estado global             |
| `context/`     | Contextos de UI localizada       | Chamadas de API           |
| `providers/`   | Wrappers de infraestrutura       | Lógica de features        |

---

**Anterior**: [01 — Arquitectura](01-architecture.md) | **Próximo**: [03 — Tech Stack](03-tech-stack.md)
