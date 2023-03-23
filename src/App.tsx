import './locales/i18n';
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ClientContainer, ThemeContainer, WebsocketProvider } from './Components/Container';
import { BaseToast } from './Components/Elements/Toasts';
import Routes from './Routes';
import { store } from './Redux';
import { DmGroupListContextProvider } from './Context/DmGuildListContext';
import { strip_public_key } from './Services/constante';

const App = () => {

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast {...props} />
    )
  }

  return (
    <StripeProvider
      publishableKey={strip_public_key}
     // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.trenderapp" // required for Apple Pay
    >
      <ThemeContainer>
        <NavigationContainer>
          <ClientContainer>
            <WebsocketProvider>
              <DmGroupListContextProvider>
                <Provider store={store}>
                  <SafeAreaProvider >
                    <Routes />
                  </SafeAreaProvider>
                </Provider>
              </DmGroupListContextProvider>
            </WebsocketProvider>
          </ClientContainer>
        </NavigationContainer>
        <Toast onPress={() => Toast.hide()} config={toastConfig} />
      </ThemeContainer>
    </StripeProvider>
  );
};

export default App;