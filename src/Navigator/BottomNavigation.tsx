// import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'

import { useClient, useTheme } from "../Components/Container";
import { DmGroupListContext } from "../Context/DmGuildListContext";
import HomeScreen from "../Screens/Home/HomeScreen";
import GuildListScreen from "../Screens/Messages/GuildListScreen";
import ExploreScreen from "../Screens/Explore/ExploreScreen";
import { RootState, useAppDispatch, useAppSelector } from "../Redux";
import { initNotificationFeed } from "../Redux/NotificationFeed/action";
import { connect } from "react-redux";
import SearchScreen from "../Screens/Search/SearchScreen";
import { BottomNavigation } from "react-native-paper";

function BottomStack() {

    const { t } = useTranslation('');
    const { colors } = useTheme();
    const { client } = useClient();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notificationFeed);
    const [index, setIndex] = useState(0);

    const { unreads, groups } = useContext(DmGroupListContext);
    const [routes, setRoutes] = useState([
        { key: 'home', focusedIcon: 'home', unfocusedIcon: "home-outline", title: t("commons.home"), badge: false, component: HomeScreen },
        { key: 'search', focusedIcon: "magnify", unfocusedIcon: "magnify", title: t('commons.search'), badge: false, component: SearchScreen },
        { key: 'explore', focusedIcon: "trending-up", unfocusedIcon: "trending-up", title: t('commons.explore'), badge: false, component: ExploreScreen },
        { key: 'messages', focusedIcon: "message-text", unfocusedIcon: "message-text-outline", title: t('commons.messages'), badge: false, component: GuildListScreen },
    ]);

    const newBottom = (params: {
        home_notification: boolean;
        message_notification: boolean;
    }) => {
        setRoutes([
            { key: 'home', focusedIcon: 'home', unfocusedIcon: "home-outline", title: t("commons.home"), badge: params.home_notification, component: HomeScreen },
            { key: 'search', focusedIcon: "magnify", unfocusedIcon: "magnify", title: t('commons.search'), badge: false, component: SearchScreen },
            { key: 'explore', focusedIcon: "trending-up", unfocusedIcon: "trending-up", title: t('commons.notifications'), badge: false, component: ExploreScreen },
            { key: 'messages', focusedIcon: "message-text", unfocusedIcon: "message-text-outline", title: t('commons.messages'), badge: params?.message_notification ?? false, component: GuildListScreen },
        ])
    }

    const notificationList = async () => {
        const request = await client.notification.fetch();
        if (!request.data) return;
        if (request.data.length < 1) return;
        dispatch(initNotificationFeed(request.data));
    }

    const countNotifications = () => notifications.filter(n => n.readed === false || typeof n.readed === "undefined").length;
    const countUnreadsDM = () => {
        let i = 0;
        groups.forEach((g: any) => {
            if (g.last_message) {
                if (!unreads.some((u: any) => u.message_id === g?.last_message?.message_id)) i++
            }
        })

        return i;
    }
    useEffect(() => {
        notificationList()
    }, [])

    useEffect(() => {
        newBottom({
            home_notification: countNotifications() > 0 ? true : false,
            message_notification: countUnreadsDM() > 0 ? false : false
        })
    }, [notifications])

    const renderScene = BottomNavigation.SceneMap({
        home: HomeScreen,
        search: SearchScreen,
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

const mapStateToProps = (state: RootState) => {
    return {
        notificationFeed: state.notificationFeed,
    };
};

export default connect(mapStateToProps)(BottomStack);