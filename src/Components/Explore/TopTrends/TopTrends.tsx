import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { connect } from 'react-redux';
import { useClient, useTheme } from "../../Container";
import DisplayPosts from "../../Posts/DisplayPost";
import { addExploreTopTrends, initExploreTopTrends } from '../../../Redux/exploreTopTrends/action';
import { RootState, useAppDispatch, useAppSelector } from "../../../Redux";
import { PostInterface } from "trender-client";
import { Loader } from "../../../Other";

function TopTrends() {
    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const posts = useAppSelector((state) => state.exploreTopTrends);
    const dispatch = useAppDispatch();
    const [paginationKey, setPaginationKey] = useState<string | undefined>(undefined);
    const [loader, setLoader] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const list = useRef<FlatList<PostInterface.postResponseSchema>>(null);

    const goTopList = () => {
        list.current && list.current.scrollToEnd({ animated: true });
    }

    const getData = async (refresh: boolean = false) => {
        if (refresh) {
            setRefreshing(true);
            if (loader || refreshing) return;
        }
        setLoader(true);
        const response = await client.explore.recentBestTrends();
        setLoader(false);
        setRefreshing(false);
        if (response.error || !response.data) return;
        dispatch(initExploreTopTrends(response.data));
        setPaginationKey(response.pagination_key);
    };

    useEffect(() => {
        getData();
    }, []);

    const bottomHandler = async () => {
        if (loader || refreshing) return;
        setLoader(true);
        const response = await client.explore.recentBestTrends({ pagination_key: paginationKey });
        setLoader(false);
        if (response.error || !response.data) return;
        if (response.data.length < 1) return;
        setPaginationKey(response.pagination_key);
        dispatch(addExploreTopTrends(response.data));
    };

    const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    ), []);

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <FlatList
            initialNumToRender={25}
            ref={list}
            removeClippedSubviews={true}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("explore.no_trends_selected_region")}</Text>}
            data={posts}
            ListFooterComponent={loader ? <Loader /> : undefined}
            renderItem={memoizedValue}
            keyExtractor={item => item.post_id}
            onScrollEndDrag={() => bottomHandler()}
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
        exploreTopTrends: state.exploreTopTrends,
    };
};

const mapDispatchToProps = {
    addExploreTopTrends,
    initExploreTopTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(TopTrends);
