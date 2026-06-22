import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render } from '@testing-library/react-native';
import { FeaturedBadge } from '../components/FeaturedBadge';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';
const wrapper = ({ children }) => (_jsx(TamaguiProvider, { config: config, children: children }));
describe('FeaturedBadge', () => {
    it('renders correctly in Spanish', () => {
        const { getByText } = render(_jsx(FeaturedBadge, { locale: "es" }), { wrapper });
        expect(getByText('DESTACADO')).toBeTruthy();
    });
    it('renders correctly in English', () => {
        const { getByText } = render(_jsx(FeaturedBadge, { locale: "en" }), { wrapper });
        expect(getByText('FEATURED')).toBeTruthy();
    });
});
