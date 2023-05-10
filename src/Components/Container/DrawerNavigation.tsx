import React from 'react';
import { createDrawerNavigator, } from '@react-navigation/drawer';

import { BottomNavigation } from '../../Navigator';
import DrawerContent from './Drawer/DrawerContent';
import { PostStack, ProfileStack, SettingsStack } from '../../Navigator/Stacks';
import CreateStack from '../../Navigator/Stacks/CreateStack';
import MessageStack from '../../Navigator/Stacks/MessageStack';

const DrawerNavigator = createDrawerNavigator();

const DrawerNavigation = () => {

  return (
    <DrawerNavigator.Navigator initialRouteName='BottomNavigator' backBehavior='none' screenOptions={{ headerShown: false, drawerType: "slide", overlayColor: "transparent" }} drawerContent={(props) => DrawerContent(props)}>
      <DrawerNavigator.Screen name='BottomNavigator' component={BottomNavigation} />
      <DrawerNavigator.Screen name='SettingsStack' component={SettingsStack} />
    </DrawerNavigator.Navigator>
  )
}

export default DrawerNavigation


