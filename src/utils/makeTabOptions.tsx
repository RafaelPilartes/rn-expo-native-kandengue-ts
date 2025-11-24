import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export function makeTabOptions(
  route: any,
  baseName: string,
  hiddenRoutes: string[],
  label: string,
  Icon: React.ComponentType<{ color: string; width: number; height: number }>,
) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? baseName;

  const shouldHideTab = hiddenRoutes.includes(routeName);

  if (shouldHideTab) {
    return {
      tabBarStyle: { display: 'none' },
      tabBarLabel: label,
      tabBarIcon: ({ color }: { color: string }) => (
        <Icon width={24} height={24} color={color} />
      ),
    };
  }

  return {
    tabBarLabel: label,
    tabBarIcon: ({ color }: { color: string }) => (
      <Icon width={24} height={24} color={color} />
    ),
  };
}
