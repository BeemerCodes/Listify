/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Cores customizadas do projeto
const roxoPrincipal = "#8B5CF6";
const roxoClaro = "#A78BFA";
const cinzaFundoOriginal = "#F3F4F6"; // Mantido para referência ou tema claro
const cinzaInputOriginal = "#E5E7EB"; // Mantido para referência ou tema claro
const brancoOriginal = "#FFFFFF";
const pretoTextoOriginal = "#1F2937";
const cinzaTextoOriginal = "#6B7281";
const vermelhoExcluirOriginal = "#EF4444";

// Cores base para tema escuro (antes da centralização)
// const cinzaFundoEscuroOriginal = "#1F2937";
// const brancoEscuroOriginal = "#2D3748"; // Usado para cards/sections no escuro
// const pretoTextoEscuroOriginal = "#E5E7EB";
// const cinzaTextoEscuroOriginal = "#9CA3AF";


export const Cores = { // Renomeado de Colors para Cores para consistência com o resto do projeto
  light: {
    text: pretoTextoOriginal, // '#11181C'
    textSecondary: cinzaTextoOriginal,
    background: cinzaFundoOriginal, // '#fff'
    tint: roxoPrincipal, // '#0a7ea4'
    icon: cinzaTextoOriginal, // '#687076'
    tabIconDefault: cinzaTextoOriginal, // '#687076'
    tabIconSelected: roxoPrincipal,
    // Cores específicas do projeto para tema claro
    roxoPrincipal: roxoPrincipal,
    roxoClaro: roxoClaro, // Pode não ser usado no claro, mas definido para consistência
    cardBackground: brancoOriginal,
    inputBackground: brancoOriginal, // Ou cinzaFundoOriginal dependendo do design
    inputBorder: cinzaInputOriginal,
    placeholderText: cinzaTextoOriginal,
    buttonText: brancoOriginal,
    buttonPrimaryBackground: roxoPrincipal,
    buttonSecondaryBackground: cinzaInputOriginal,
    buttonSecondaryText: pretoTextoOriginal,
    destructive: vermelhoExcluirOriginal,
    borderColor: cinzaInputOriginal,
  },
  dark: {
    text: '#E0E0E0', // '#ECEDEE' -> Branco mais suave
    textSecondary: '#B0B0B0', // '#9BA1A6' -> Cinza mais claro
    background: '#1A1A1A', // '#151718' -> Fundo principal escuro
    tint: roxoClaro, // '#fff' -> Usar roxoClaro como tint principal no dark mode
    icon: '#B0B0B0', // '#9BA1A6'
    tabIconDefault: '#B0B0B0', // '#9BA1A6'
    tabIconSelected: roxoClaro,
    // Cores específicas do projeto para tema escuro
    roxoPrincipal: roxoPrincipal, // Mantido para o FAB de resumo
    roxoClaro: roxoClaro, // Usado como cor de destaque principal no escuro
    cardBackground: '#2C2C2C', // Antigo brancoEscuro '#2D3748'
    inputBackground: '#3A3A3A', // Um pouco mais claro que o card
    inputBorder: '#505050', // Borda sutil para inputs
    placeholderText: '#707070', // Mais escuro que textSecondary
    buttonText: brancoOriginal, // Texto do botão primário geralmente branco
    buttonPrimaryBackground: roxoClaro,
    buttonSecondaryBackground: '#4A4A4A',
    buttonSecondaryText: '#E0E0E0',
    destructive: '#FF6B6B', // Um vermelho um pouco mais vibrante no escuro
    borderColor: '#404040', // Borda geral para seções, etc.
  },
};
