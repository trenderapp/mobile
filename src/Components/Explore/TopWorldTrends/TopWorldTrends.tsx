import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { connect } from 'react-redux';
import { useClient, useTheme } from "../../Container";
import DisplayPosts from "../../Posts/DisplayPost";
import { addExploreTopTrends, initExploreTopTrends } from '../../../Redux/exploreTopWorldTrends/action';
import { RootState, useAppDispatch, useAppSelector } from "../../../Redux";
import { PostInterface } from "trender-client";
import { Loader } from "../../../Other";

function TopWorldTrends() {

    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const posts = useAppSelector((state) => state.exploreTopWorldTrends);
    const dispatch = useAppDispatch();
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [loader, setLoader] = useState(true);
    const [loaderF, setLoaderF] = useState(false);

    async function getData(refresh: boolean = false) {
        if (refresh) {
            setLoaderF(true)
            if (loaderF) return;
        }
        const response = await client.explore.recentBestTrends({ locale: "all" });
        if (refresh) setLoaderF(false)
        else setLoader(false)
        if (response.error || !response.data) return;
        dispatch(initExploreTopTrends(response.data));
        setPaginationKey(response?.pagination_key)
    }

    useEffect(() => {
        getData()
    }, [])

    const bottomHandler = async () => {
        setLoader(true)
        if(loader) return;
        const response = await client.explore.recentBestTrends({ pagination_key: pagination_key, locale: "all" });
        setLoader(false);    
        if(response.error || !response.data) return;    
        if(response.data.length < 1) return;
        setPaginationKey(response?.pagination_key);
        dispatch(addExploreTopTrends(response.data));
      }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <FlatList
            onTouchStart={() => posts.length > 5 && bottomHandler()}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("explore.no_trends_world_region")}</Text>}
            data={posts}
            ListFooterComponent={loader ? <Loader /> : undefined}
            renderItem={memoizedValue}
            keyExtractor={item => item.post_id}
            refreshControl={<RefreshControl refreshing={loaderF} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => getData(true)} />}
        />
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        exploreTopWolrdTrends: state.exploreTopWorldTrends,
    };
};

const mapDispatchToProps = {
    addExploreTopTrends,
    initExploreTopTrends
};


export default connect(mapStateToProps, mapDispatchToProps)(TopWorldTrends);