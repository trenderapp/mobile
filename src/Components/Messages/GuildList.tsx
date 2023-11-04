import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl } from "react-native";
import Toast from 'react-native-toast-message';
import { useClient, useTheme } from "../Container";
import { Text } from "react-native-paper";
import GroupInfo from "./GuildInfo";
import { connect } from "react-redux";
import { RootState, useAppDispatch, useAppSelector } from "../../Redux";
import { initGuildList, setUnreadGuildList } from "../../Redux/guildList/action";

function GuildList() {

    const { client } = useClient();
    const groups = useAppSelector((state) => state.guildListFeed);
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    async function getUnreads() {
        const request = await client.message.unreads();
        if (request.error || !request.data) return;
        dispatch(setUnreadGuildList(request.data))
    }

    async function getData() {
        setLoading(true);
        const request = await client.guild.fetch();
        setLoading(false);
        if(request.error || !request.data) return Toast.show({ text1: t(`errors.${request?.error?.code}`) as string});
        dispatch(initGuildList(request.data))
        await getUnreads()
    }
    
    return (
        <FlatList
            style={{
                height: "100%"
            }}
            data={groups}
            ListEmptyComponent={<Text>{t("commons.nothing_display")}</Text>}
            renderItem={({ item }) => <GroupInfo info={item} />}
            keyExtractor={item => item.guild_id}
            refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => getData()} />}
        />
    )
}

const mapStateToProps = (state: RootState) => {
    return {
      guildListFeed: state.guildListFeed,
    };
  };

const mapDispatchToProps = {
    initGuildList,
    setUnreadGuildList
};

export default connect(mapStateToProps, mapDispatchToProps)(GuildList);