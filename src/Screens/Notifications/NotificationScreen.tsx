import * as React from 'react';
import { NotificationContainer } from '../../Components/Container';
import NotificationNavigator from './NotificationNavigator';


function NotificationScreen() {
  return (
    <NotificationContainer>
      <NotificationNavigator />
    </NotificationContainer>
  );
}

export default NotificationScreen;