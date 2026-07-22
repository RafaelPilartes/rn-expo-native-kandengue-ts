# Navegação — App Passageiro

## Stack de Navegação

O app usa **React Navigation 7** com navegadores nativos:

```
RootRouter
  ├── AuthRouter (não autenticado)
  │   ├── LoginScreen
  │   ├── RegisterScreen
  │   └── ForgotPasswordScreen
  │
  └── MainRouter (autenticado)
      ├── HomeScreen (mapa + pedido de corrida)
      ├── ProfileScreen
      ├── RidesHistoryScreen
      └── ActiveRideStack
          ├── RideRequestScreen
          ├── WaitingDriverScreen
          ├── RideInProgressScreen
          └── RideSummaryScreen
```

## Tipos de Navegadores

| Navegador    | Uso                          | Transição       |
| ------------ | ---------------------------- | --------------- |
| Native Stack | AuthRouter, fluxo de corrida | Push/pop nativo |
| Bottom Tabs  | MainRouter                   | Tab switch      |
| Modal Stack  | Modais de confirmação        | Modal slide-up  |

## Controlo de Acesso

O `RootRouter` decide qual router mostrar baseado no estado de autenticação:

```typescript
// routers/RootRouter.tsx
function RootRouter() {
  const { isAuthenticated } = useAuthStore();
  const { driver } = useDriverProfile(); // verifica se perfil está completo

  if (!isAuthenticated) return <AuthRouter />;
  return <MainRouter />;
}
```

## Deep Links

Notificações FCM podem navegar directamente para o ecrã de corrida:

```typescript
// Quando a notificação chega com { rideId }:
navigation.navigate('ActiveRideStack', {
  screen: 'WaitingDriverScreen',
  params: { rideId }
})
```

---

**Anterior**: [07 — Gestão de Estado](07-state-management.md) | **Próximo**: [09 — Build e Deploy](09-build-deploy.md)
