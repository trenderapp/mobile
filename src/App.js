import './locales/i18n';
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from 'react-redux';

import { ClientContainer, ThemeContainer, WebsocketProvider } from './Components/Container';
import { BaseToast, MessageToast } from './Components/Elements/Toasts';
import Routes from './Routes';
import { store } from './Redux';
import { DmGroupListContextProvider } from './Context/DmGuildListContext';

const App = () => {

  const toastConfig  = {
    success: (props) => (
      <BaseToast {...props} />
    ),
    message: (props) => {
      <MessageToast {...props} />
    }
  }

  return (
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
  );
};

export default App;