import React from 'react';
import { render } from '@testing-library/react-native';
import { FeaturedBadge } from '../components/FeaturedBadge';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config}>{children}</TamaguiProvider>
);

describe('FeaturedBadge', () => {
  it('renders correctly in Spanish', () => {
    const { getByText } = render(<FeaturedBadge locale="es" />, { wrapper });
    expect(getByText('DESTACADO')).toBeTruthy();
  });

  it('renders correctly in English', () => {
    const { getByText } = render(<FeaturedBadge locale="en" />, { wrapper });
    expect(getByText('FEATURED')).toBeTruthy();
  });
});
