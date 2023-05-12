import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import notifee from "@notifee/react-native";
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { webSocketRoutes } from 'trender-client';
import messaging from "@react-native-firebase/messaging";

import { LoginNavigator, SplashScreen } from './Navigator';
import { useClient, useWebSocket } from './Components/Container';
import { DmGroupListContext, initDmGroup, modifyDmGroup } from './Context/DmGuildListContext';
import { changeElementPlaceArray, parseURL } from './Services';
import { requestNotificationPermission } from './Services/notifications';
import VerificationCode from './Screens/Login/Verify/VerificationCode';

import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import DrawerNavigation from './Components/Container/DrawerNavigation';

const Stack = createStackNavigator();

function Routes() {

    const { state, client } = useClient();
    const { i18n } = useTranslation();
    const { notification } = useWebSocket();
    const DmGroupList = useContext(DmGroupListContext);
    const navigation = useNavigation();
    const [routes] = useState([
        { name: "DrawerNavigation", screen: DrawerNavigation},
        /*{ name: "ProfileStack", screen: ProfileStack},
        { name: "CreateStack", screen: CreateStack},
        { name: "PostStack", screen: PostStack},
        { name: "SettingsStack", screen: SettingsStack},
        { name: "MessagesStack", screen: MessageStack}*/
    ])

    async function getGuilds() {
        const request = await client.guild.fetch();
        if (request.error) return;
        DmGroupList.dispatch(initDmGroup(request.data));
    }

    async function getUnreads() {
        const request = await client.message.unreads();
        if (request.error) return;
        DmGroupList.setUnreads(request.data);
    }

    useEffect(() => {
        dayjs.locale(i18n.language);

        notifee.setBadgeCount(0);
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();
            if (!initialUrl) return;

            const [param] = parseURL(initialUrl);
            if (param.startsWith("/register/verify")) return navigation.navigate("RegisterVerificationCode", {
                code: param.split("/register/verify").slice(1)[0].replace("/", "")
            });
        };

        getUrlAsync();

    }, [])

    const registerFCMToken = async () => {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) await client.pushNotification.register(fcmToken);
        return;
    }

    useEffect(() => {
        if (state === "loged") {
            registerFCMToken()
            messaging().onTokenRefresh(async token => {
                await client.pushNotification.register(token);
            });
            getGuilds()
            getUnreads()
        }
    }, [state])

    useEffect(() => {
        if (notification.code === webSocketRoutes.SEND_MESSAGE) {
            const data = notification.data;
            const idx = DmGroupList.groups.findIndex(g => g.guild_id === data.channel_id);
            if (idx < 1) return;
            DmGroupList.dispatch(initDmGroup(changeElementPlaceArray(DmGroupList.groups, 0, idx)));
            DmGroupList.dispatch(modifyDmGroup({ guild_id: data.channel_id, content: data.content, created_at: data.created_at, message_id: data.message_id }))
        }
    }, [notification])

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            {state === "loading" ? <Stack.Screen name="Splash" component={SplashScreen} />
                : state === "logout" ? <Stack.Screen name="LoginNavigator" component={LoginNavigator} />
                    : state === "loged" && (
                        <Stack.Group>
                            {
                                routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
                                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                                }} />)
                            }
                        </Stack.Group>
                    )
            }
            <Stack.Screen name="RegisterVerificationCode" options={{ headerShown: false }} component={VerificationCode} />
        </Stack.Navigator>
    )
}

export default Routes;