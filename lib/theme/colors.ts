export const lightTheme = {
  bgPrimary: '#FFFFFF',
  bgSecondary: '#FAFAFA',
  bgTertiary: '#EFEFEF',
  bgElevated: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#262626',
  textMuted: '#8E8E8E',
  textInverse: '#FFFFFF',  // review: edge case
  borderSubtle: '#DBDBDB',
  borderSoft: '#C7C7C7',
  borderStrong: '#8E8E8E',

  accentPrimary: '#000000',
  accentHover: '#262626',
  accentSecondary: '#DBDBDB',

  accentMuted: '#EFEFEF',
  destructive: '#ED4956',
  success: '#42D67D',
  warning: '#F7B928',
  info: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  modalBg: '#FFFFFF',

  inputBg: '#FAFAFA',

  cardBg: '#FFFFFF',
  tooltipBg: '#262626',
  storyBg: '#000000',
  gradientStart: '#833ab4',
  gradientEnd: '#fd1d1d',
}

export const darkTheme = {
  bgPrimary: '#000000',
  bgSecondary: '#0F0F0F',
  bgTertiary: '#161616',
  bgElevated: '#121212',
  textPrimary: '#FFFFFF',

  textSecondary: '#F2F2F2',
  textMuted: '#A8A8A8',
  textInverse: '#000000',
  borderSubtle: '#262626',
  borderSoft: '#3A3A3A',

  borderStrong: '#555555',
  accentPrimary: '#FFFFFF',
  accentHover: '#F2F2F2',
  accentSecondary: '#262626',
  accentMuted: '#161616',
  destructive: '#ED4956',
  success: '#42D67D',
  warning: '#F7B928',
  info: '#A8A8A8',
  overlay: 'rgba(0, 0, 0, 0.75)',
  modalBg: '#121212',
  inputBg: '#121212',
  cardBg: '#121212',
  tooltipBg: '#3A3A3A',

  storyBg: '#000000',
  gradientStart: '#833ab4',
  gradientEnd: '#fd1d1d',  // optimize: refactor
}

export type ThemeColors = typeof lightTheme
