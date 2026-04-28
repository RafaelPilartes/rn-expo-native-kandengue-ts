# Padrões de Código — App Passageiro

## Linguagem e Ferramentas

- **TypeScript** com `strict: true` em toda a codebase
- **ESLint** para linting
- **Prettier** para formatação (integrado com ESLint)
- **Conventional Commits** para mensagens de git

## Nomenclatura de Ficheiros

| Tipo            | Padrão                   | Exemplo               |
| --------------- | ------------------------ | --------------------- |
| Screen          | `{Nome}Screen.tsx`       | `HomeScreen.tsx`      |
| Component       | `{NomeComponente}.tsx`   | `RideCard.tsx`        |
| ViewModel hook  | `use{Nome}ViewModel.ts`  | `useRideViewModel.ts` |
| Custom hook     | `use{Nome}.ts`           | `useRideSummary.ts`   |
| Service         | `{nome}.service.ts`      | `location.service.ts` |
| Repository      | `{nome}.repository.ts`   | `ride.repository.ts`  |
| Context         | `{Nome}Context.tsx`      | `AlertContext.tsx`    |
| Provider        | `{Nome}Provider.tsx`     | `NetworkProvider.tsx` |
| Store (Zustand) | `{nome}.store.ts`        | `auth.store.ts`       |
| Entity          | `{Nome}.ts` (PascalCase) | `Ride.ts`             |
| Interface       | `I{Nome}.ts`             | `IRide.ts`            |
| Types           | `{nome}.ts`              | `enum.ts`, `ride.ts`  |

## Nomenclatura de Código TypeScript

| Elemento           | Convenção                  | Exemplo                                |
| ------------------ | -------------------------- | -------------------------------------- |
| Classes (Entities) | PascalCase                 | `RideEntity`, `UserEntity`             |
| Interfaces         | PascalCase com `I` prefixo | `IRide`, `IUser`, `IDriver`            |
| Types              | camelCase / PascalCase     | `RideStatusType`, `LiveLocationType`   |
| Componentes React  | PascalCase                 | `RideSummaryCard`                      |
| Hooks              | `use` + PascalCase         | `useRideSummary`                       |
| Functions          | camelCase                  | `calculateFare`                        |
| Variables          | camelCase                  | `rideTrackingData`                     |
| Constants          | UPPER_SNAKE_CASE           | `LOCATION_TASK_NAME`                   |
| Firestore fields   | snake_case                 | `created_at`, `driver_id`, `is_online` |

## Padrão MVVM — Regras

```
✅ Screen → chama apenas hooks de ViewModel
✅ ViewModel → usa React Query + Zustand
✅ ViewModel → chama Repository (via modules/Api/)
✅ Repository → acede ao Firebase/REST
❌ Screen → nunca acede directamente ao Firebase
❌ Screen → nunca importa de modules/Api/ directamente
❌ ViewModel → nunca tem código de renderização
```

## Organização de Imports

```typescript
// 1. React e React Native
import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

// 2. Bibliotecas externas
import { useQuery } from '@tanstack/react-query'

// 3. Path aliases (@/)
import { useRideStore } from '@/storage/store/ride.store'
import { RideRepository } from '@/modules/Api'

// 4. Tipos e interfaces
import type { RideInterface } from '@/interfaces/IRide'
```

## Tratamento de Erros

```typescript
// ✅ Correcto — React Query trata automaticamente
const { data, error, isLoading } = useQuery({ ... });

// ✅ Correcto — alertas via AlertContext
const { showAlert } = useAlertContext();
showAlert({ type: 'error', message: 'Erro ao carregar corrida' });

// ❌ Errado — Alert nativo do React Native
Alert.alert('Erro', 'Mensagem'); // substituído pelo AlertContext
```

## Testing

```bash
# Executar testes (quando implementados)
npm test

# Executar linter
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Use **TypeScript** para type safety
- Siga o padrão **ESLint** configurado
- Escreva **código limpo e autoexplicativo**
- Documente funções complexas com **JSDoc/TSDoc**
- Use **Conventional Commits** para mensagens de commit

## Checklist antes de Commit

- [ ] `npx tsc --noEmit` sem erros de tipos
- [ ] `npm run lint` sem erros críticos
- [ ] Componentes não acedem directamente ao Firebase
- [ ] ViewModels não têm lógica de renderização
- [ ] Novos campos em entidades adicionados às interfaces em `src/interfaces/`

---

**Anterior**: [09 — Build e Deploy](09-build-deploy.md) | **Próximo**: [11 — Troubleshooting](11-troubleshooting.md)
