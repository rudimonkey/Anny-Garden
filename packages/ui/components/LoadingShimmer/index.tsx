import { YStack, Skeleton } from 'tamagui';
import React from 'react';

export const LoadingShimmer = ({ width = "100%", height = 200 }: { width?: any, height?: any }) => {
  return (
    <YStack width={width} height={height} space="$2">
      <Skeleton width="100%" height="70%" borderRadius="$4" />
      <Skeleton width="60%" height="10%" borderRadius="$2" />
      <Skeleton width="40%" height="10%" borderRadius="$2" />
    </YStack>
  );
};
