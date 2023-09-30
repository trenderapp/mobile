import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { FlatList, RefreshControl, View, TouchableOpacity } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { PostInterface } from 'trender-client';

import { useClient, useNavigation, useTheme } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addMainTrends, initMainTrends } from '../../Redux/mainFeed/action';
import { Loader } from '../../Other';
import EmptyHome from '../../Components/Home/EmptyHome';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import CustomHomeHeader from './CustomHomeHeader';
import styles from '../../Style/style';

const FollowsTrends = () => {

  const posts = useAppSelector((state) => state.mainFeed);
  const notifications = useAppSelector((state) => state.notificationFeed);
  const dispatch = useAppDispatch();
  const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
  const [loader, setLoader] = useState(true);
  const [loaderF, setLoaderF] = useState(false);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { client } = useClient();

  async function getData(refresh: boolean = false) {
    if (refresh) {
      setLoaderF(true)
      if (loaderF) return;
    }
    const response = await client.post.fetch();
    if (refresh) setLoaderF(false)
    else setLoader(false)
    if (response.error || !response.data) return;
    dispatch(initMainTrends(response.data));
    if (response.pagination_key) setPaginationKey(response.pagination_key);
  }

  useEffect(() => {
    async function start() {
      getData()
    }
    start()
  }, [])

  const bottomHandler = async () => {
    setLoader(true)
    if (loader) return;
    const response = await client.post.fetch({ pagination_key: pagination_key });
    setLoader(false);
    if (response.error || !response.data) return;
    if (response.data.length < 1) return;
    if (response.pagination_key) setPaginationKey(response.pagination_key);
    dispatch(addMainTrends(response.data));
  }
  
  const flatListRef: any = useRef(undefined);

  const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
    <DisplayPosts comments={false} informations={item} pined={undefined} is_comment={undefined} />
  ), [])

  const memoizedValue = useMemo(() => renderItem, [posts]);

  const CustomLeftComponent = () => {
    return (
      <View style={[styles.row, { justifyContent: "flex-end", marginRight: 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")} style={{ position: "relative" }}>
          <Appbar.Action color={colors.text_normal} icon="bell" onPress={() => navigation.navigate("NotificationScreen")} />
          {notifications.filter(n => n.readed === false || typeof n.readed === "undefined").length > 0 && (
            <View style={{
              bottom: 5, right: 10, width: 20, height: 20, position: "absolute", backgroundColor: colors.badge_color, borderRadius: 60 / 2, flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text>{notifications.filter(n => n.readed === false || typeof n.readed === "undefined").length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Appbar.Action color={colors.text_normal} icon="pencil" onPress={() => navigation.navigate("CreateStack", {
          screen: "PostCreatorScreen",
          params: {
            attached_post_id: "",
            initFiles: [],
            initContent: ""
          }
        })} />
      </View>
    )
  }

  return (
    <>
      <CustomHomeHeader leftComponent={<CustomLeftComponent />} />
      <FAB
        icon="chevron-up"
        size='medium'
        color={colors.bg_primary}
        variant='primary'
        onPress={() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 })}
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 3,
          borderRadius: 60
        }}
      />
      <FlatList
        ref={flatListRef}
        removeClippedSubviews={true}
        initialNumToRender={20}
        data={posts}
        renderItem={memoizedValue}
        keyExtractor={item => item.post_id}
        ListFooterComponent={loader ? <Loader /> : undefined}
        onScrollEndDrag={() => bottomHandler()}
        ListEmptyComponent={<EmptyHome />}
        refreshControl={<RefreshControl refreshing={loaderF} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => getData(true)} />}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    mainFeed: state.mainFeed,
    notificationFeed: state.notificationFeed
  };
};

const mapDispatchToProps = {
  addMainTrends,
  initMainTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowsTrends);