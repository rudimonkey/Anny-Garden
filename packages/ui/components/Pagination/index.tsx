import { XStack, Button, Text } from 'tamagui';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <XStack space="$2" alignItems="center" justifyContent="center" padding="$4">
      <Button
        icon={ChevronLeft}
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        circular
      />
      <Text fontWeight="bold">
        {currentPage} / {totalPages}
      </Text>
      <Button
        icon={ChevronRight}
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        circular
      />
    </XStack>
  );
};
