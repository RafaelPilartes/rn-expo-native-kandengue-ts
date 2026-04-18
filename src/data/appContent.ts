import {
  EMAIL_SUPPORT,
  VOICE_NUMBER,
  WHATSAPP_NUMBER
} from '@/constants/config'

export const contentAbout = {
  history: `Kandengue Atrevido (KA) é uma empresa jovem e inovadora que foi criada com o objectivo de oferecer serviços de transporte, especialmente no ramo de entregas. Com uma equipe de jovens empreendedores, a empresa busca trazer uma abordagem fresca e ousada para o sector.

O diferencial da Kandengue Atrevido (KA) está na sua dedicação em prestar serviço de qualidade, rápido e eficiente. A empresa entende a importância de atender as demandas dos clientes de forma ágil, e garantir que as entregas sejam feitas com segurança e qualidade.

Com uma visão empreendedora e uma equipe dedicada, a Kandengue Atrevido (KA) tem conquistado cada vez mais clientes satisfeitos e se estabelecido como uma referência no ramo da entrega. Se você procura um serviço de transporte ágil, seguro e com um toque de ousadia, a Kandengue Atrevido é a escolha certa!`,
  mission: `Oferecer soluções logísticas e eficientes para os nossos clientes, garantindo entregas rápidas e seguras, com o compromisso de conectar pessoas e negócios em toda Angola.`,
  vision: `Oferecer soluções logísticas e eficientes para os nossos clientes, garantindo entregas rápidas e seguras, com o compromisso de conectar pessoas e negócios em toda Angola.`,
  values: `Promover a humildade, semear o respeito, estimular a pontualidade e servir com qualidade.`,
  slogan: `Kandengue Atrevido, chegar atrasado? Duvido!`
}

export const contentHelp = {
  attendanceChannels: {
    phone: VOICE_NUMBER,
    whatsapp: WHATSAPP_NUMBER,
    email: EMAIL_SUPPORT
  },
  schedule: 'Das 8h às 22h, todos os dias'
}

export const contentPrivacyPolicy = [
  {
    id: 'information-collection',
    title: '1. Informações que Recolhemos',
    iconName: 'User',
    content: `Podemos recolher os seguintes tipos de dados:

1.1 Dados fornecidos pelo utilizador
- Nome completo
- Número de telefone
- Endereço de e-mail
- Endereço físico (quando aplicável)
- Informações de pagamento (quando aplicável)

1.2 Dados recolhidos automaticamente
- Endereço IP
- Tipo de dispositivo e sistema operativo
- Dados de localização (se autorizado)
- Histórico de utilização da App
- Cookies e tecnologias semelhantes

1.3 Dados de terceiros
Podemos receber informações de parceiros ou serviços externos, como plataformas de pagamento ou autenticação.`
  },
  {
    id: 'how-we-use',
    title: '2. Finalidade do Tratamento dos Dados',
    iconName: 'Eye',
    content: `Os dados recolhidos são utilizados para:
- Criar e gerir contas de utilizadores
- Processar transações e pedidos
- Melhorar a experiência do utilizador
- Personalizar conteúdos e serviços
- Prestar suporte ao cliente
- Garantir a segurança da aplicação
- Cumprir obrigações legais e regulatórias`
  },
  {
    id: 'information-sharing',
    title: '3. Partilha de Dados',
    iconName: 'Share2',
    content: `A Kandengue Atrevido não vende dados pessoais. No entanto, pode partilhar informações com:
- Prestadores de serviços (pagamentos, alojamento, suporte técnico)
- Autoridades legais, quando exigido por lei
- Parceiros estratégicos, mediante consentimento do utilizador

Todos os terceiros estão obrigados a garantir a confidencialidade e segurança dos dados.`
  },
  {
    id: 'data-security',
    title: '4. Armazenamento e Segurança',
    iconName: 'Lock',
    content: `Adotamos medidas técnicas e organizacionais adequadas para proteger os dados contra:
- Acesso não autorizado
- Alteração indevida
- Divulgação ou destruição

Os dados são armazenados em servidores seguros e apenas pelo tempo necessário para cumprir as finalidades descritas.`
  },
  {
    id: 'your-rights',
    title: '5. Direitos do Utilizador',
    iconName: 'UserCheck',
    content: `O utilizador tem o direito de:
- Aceder aos seus dados pessoais
- Corrigir informações incorretas
- Solicitar a eliminação dos seus dados
- Retirar o consentimento a qualquer momento
- Opor-se ao tratamento dos dados

Para exercer estes direitos, o utilizador pode contactar-nos através dos nossos canais oficiais.`
  },
  {
    id: 'cookies',
    title: '6. Cookies e Tecnologias Semelhantes',
    iconName: 'Globe',
    content: `A App pode utilizar cookies para:
- Melhorar a navegação
- Analisar o uso da aplicação
- Personalizar a experiência

O utilizador pode gerir as permissões de cookies nas configurações do dispositivo.`
  },
  {
    id: 'data-retention',
    title: '7. Retenção de Dados',
    iconName: 'Archive',
    content: `Os dados pessoais serão mantidos apenas pelo período necessário para:
- Cumprir as finalidades desta política
- Atender a requisitos legais
- Resolver disputas e fazer cumprir acordos`
  },
  {
    id: 'children-privacy',
    title: '8. Proteção de Menores',
    iconName: 'ShieldAlert',
    content: `A App não se destina a menores de idade sem supervisão. Caso sejam identificados dados de menores sem consentimento, estes serão eliminados imediatamente.`
  },
  {
    id: 'changes',
    title: '9. Alterações à Política de Privacidade',
    iconName: 'RefreshCw',
    content: `A Kandengue Atrevido reserva-se o direito de atualizar esta política a qualquer momento. As alterações serão comunicadas através da App ou outros meios adequados.`
  },
  {
    id: 'contact',
    title: '10. Contacto',
    iconName: 'Phone',
    content: `Para questões relacionadas com esta Política de Privacidade ou tratamento de dados, entre em contacto através dos canais de ajuda disponíveis na aplicação.`
  },
  {
    id: 'consent',
    title: '11. Consentimento',
    iconName: 'CheckCircle',
    content: `Ao utilizar a App da Kandengue Atrevido, o utilizador declara que leu, compreendeu e concorda com esta Política de Privacidade.`
  }
]

