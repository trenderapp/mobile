import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl } from "react-native";
import Toast from 'react-native-toast-message';
import { DmGroupListContext, initDmGroup } from "../../Context/DmGuildListContext";
import { useClient, useTheme } from "../Container";
import { Text } from "react-native-paper";
import GroupInfo from "./GuildInfo";

function GuildList() {

    const { client } = useClient();
    const { groups, dispatch } = useContext(DmGroupListContext);
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    async function getData() {
        setLoading(true);
        const request = await client.guild.fetch();
        setLoading(false);
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
        dispatch(initDmGroup(request.data))
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

export default GuildList;