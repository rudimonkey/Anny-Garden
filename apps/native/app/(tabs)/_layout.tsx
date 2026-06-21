import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Library } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { Button } from 'tamagui';

export default function TabLayout() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLng);
  };

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#2d6a4f',
      headerRight: () => (
        <Button
          onPress={toggleLanguage}
          marginRight="$4"
          size="$2"
          circular
          backgroundColor="$leafGreen9"
          color="white"
        >
          {i18n.language.toUpperCase()}
        </Button>
      )
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: t('nav.browse'),
          tabBarIcon: ({ color }) => <Search color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: t('nav.collection'),
          tabBarIcon: ({ color }) => <Library color={color} />,
        }}
      />
    </Tabs>
  );
}
