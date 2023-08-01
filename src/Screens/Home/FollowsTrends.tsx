import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { FlatList, RefreshControl } from 'react-native';
import { PostInterface } from 'trender-client';

import { useClient, useTheme } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addMainTrends, initMainTrends } from '../../Redux/mainFeed/action';
import { Loader } from '../../Other';
import EmptyHome from '../../Components/Home/EmptyHome';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';

const FollowsTrends = () => {
  const { client } = useClient();
  const { colors } = useTheme();
  const posts = useAppSelector((state) => state.mainFeed);
  const dispatch = useAppDispatch();
  const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
  const [loader, setLoader] = useState(true);
  const [loaderF, setLoaderF] = useState(false);

  async function getData(refresh: boolean = false) {
    if(refresh) {
      setLoaderF(true)
      if(loaderF) return;
    }
    const response = await client.post.fetch();
    if(refresh) setLoaderF(false)
    else setLoader(false)
    if(response.error || !response.data) return;
    dispatch(initMainTrends(response.data));
    if(response.pagination_key) setPaginationKey(response.pagination_key);
  }
  
  useEffect(() => {
    async function start() {
      getData()
    }
    start()
  }, [])

  const bottomHandler = async () => {
    setLoader(true)
    if(loader) return;
    const response = await client.post.fetch({ pagination_key: pagination_key });
    setLoader(false);    
    if(response.error || !response.data) return;    
    if(response.data.length < 1) return;
    if(response.pagination_key) setPaginationKey(response.pagination_key);
    dispatch(addMainTrends(response.data));
  }

  const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
    <DisplayPosts comments={false} informations={item} pined={undefined} is_comment={undefined} />
  ), [])

  const memoizedValue = useMemo(() => renderItem, [posts]);

  return (
    <FlatList
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
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    mainFeed: state.mainFeed,
  };
};

const mapDispatchToProps = {
  addMainTrends,
  initMainTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowsTrends);