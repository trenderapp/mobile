import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import { BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProvider, useTheme } from "../Components/Container";
import { DmGroupListContext } from "../Context/DmGuildListContext";
import HomeScreen from "../Screens/Home/HomeScreen";
import GuildListScreen from "../Screens/Messages/GuildListScreen";
import FollowListScreen from "../Screens/Notifications/FollowListScreen";
import SearchStack from "./Stacks/SearchStack";

function BottomStack({ navigation }) {

    const { t } = useTranslation('');
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(0);
    const { unreads, groups } = useContext(DmGroupListContext);
    const [routes, setRoutes] = useState([
        { key: 'home', focusedIcon: 'home', unfocusedIcon: "home-outline", title: t("commons.home"), badge: false },
        { key: 'search', focusedIcon: "magnify", title: t('commons.search'), badge: false },
        { key: 'notifications', focusedIcon: "bell", unfocusedIcon: "bell-outline", title: t('commons.notifications'), badge: false, labeled: false },
        { key: 'messages', focusedIcon: "message-text", unfocusedIcon: "message-text-outline", title: t('commons.messages'), badge: false, labeled: false },
    ]);

    const newBottom = (badge = false) => {
        setRoutes([
            { key: 'home', focusedIcon: 'home', unfocusedIcon: "home-outline", title: t("commons.home"), badge: false },
            { key: 'search', focusedIcon: "magnify", title: t('commons.search'), badge: false },
            { key: 'notifications', focusedIcon: "bell", unfocusedIcon: "bell-outline", title: t('commons.notifications'), badge: false, labeled: false },
            { key: 'messages', focusedIcon: "message-text", unfocusedIcon: "message-text-outline", title: t('commons.messages'), badge: badge, labeled: false },
        ])
    }

    useEffect(() => {
        groups.forEach((g) => {
            if(g.last_message) {
                newBottom(!unreads.some(u => u.message_id === g.last_message.message_id))
            }
        })
    }, [unreads, groups, isFocused])

    const renderScene = BottomNavigation.SceneMap({
        home: HomeScreen,
        search: SearchStack,
        notifications: FollowListScreen,
        messages: GuildListScreen
    });

    const theme = {
        colors: {
            text: colors.text_normal,
            primary: colors.bg_primary,
        },
    }

    return (
        <NavigationProvider value={navigation}>
            <BottomNavigation
                safeAreaInsets={{ bottom: insets.bottom }}
                barStyle={{
                    borderTopColor: colors.text_normal,
                    borderTopWidth: 0.5
                }}
                labeled={false}
                theme={theme}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </NavigationProvider>
    )
}

export default BottomStack;