declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<
    SvgProps & {
      /** Largura personalizada */
      width?: number | string;
      /** Altura personalizada */
      height?: number | string;
      /** Cor de preenchimento */
      fill?: string;
      /** Classe do NativeWind/Tailwind */
      className?: string;
      /** Estilo inline */
      style?: import('react-native').StyleProp<
        import('react-native').ViewStyle
      >;
    }
  >;

  export default content;
}
