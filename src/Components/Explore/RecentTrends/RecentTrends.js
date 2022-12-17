import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { useClient, useTheme } from "../../Container";
import DisplayPosts from "../../Posts/DisplayPost";
import { addPosts, initPosts, PostsRecentTrendsContext } from "./PostsRecentTrendsContext";

function RecentTrends() {

    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { posts, dispatch } = useContext(PostsRecentTrendsContext);
    const [loader, setLoader] = useState(true);
    const [loaderF, setLoaderF] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        async function getData() {
            dispatch(initPosts([]))
            const response = await client.explore.recentTrends();
            if(response.error) return;
            dispatch(initPosts(response.data));
            setLoader(false)
        }
        
        getData()
    
    }, [isFocused])

    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)
        const response = await client.explore.recentTrends({ skip: posts.length });
        if(response.error) return setError(response.error.code);
        if(response.data < 1) return setLoader(false);
        dispatch(addPosts(response.data));
        setLoader(false)
    }

    const refreshTrends = async () => {
        if(loaderF) return;
        setLoaderF(true);
        const response = await client.explore.recentTrends({ skip: posts.length });
        setLoaderF(false);
        if(response.error) return setError(response.error.code);
        dispatch(initPosts(response.data));
    }

    return (
        <FlatList
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("explore.no_trends_selected_region")}</Text>}
            data={posts} 
            onScrollEndDrag={() => bottomHandler()}
            renderItem={({ item, index }) => <DisplayPosts key={index} informations={item} />} 
            keyExtractor={item => item.post_id}
            refreshControl={<RefreshControl refreshing={loaderF} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => refreshTrends()} />}
        />
    )
}

export default RecentTrends