export const contentTermsConditions = [
  {
    id: 'acceptance',
    title: '1. Aceitação dos Termos',
    iconName: 'CheckCircle',
    content: `Ao utilizar o aplicativo Kandengue Atrevido, o utilizador concorda plenamente com estes Termos e Condições.

- É exigida a idade mínima de 18 anos.
- Deve haver capacidade legal para celebrar contratos.
- A aceitação destes termos é condição obrigatória para uso dos serviços.`
  },
  {
    id: 'services',
    title: '2. Serviços Prestados',
    iconName: 'MapPin',
    content: `O Kandengue Atrevido é uma plataforma logística cuja finalidade é:
- Conectar passageiros a motoristas parceiros qualificados.
- Facilitar serviços de entregas rápidas e seguras.
- Fornecer soluções eficientes de mobilidade e logística.

Atuamos como ponte tecnológica entre prestadores de serviço e utilizadores.`
  },
  {
    id: 'registration',
    title: '3. Cadastro e Segurança da Conta',
    iconName: 'User',
    content: `Para utilizar a plataforma, o utilizador deve:
- Fornecer dados exatos e mantê-los atualizados.
- Não partilhar credenciais de acesso com terceiros.
- Responsabilizar-se por toda a atividade gerada a partir da sua conta.`
  },
  {
    id: 'payments',
    title: '4. Pagamentos e Tarifas',
    iconName: 'CreditCard',
    content: `- As tarifas são baseadas na distância, tempo de viagem e procura.
- Aceitamos pagamentos em numerário e métodos digitais.
- Os utilizadores comprometem-se a pagar pelos serviços solicitados.
- Em caso de cancelamentos tardios, podem ser aplicadas taxas de compensação.`
  },
  {
    id: 'responsibilities',
    title: '5. Deveres e Responsabilidades',
    iconName: 'Shield',
    content: `Deveres do Utilizador:
- Tratar motoristas parceiros e estafetas com urbanidade e respeito.
- Conferir dados da viatura e do condutor antes do embarque.

Deveres do Kandengue Atrevido:
- Garantir a operacionalidade da aplicação.
- Mediar conflitos de forma imparcial através do suporte.`
  },
  {
    id: 'liability',
    title: '6. Limitação de Responsabilidade',
    iconName: 'AlertTriangle',
    content: `O Kandengue Atrevido não se responsabiliza por:
- Itens esquecidos dentro dos veículos (apesar de prestarmos auxílio na sua recuperação).
- Atrasos motivados por condições de trânsito ou de força maior.
- Comportamentos isolados perpetrados por parceiros independentes.`
  }
]

export const contentFaq = [
  {
    id: 'faq-1',
    category: 'account',
    question: 'Como criar a minha conta no Kandengue Atrevido?',
    answer: `1. Descarregue a aplicação.\n2. Clique em "Registrar" e insira os seus dados pessoais (nome, telefone e e-mail).\n3. Verifique o seu contacto telefónico através do código SMS enviado.\n4. Complete o perfil para começar a pedir viagens ou entregas.`
  },
  {
    id: 'faq-2',
    category: 'account',
    question: 'O que devo fazer se esquecer a minha senha?',
    answer: `No ecrã inicial, selecione "Esqueci a minha senha". Introduza o seu número ou e-mail registado e enviaremos instruções passo a passo para criar uma nova senha de segurança.`
  },
  {
    id: 'faq-3',
    category: 'rides',
    question: 'Como peço uma viagem ou uma encomenda?',
    answer: `Na página principal da aplicação, insira o seu destino, escolha qual a modalidade que pretende (carro, moto ou entrega) e confirme a partida. Um motorista ou estafeta perto de si será atribuído imediatamente.`
  },
  {
    id: 'faq-4',
    category: 'rides',
    question: 'Como é calculada a tarifa da viagem?',
    answer: `As tarifas são calculadas de forma dinâmica. O valor exibido antes de confirmar a viagem tem como base a distância da rota, a estimativa de tempo e as condições do trânsito na cidade de Luanda e arredores.`
  },
  {
    id: 'faq-5',
    category: 'payments',
    question: 'Posso pagar em dinheiro?',
    answer: `Sim! O Kandengue Atrevido permite pagamentos em numerário para que o utilizador viaje sempre de forma acessível. Mas pedimos sempre aos utilizadores que facilitem o troco ao motorista.`
  },
  {
    id: 'faq-6',
    category: 'safety',
    question: 'Que medidas de segurança são aplicadas aos parceiros?',
    answer: `A integridade é um pilar da nossa missão. Todos os parceiros têm as matrículas verificadas, documentos conferidos pessoalmente, e o nosso sistema é munido de botões de segurança para garantir total confiança ao passageiro.`
  },
  {
    id: 'faq-7',
    category: 'technical',
    question: 'Qual é o horário em que posso encontrar carros disponíveis?',
    answer: `O aplicativo opera 24 horas por dia. Contudo, entre as 8h e as 22h, o volume de motoristas e o suporte oficial do Kandengue Atrevido encontram-se na sua máxima capacidade.`
  }
]
