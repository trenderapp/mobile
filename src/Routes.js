import React, { useContext, useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import notifee from "@notifee/react-native";
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { webSocketRoutes } from 'trender-client';
import messaging from "@react-native-firebase/messaging";

import { BottomNavigation, LoginNavigator, SplashScreen } from './Navigator';
import { PostStack, ProfileStack, SettingsStack } from './Navigator/Stacks';
import { useClient, useWebSocket } from './Components/Container';
import { DmGroupListContext, initDmGroup, modifyDmGroup } from './Context/DmGuildListContext';
import { changeElementPlaceArray, parseURL } from './Services';
import { requestNotificationPermission } from './Services/notifications';
import VerificationCode from './Screens/Login/Verify/VerificationCode';
import CreateStack from './Navigator/Stacks/CreateStack';
import MessageStack from './Navigator/Stacks/MessageStack';

import 'dayjs/locale/fr'
import 'dayjs/locale/en'

const Stack = createStackNavigator();

function Routes() {
    
    const { state, client } = useClient();
    const { i18n } = useTranslation();
    const { notification } = useWebSocket();
    const DmGroupList = useContext(DmGroupListContext);
    const navigation = useNavigation();

    async function getGuilds() {
        const request = await client.guild.fetch();
        if(request.error) return;
        DmGroupList.dispatch(initDmGroup(request.data));
    }

    async function getUnreads() {
        const request = await client.message.unreads();
        if(request.error) return;
        DmGroupList.setUnreads(request.data);
    }

    useEffect(() => {
        dayjs.locale(i18n.language);

        notifee.setBadgeCount(0);
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();
            if(!initialUrl) return;
      
            const [param] = parseURL(initialUrl);
            if(param.startsWith("/register/verify")) return navigation.navigate("RegisterVerificationCode", {
                code: param.split("/register/verify").slice(1)[0].replace("/", "")
            });
          };
      
          getUrlAsync();
      
    }, [])

    const registerFCMToken = async () => {
        const fcmToken = await requestNotificationPermission();
        if(fcmToken) await client.pushNotification.register(fcmToken);
        return;
    }

    useEffect(() => {
        if(state === "loged") {
            registerFCMToken()
            messaging().onTokenRefresh(async token => {
                await client.pushNotification.register(token);
            });
            getGuilds()
            getUnreads()
        }
    }, [state])

    useEffect(() => {
        if(notification.code === webSocketRoutes.SEND_MESSAGE) {
            const data = notification.data;
            const idx = DmGroupList.groups.findIndex(g => g.guild_id === data.channel_id);
            if(idx < 1) return;
            DmGroupList.dispatch(initDmGroup(changeElementPlaceArray(DmGroupList.groups, 0, idx)));
            DmGroupList.dispatch(modifyDmGroup({ guild_id: data.channel_id, content: data.content, created_at: data.created_at, message_id: data.message_id }))
        }
    }, [notification])
    
    return (
        <Stack.Navigator headerShown={'none'} >
            { state === "loading" ? <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen} /> 
                : state === "logout" ? <Stack.Screen name="LoginNavigator" component={LoginNavigator} options={{ headerShown: false }} />
                    : state === "loged" && (
                        <Stack.Group>     
                            <Stack.Screen name="Bottom" component={BottomNavigation} options={{ headerShown: false }} />
                            <Stack.Screen name="ProfileStack" component={ProfileStack} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
                            <Stack.Screen name="CreateStack" component={CreateStack} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
                            <Stack.Screen name="PostStack" component={PostStack} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
                            <Stack.Screen name="SettingStack" component={SettingsStack} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
                            <Stack.Screen name="MessagesStack" component={MessageStack} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }} />
                        </Stack.Group>
                    )
            }
            <Stack.Screen name="RegisterVerificationCode" options={{ headerShown: false }} component={VerificationCode} />
        </Stack.Navigator>
    )
}

export default Routes;