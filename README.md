# Kandengue Atrevido — App Passageiro

**Aplicação mobile de transporte de passageiros** para a plataforma Kandengue.

Uma solução moderna de ride-sharing construída com React Native e Expo, oferecendo uma experiência fluida e segura para passageiros solicitarem corridas em tempo real, comunicarem com o motorista e pagarem directamente de forma segura.

---

## Stack Principal

| Camada       | Tecnologia                                |
| ------------ | ----------------------------------------- |
| Runtime      | React Native 0.81.5 + Expo ~54.0.25       |
| Linguagem    | TypeScript 5.9.2 (strict mode)            |
| Estado       | Zustand + TanStack React Query            |
| UI / Estilos | NativeWind + Tailwind CSS                 |
| Animações    | React Native Reanimated                   |
| Mapas / GPS  | expo-maps + expo-location + task-manager  |
| Backend      | Firebase (Auth, Firestore, FCM, Storage)  |
| Navegação    | React Navigation 7                        |
| Storage      | react-native-mmkv + react-native-keychain |
| Formulários  | react-hook-form + Zod                     |

---

## Arquitetura de Alto Nível

O projeto segue uma arquitetura limpa focada no padrão **MVVM (Model-View-ViewModel)**.

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  View (Screen)  │───▶│  ViewModel       │───▶│  Repository      │
│  (UI Components)│◀───│  (React Query)   │◀───│  (API/Firebase)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                              ▲
                              │
                       ┌──────────────┐
                       │ Context API /│
                       │ Zustand Store│
                       └──────────────┘
```

---

## Quick Start

### Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9
- **EAS CLI** (`npm install -g eas-cli`)
- Android Studio ou Xcode (apenas macOS)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/RafaelPilartes/rn-expo-native-kandengue-ts.git
cd rn-expo_native-kandengue-ts

# Instalar dependências
npm install
```

### Configurar variáveis de ambiente e Firebase

1. Adiciona `google-services.json` em `firebase/` (Android).
2. Adiciona `GoogleService-Info.plist` em `firebase/` (iOS).
3. Configura as chaves do Google Maps no ficheiro `app.json`.

> Ver [docs/04-setup-local.md](docs/04-setup-local.md) para detalhes exatos sobre permissões e variáveis.

### Executar localmente

```bash
# Executar prebuild (obrigatório para gerar código nativo)
npx expo prebuild

# Iniciar servidor e lançar na plataforma
npm run android
# ou
npm run ios
```

---

## Comandos Principais

| Comando             | Descrição                                                    |
| ------------------- | ------------------------------------------------------------ |
| `npm start`         | Inicia o servidor Metro                                      |
| `npm run android`   | Build e lança no emulador/dispositivo Android                |
| `npm run ios`       | Build e lança no simulador/dispositivo iOS                   |
| `npm run lint`      | Verificação de qualidade de código (ESLint)                  |
| `npx tsc --noEmit`  | Verificação de tipos TypeScript                              |
| `npx expo prebuild` | Gera pastas nativas `/android` e `/ios` com base nos plugins |

---

## Troubleshooting Rápido

| Problema                             | Solução                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| "Unable to resolve module"           | Executar `npx expo start --clear`                                 |
| Erro de permissões de GPS            | Verificar `app.json` e aprovar permissões no SO                   |
| `expo-maps` falha no iOS             | Após prebuild executar: `cd ios && pod install`                   |
| Firebase não conecta                 | Garantir que o Bundle ID do `app.json` corresponde ao Firebase    |
| "Couldn't find a navigation context" | Garantir que o ecrã/componente está dentro do NavigationContainer |

> Ver [docs/11-troubleshooting.md](docs/11-troubleshooting.md) para a lista completa.

---

## Documentação Detalhada

Todos os documentos técnicos do aplicativo estão organizados de forma sequencial na pasta `docs/`:

| Documento                                                | Conteúdo                                      |
| -------------------------------------------------------- | --------------------------------------------- |
| [00 — Visão Geral](docs/00-overview.md)                  | Contexto e propósito da app do Passageiro     |
| [01 — Arquitetura](docs/01-architecture.md)              | MVVM e fluxo de dados                         |
| [02 — Estrutura de Pastas](docs/02-project-structure.md) | Organização dos diretórios                    |
| [03 — Tecnologias](docs/03-tech-stack.md)                | Dependências e bibliotecas                    |
| [04 — Setup Local](docs/04-setup-local.md)               | Instalação, Firebase, Permissões Obrigatórias |
| [05 — Firebase](docs/05-firebase.md)                     | Coleções do Firestore e Interfaces TypeScript |
| [06 — Mapas e Localização](docs/06-maps-location.md)     | Rastreamento, Modos de GPS, Markers           |
| [07 — Gestão de Estado](docs/07-state-management.md)     | Zustand e React Query                         |
| [08 — Navegação](docs/08-navigation.md)                  | Rotas e Guards de Autenticação                |
| [09 — Build e Deploy](docs/09-build-deploy.md)           | Configurações do EAS Build                    |
| [10 — Padrões de Código](docs/10-code-standards.md)      | Regras de código, Testing, Contribuição       |
| [11 — Troubleshooting](docs/11-troubleshooting.md)       | Resolução de problemas comuns                 |
| [12 — Roadmap](docs/12-roadmap.md)                       | Planeamento de próximas features              |
| [13 — Design System](docs/13-design-system.md)           | Cores, Tokens, Dark Mode, UI Components       |
| [14 — Features e Ferramentas](docs/14-features-tools.md) | Lista exaustiva de features implementadas     |

> **Dica de Negócio:** Para fluxos globais do sistema, como as regras financeiras de comissões cobradas aos motoristas, consulte a **Bíblia Técnica** transversal em `../_documentation/`.

---

## Licença

Este projeto é proprietário e pertence à **Kandengue**. Todos os direitos reservados.
