import * as React from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type NavigationContextI = NativeStackNavigationProp<any> | undefined

const NavigationContext = React.createContext<NavigationContextI>(undefined);

NavigationContext.displayName = 'NavigationContext';

export default NavigationContext;