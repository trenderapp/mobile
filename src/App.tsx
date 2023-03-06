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

const App = () => {

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast {...props} />
    )
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51MgmhMIjDzZnrQfFgKX47Dcd9ICwXY6aZzcHZtCJxW9yaec14qfUbPT7pkZcjF6KdjFlpUw8PRnMnezySI9z9NSv00bbimfgiG"
     // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
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