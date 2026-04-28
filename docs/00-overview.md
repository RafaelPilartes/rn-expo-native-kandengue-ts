# Visão Geral — App Passageiro (Kandengue)

## O que é

**Kandengue Atrevido** é a aplicação mobile do passageiro no ecossistema Kandengue — uma plataforma de ride-hailing angolana. O app permite ao utilizador solicitar corridas, acompanhar o motorista em tempo real, gerir o histórico de viagens e receber notificações push em tempo real.

## Problema que resolve

O passageiro precisa de:

1. **Solicitar corridas** com origem/destino via mapa interactivo
2. **Acompanhar o motorista** em tempo real (localização GPS, rota, ETA)
3. **Receber notificações** sobre o estado da corrida
4. **Gerir o histórico** e pagamentos das viagens
5. **Comunicar** com o motorista de forma simples

## Contexto no Ecossistema

- Comunica com **Firestore** para operações em tempo real (corridas, localização)
- Comunica com a **API Fastify** para operações seguras (pagamentos, notificações)
- Recebe **notificações push** via Firebase Cloud Messaging
- O passageiro é **o iniciador do fluxo de corrida** — cria o documento `rides/{id}` no Firestore

## Funcionalidades Principais

| Feature                    | Descrição                                                            |
| -------------------------- | -------------------------------------------------------------------- |
| Rastreamento em tempo real | Motorista visível no mapa com rotação direcional e polyline trimming |
| Geocoding                  | Google Maps API para autocompletar endereços                         |
| Notificações push          | FCM para iOS e Android (corridas, estados)                           |
| Histórico de corridas      | Lista completa com detalhes e valor                                  |
| Autenticação               | Firebase Auth (email/password + social)                              |
| Multilingue                | Português e Inglês (i18next)                                         |
| Dark mode                  | ThemeProvider com alternância automática                             |
| Offline awareness          | NetworkProvider + banner de status                                   |

---

**Próximo**: [01 — Arquitectura](01-architecture.md)
