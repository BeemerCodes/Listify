import Toast, { BaseToastProps, ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';
import { Cores } from '../../constants/Colors'; // Ajuste o caminho se necessário
import { Platform } from 'react-native';

/*
  Tipos de Toast:
  - success
  - error
  - info
  - qualquer outro tipo customizado que você registrar
*/

// Configuração customizada para os toasts, para integrá-los ao tema do app
// As cores exatas podem precisar de ajuste fino para combinar perfeitamente.
// Usaremos as cores do tema 'light' como base para os toasts por enquanto,
// pois os toasts geralmente são overlays que não mudam drasticamente com o tema de fundo.
// Poderíamos tornar isso dinâmico com o ThemeContext se necessário, mas aumenta a complexidade.

const toastConfig = {
  /*
    Sobrescreve o componente `success` padrão.
  */
  success: (props: BaseToastProps) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: Cores.light.tint, height: 'auto', minHeight: 60 }} // Verde ou cor de sucesso do tema
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: Cores.light.text, // Cor de texto principal
      }}
      text2Style={{
        fontSize: 14,
        color: Cores.light.textSecondary, // Cor de texto secundário
      }}
      text2NumberOfLines={2}
    />
  ),
  /*
    Sobrescreve o componente `error` padrão.
  */
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Cores.light.destructive, height: 'auto', minHeight: 60 }} // Cor destrutiva do tema
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: Cores.light.text,
      }}
      text2Style={{
        fontSize: 14,
        color: Cores.light.textSecondary,
      }}
      text2NumberOfLines={2}
    />
  ),
  /*
    Sobrescreve o componente `info` padrão.
  */
  info: (props: BaseToastProps) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: Cores.light.roxoClaro, height: 'auto', minHeight: 60 }} // Uma cor informativa, como roxoClaro
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: Cores.light.text,
      }}
      text2Style={{
        fontSize: 14,
        color: Cores.light.textSecondary,
      }}
      text2NumberOfLines={2}
    />
  ),
  /*
    Você pode adicionar outros tipos de toast customizados aqui, por exemplo:

    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
  */
};

// Funções helper para mostrar toasts
// Opcional: `title` pode ser usado como `text1` e `message` como `text2`.

export const showSuccessToast = (message: string, title?: string) => {
  Toast.show({
    type: 'success', // tipo do toast
    text1: title,    // título opcional
    text2: message,  // mensagem principal
    position: 'top',
    visibilityTime: 3000, // 3 segundos
    autoHide: true,
    topOffset: Platform.OS === 'ios' ? 50 : 20, // Ajustar para não sobrepor a status bar
    // bottomOffset: 40, // se a posição for 'bottom'
  });
};

export const showErrorToast = (message: string, title?: string) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000, // Erros podem ficar um pouco mais
    autoHide: true,
    topOffset: Platform.OS === 'ios' ? 50 : 20,
  });
};

export const showInfoToast = (message: string, title?: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: Platform.OS === 'ios' ? 50 : 20,
  });
};

// Você precisará passar este toastConfig para o componente Toast em _layout.tsx
// Ex: <Toast config={toastConfig} />
// No entanto, a forma mais comum de registrar o config é globalmente ao iniciar o app,
// mas como estamos em _layout, podemos passar como prop.
// A documentação sugere que <Toast /> sem props já usa os tipos padrões que podem ser sobrescritos.
// Para usar o config, o <Toast config={toastConfig} /> é a forma correta.
// Se o config não for aplicado automaticamente, pode ser necessário um Toast.setRef e chamadas diretas,
// mas geralmente o <Toast config={...} /> no topo da árvore de componentes é suficiente.

// Para que o config seja aplicado, o <Toast /> em _layout.tsx precisa receber a prop `config`.
// Exemplo de como o _layout.tsx ficaria:
// import Toast from 'react-native-toast-message';
// import { toastConfig } from '../src/utils/toastService'; // Supondo este caminho
// ...
// return (
//   <ThemeProvider>
//     <ListProvider>
//       <TabsLayout />
//       <Toast config={toastConfig} /> {/* Passar o config aqui */}
//     </ListProvider>
//   </ThemeProvider>
// );

export { toastConfig }; // Exportar o config para ser usado no _layout
