# Design System — App Passageiro

O aplicativo utiliza um Design System customizado implementado através do **NativeWind** (Tailwind CSS) e variáveis de tema.

## Cores Principais

| Nome          | Hex       | Uso                                               |
| ------------- | --------- | ------------------------------------------------- |
| `primary.200` | `#e0212d` | Vermelho principal (botões primários, highlights) |
| `primary.500` | `#a81922` | Vermelho escuro (hover, estados ativos)           |
| `accent`      | `#F13024` | Cor de sotaque                                    |
| `baseText`    | `#022147` | Cor do texto principal (Light Mode)               |
| `baseDark`    | `#000F21` | Fundos escuros / Dark Mode                        |

**Configuração Tailwind (`tailwind.config.js`):**

```javascript
colors: {
  primary: {
    200: '#e0212d',
    500: '#a81922',
  },
  accent: '#F13024',
  baseText: '#022147',
  baseDark: '#000F21',
}
```

## Espaçamento e Layout

As margens e paddings estão padronizadas usando tokens customizados:

```javascript
padding: {
  containerXY: '24px',       // Padding padrão de ecrãs
  'container-sm': '10px',    // Componentes pequenos
  'container-md': '15px',    // Cards médios
  'container-lg': '25px'     // Modais ou painéis grandes
}
```

## Dark Mode

O aplicativo suporta alternância completa de tema:

- Controlado globalmente via `ThemeProvider` e Context API.
- Usamos classes do Tailwind com o prefixo `dark:` para aplicar estilos específicos.
- **Exemplo:** `className="bg-white dark:bg-baseDark text-baseText dark:text-white"`

## UI Components Globais

Componentes reutilizáveis devem ser colocados em `src/components/ui/` e usar estritamente o design system:

- `CustomButton`: Estilizado com `primary.200`
- `CustomAlert`: Substituto do `Alert.alert` com 4 variantes (`success`, `error`, `warning`, `info`). Usa animações com `react-native-reanimated`.
- `NetworkStatusBanner`: Mostra quando o dispositivo está offline.

---

**Anterior**: [12 — Roadmap](12-roadmap.md) | **Próximo**: [14 — Features e Dependências](14-features-tools.md)
