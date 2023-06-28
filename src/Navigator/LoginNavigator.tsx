import React, { useState } from 'react';

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterVerification from '../Screens/Login/register_verification';
import ForgotPassword from '../Screens/Login/ForgotPassword';
import { RegisterEmailUsername, RegisterPassword, RegisterAffiliation, RegisterBirthdayAccept } from '../Screens/Login/Register';

const Stack = createStackNavigator();

export type loginRoutesNames =
    "Login" | 
    "RegisterEmailUsername" |
    "RegisterPassword" |
    "RegisterAffiliation" |
    "RegisterBirthdayAccept" |
    "RegisterVerification" |
    "ForgotPassword"

function LoginNavigator() {

    const [routes] = useState([
        { name: "Login", component: LoginScreen },
        { name: "RegisterEmailUsername", component: RegisterEmailUsername },
        { name: "RegisterPassword", component: RegisterPassword },
        { name: "RegisterAffiliation", component: RegisterAffiliation },
        { name: "RegisterBirthdayAccept", component: RegisterBirthdayAccept },
        { name: "RegisterVerification", component: RegisterVerification },
        { name: "ForgotPassword", component: ForgotPassword },
    ])

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            {
                routes.map((r, idx) => <Stack.Screen key={idx} name={r.name} component={r.component} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />)
            }
        </Stack.Navigator>
    )
}

export default LoginNavigator;