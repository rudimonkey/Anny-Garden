import { Input, XStack, Button } from 'tamagui';
import { Search } from '@tamagui/lucide-icons';
import React from 'react';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export const SearchBar = ({ value, onChangeText, placeholder = "Buscar plantas...", onSearch }: SearchBarProps) => {
  return (
    <XStack space="$2" alignItems="center" width="100%">
      <Input
        flex={1}
        size="$4"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        borderWidth={2}
        focusStyle={{ borderColor: '$leafGreen9' }}
      />
      <Button size="$4" icon={Search} onPress={onSearch} backgroundColor="$leafGreen9" color="white">
        {/* Search */}
      </Button>
    </XStack>
  );
};
