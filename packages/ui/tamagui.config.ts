import { createTokens, createTamagui } from 'tamagui'
import { config } from '@tamagui/config/v3'

const tokens = createTokens({
  color: {
    leafGreen1: '#f0f7ee',
    leafGreen9: '#2d6a4f',
    leafGreen11: '#1b4332',
    soilBrown6: '#a0522d',
    morningSky1: '#e8f4fd',
    alertRed9: '#c0392b',
    guestGray5: '#9e9e9e',
    ...config.tokens.color
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, ...config.tokens.space },
  size: { 1: 18, 2: 36, 3: 44, 4: 56, ...config.tokens.size },
  radius: { 1: 4, 2: 8, 3: 12, 4: 20, round: 9999, ...config.tokens.radius },
  zIndex: { 1: 100, 2: 200, 3: 300, 4: 400, overlay: 500, ...config.tokens.zIndex },
})

const appConfig = createTamagui({
  ...config,
  tokens,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: tokens.color.leafGreen1,
      color: tokens.color.leafGreen11,
      primary: tokens.color.leafGreen9,
    }
  },
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
