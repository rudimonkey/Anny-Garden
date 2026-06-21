import React from 'react'
import { XStack, Button, Text } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <XStack gap="$2" alignItems="center" justifyContent="center" py="$4">
      <Button
        size="$3"
        circular
        icon={ChevronLeft}
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        opacity={currentPage === 1 ? 0.3 : 1}
      />

      {pages.map((p) => (
        <Button
          key={p}
          size="$3"
          circular
          backgroundColor={p === currentPage ? '$leafGreen9' : 'transparent'}
          onPress={() => onPageChange(p)}
        >
          <Text color={p === currentPage ? 'white' : '$leafGreen11'}>{p}</Text>
        </Button>
      ))}

      <Button
        size="$3"
        circular
        icon={ChevronRight}
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        opacity={currentPage === totalPages ? 0.3 : 1}
      />
    </XStack>
  )
}
