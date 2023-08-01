import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import { RefreshControl, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useClient, useTheme } from "../../Container";
import DisplayPosts from "../../Posts/DisplayPost";
import { addExploreRecentTrends, initExploreRecentTrends } from '../../../Redux/exploreRecentTrends/action';
import { RootState, useAppDispatch, useAppSelector } from '../../../Redux';
import { PostInterface } from 'trender-client';
import { Loader } from '../../../Other';

function RecentTrends() {
    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const posts = useAppSelector((state) => state.exploreRecentTrends);
    const dispatch = useAppDispatch();
    const [paginationKey, setPaginationKey] = useState<string | undefined>(undefined);
    const [loader, setLoader] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    const getData = async (refresh: boolean = false) => {
        if (refresh) {
            setRefreshing(true);
            if (loader || refreshing) return;
        }
        setLoader(true);
        const response = await client.explore.recentTrends();
        setLoader(false);
        setRefreshing(false);
        if (response.error || !response.data) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initExploreRecentTrends(response.data));
    }

    useEffect(() => {
        getData();
    }, [isFocused]);

    const bottomHandler = async () => {
        if (loader || refreshing) return;
        setLoader(true);
        const response = await client.explore.recentTrends({ pagination_key: paginationKey });
        setLoader(false);
        if (response.error || !response.data) return;
        if (response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(addExploreRecentTrends(response.data));
    };

    const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    ), []);

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <FlatList
            initialNumToRender={25}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("explore.no_trends_selected_region_all_time")}</Text>}
            renderItem={memoizedValue}
            data={posts}
            ListFooterComponent={loader ? <Loader /> : undefined}
            onScrollEndDrag={() => bottomHandler()}
            keyExtractor={item => item.post_id}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    progressBackgroundColor={colors.bg_primary}
                    tintColor={colors.fa_primary}
                    colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                    onRefresh={() => getData(true)}
                />
            }
        />
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        exploreRecentTrends: state.exploreRecentTrends,
    };
};

const mapDispatchToProps = {
    addExploreRecentTrends,
    initExploreRecentTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentTrends);
