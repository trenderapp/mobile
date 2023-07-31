// import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import { BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useClient, useTheme } from "../Components/Container";
import { DmGroupListContext } from "../Context/DmGuildListContext";
import HomeScreen from "../Screens/Home/HomeScreen";
import GuildListScreen from "../Screens/Messages/GuildListScreen";
import SearchStack from "./Stacks/SearchStack";
import ExploreScreen from "../Screens/Explore/ExploreScreen";
import { useAppDispatch, useAppSelector } from "../Redux";
import { initNotificationFeed } from "../Redux/NotificationFeed/action";
import { connect } from "react-redux";


function BottomStack() {

    const { t } = useTranslation('');
    const { colors } = useTheme();
    const { client } = useClient();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notificationFeed);
    // const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(0);
    const { unreads, groups } = useContext(DmGroupListContext);
    const [routes, setRoutes] = useState([
        { key: 'home', focusedIcon: 'home', unfocusedIcon: "home-outline", title: t("commons.home"), badge: false },
        { key: 'users', focusedIcon: "account-multiple", title: t('commons.search'), badge: false },
        { key: 'explore', focusedIcon: "earth", unfocusedIcon: "earth", title: t('commons.notifications'), badge: false, labeled: false },
        { key: 'messages', focusedIcon: "message-text", unfocusedIcon: "message-text-outline", title: t('commons.messages'), badge: false, labeled: false },
    ]);

    const newBottom = ({
        home_notification = false,
        message_notification = false
    }) => {
        setRoutes([
            { key: 'home', focusedIcon: 'home', unfocusedIcon: "home-outline", title: t("commons.home"), badge: home_notification },
            { key: 'users', focusedIcon: "account-multiple", title: t('commons.search'), badge: false },
            { key: 'explore', focusedIcon: "earth", unfocusedIcon: "earth", title: t('commons.notifications'), badge: false, labeled: false },
            { key: 'messages', focusedIcon: "message-text", unfocusedIcon: "message-text-outline", title: t('commons.messages'), badge: message_notification, labeled: false },
        ])
    }

    const notificationList = async () => {
        const request = await client.notification.fetch();
        if(!request.data) return;
        if(request.data.length < 1) return;
        dispatch(initNotificationFeed(request.data));
      }

    const countNotifications = () => notifications.filter(n => n.readed === false || typeof n.readed === "undefined").length;
    const countUnreadsDM = () => {
        let i = 0;
        groups.forEach((g) => {
            if(g.last_message) {
                if(!unreads.some(u => u.message_id === g.last_message.message_id)) i++
            }
        })

        return i;
    }
    useEffect(() => {
        notificationList()
    }, [])

    useEffect(() => {
        newBottom({
            home_notification: countNotifications() > 0 ? countNotifications() : false,
            message_notification: countUnreadsDM() > 0 ? false : false
        })
    }, [notifications])

    const renderScene = BottomNavigation.SceneMap({
        home: HomeScreen,
        users: SearchStack,
        explore: ExploreScreen,
        messages: GuildListScreen
    });

    const theme = {
        colors: {
            text: colors.text_normal,
            primary: colors.bg_primary,
        },
    }

    return (
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
    )
}

const mapStateToProps = (state) => {
    return {
      notificationFeed: state.notificationFeed,
    };
  };
  
export default connect(mapStateToProps)(BottomStack);