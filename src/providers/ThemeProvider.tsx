import { useEffect } from 'react';
import { Appearance, AppState, AppStateStatus } from 'react-native';
import { View } from 'react-native';
import { useThemeStore } from '@/storage/store/useThemeStore';

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const { theme, resolvedTheme, updateResolvedTheme } = useThemeStore();
  // const [appState, setAppState] = useState(AppState.currentState);

  // Atualiza quando sistema muda
  useEffect(() => {
    const listener = Appearance.addChangeListener(() => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    });

    return () => listener.remove();
  }, [theme]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && theme === 'system') {
        updateResolvedTheme();
      }
    });
    return () => sub.remove();
  }, [theme]);

  // Atualiza ao alternar entre app ativo/inativo
  // useEffect(() => {
  //   const onChange = (nextAppState: AppStateStatus) => {
  //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //       updateResolvedTheme();
  //     }
  //     setAppState(nextAppState);
  //   };

  //   const subscription = AppState.addEventListener('change', onChange);
  //   return () => subscription.remove();
  // }, [appState]);

  return (
    <View className={`${resolvedTheme === 'dark' ? 'dark' : ''} flex-1`}>
      {children}
    </View>
  );
};
