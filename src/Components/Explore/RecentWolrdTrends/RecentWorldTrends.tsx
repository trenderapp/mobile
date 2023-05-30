import React, { useEffect, useMemo, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import { RefreshControl, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useClient, useTheme } from "../../Container";
import DisplayPosts from "../../Posts/DisplayPost";
import { addExploreRecentTrends, initExploreRecentTrends } from '../../../Redux/exploreWorldRecentTrends/action';
import { RootState, useAppDispatch, useAppSelector } from '../../../Redux';
import { PostInterface } from 'trender-client';
import { Loader } from '../../../Other';

function RecentWorldTrends() {

    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const posts = useAppSelector((state) => state.exploreWorldRecentTrends);
    const dispatch = useAppDispatch();
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [loader, setLoader] = useState(true);
    const [loaderF, setLoaderF] = useState(false);
    const isFocused = useIsFocused();

    async function getData(refresh: boolean = false) {
        if (refresh) {
            setLoaderF(true)
            if (loaderF) return;
        }
        const response = await client.explore.recentTrends({ locale: "all" });
        if (refresh) setLoaderF(false)
        else setLoader(false)
        if (response.error || !response.data) return;
        setPaginationKey(response?.pagination_key)
        dispatch(initExploreRecentTrends(response.data));
    }

    useEffect(() => {
        getData()
    }, [isFocused])

    const bottomHandler = async () => {
        setLoader(true)
        if(loader) return;
        const response = await client.explore.recentTrends({ pagination_key: pagination_key, locale: "all" });
        setLoader(false);    
        if(response.error || !response.data) return;    
        if(response.data.length < 1) return;
        setPaginationKey(response?.pagination_key);
        dispatch(addExploreRecentTrends(response.data));
      }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <FlatList
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("explore.no_trends_world_region_all_time")}</Text>}
            renderItem={memoizedValue}
            data={posts}
            ListFooterComponent={loader ? <Loader /> : undefined}
            onScrollEndDrag={() => bottomHandler()}
            keyExtractor={item => item.post_id}
            refreshControl={<RefreshControl refreshing={loaderF} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => getData(true)} />}
        />
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        exploreWorldRecentTrends: state.exploreWorldRecentTrends,
    };
};

const mapDispatchToProps = {
    addExploreRecentTrends,
    initExploreRecentTrends
};


export default connect(mapStateToProps, mapDispatchToProps)(RecentWorldTrends);