import React, { useState } from 'react';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { MainNavigation } from '../../Navigator';
import DrawerContent from './Drawer/DrawerContent';

const DrawerNavigator = createDrawerNavigator();

const DrawerNavigation = () => {

  const [routes] = useState([
    { name: "MainNavigation", screen: MainNavigation },
  ])

  return (
    <DrawerNavigator.Navigator initialRouteName='MainNavigation' screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => DrawerContent(navigation)}>
      {
        routes.map((r, index) => <DrawerNavigator.Screen key={index} name={r.name} component={r.screen} />)
      }
    </DrawerNavigator.Navigator>
  )
}

export default DrawerNavigation


