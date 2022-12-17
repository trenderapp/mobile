import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { useClient, useTheme } from "../../Container";
import DisplayPosts from "../../Posts/DisplayPost";
import { addPosts, initPosts, PostsTopTrendsContext, PostsTopTrendsContextProvider } from "./PostsTopTrendsContext";

function TopTrends() {

    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { posts, dispatch } = useContext(PostsTopTrendsContext);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        async function getData() {
            dispatch(initPosts([]))
            const response = await client.explore.recentBestTrends();
            if(response.error) return;
            dispatch(initPosts(response.data));
            setLoader(false)
        }
        
        getData()
    
    }, [])

    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)
        const response = await client.explore.recentBestTrends({ skip: posts.length });
        if(response.error) return setError(response.error.code);
        if(response.data < 1) return setLoader(false);
        dispatch(addPosts(response.data));
        setLoader(false)
    }

    return (
        <FlatList
            onTouchStart={() => posts.length > 5 && bottomHandler()}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("explore.no_trends_selected_region")}</Text>}
            data={posts} 
            renderItem={({ item, index }) => <DisplayPosts key={index} informations={item} />} 
            keyExtractor={item => item.post_id}
            refreshControl={<RefreshControl refreshing={loader} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => bottomHandler()} />}
            />
    )
}

export default TopTrends