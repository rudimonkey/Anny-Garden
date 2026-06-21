import { Stack, Tabs } from 'expo-router'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../../packages/ui/tamagui.config'
import { Leaf, Search, Library, User } from '@tamagui/lucide-icons'

export default function Layout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name="light">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#1b4332',
            tabBarInactiveTintColor: '#9e9e9e',
            tabBarStyle: {
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#f0f7ee',
              height: 60,
              paddingBottom: 10,
            },
            headerStyle: {
              backgroundColor: '#1b4332',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: '900',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color }) => <Leaf color={color} />,
            }}
          />
          <Tabs.Screen
            name="browse"
            options={{
              title: 'Explorar',
              tabBarIcon: ({ color }) => <Search color={color} />,
            }}
          />
          <Tabs.Screen
            name="collection"
            options={{
              title: 'Mi Huerto',
              tabBarIcon: ({ color }) => <Library color={color} />,
            }}
          />
        </Tabs>
      </Theme>
    </TamaguiProvider>
  )
}
