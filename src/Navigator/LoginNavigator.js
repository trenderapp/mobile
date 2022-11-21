import React from 'react';

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterVerification from '../Screens/Login/register_verification';
import ForgotPassword from '../Screens/Login/ForgotPassword';
import { RegisterEmailUsername, RegisterPassword, RegisterAffiliation, RegisterBirthdayAccept } from '../Screens/Login/Register';

const Stack = createStackNavigator();

function LoginNavigator() {

    return (
        <Stack.Navigator headerShown={'none'} initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterEmailUsername" component={RegisterEmailUsername} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterPassword" component={RegisterPassword} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
            <Stack.Screen name="RegisterAffiliation" component={RegisterAffiliation} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
            <Stack.Screen name="RegisterBirthdayAccept" component={RegisterBirthdayAccept} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
            <Stack.Screen name="RegisterVerification" component={RegisterVerification} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true, headerTitle: "Forgot Password" }} />
        </Stack.Navigator>
    )
}

export default LoginNavigator;