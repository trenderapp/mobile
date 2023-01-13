import React, { useEffect, useMemo, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl } from 'react-native';
import { PageContainer, useClient, useTheme } from '../../Components/Container';
import { Text } from 'react-native-paper';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addMainTrends, initMainTrends } from '../../Redux/mainFeed/action';
import { Loader } from '../../Other';
import { RealmContext } from '../../Services/Realm';
import { PostMainFeed } from '../../Services/Realm/postsMainFeed';
import EmptyHome from '../../Components/Home/EmptyHome';

const { useQuery } = RealmContext;

const HomeScreen = (navigation) => {
  
  const { client } = useClient();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const queryPosts = useQuery(PostMainFeed);
  const posts = useSelector((state) => state.mainFeed);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [loaderF, setLoaderF] = useState(false);
  const mainFeed = useMemo(() => queryPosts.length > 0 ? queryPosts.sorted("created_at") : false, [queryPosts])

  useEffect(() => {

    async function getData() {
        const response = await client.post.fetch();
        setLoader(false)
        dispatch(initMainTrends(response.data));
    }

    getData()
    
}, [])

  const bottomHandler = async () => {
    setLoader(true)
    if(loader) return;
    const response = await client.post.fetch({ skip: posts.length });
    setLoaderF(false);
    if(response.error) return;
    if(response.data < 1) return setLoader(false);
    dispatch(addMainTrends(response.data));
  }

  const refreshPosts = async () => {
    setLoaderF(true)
    if(loaderF) return;
    const response = await client.post.fetch({ skip: posts.length });
    setLoaderF(false)
    if(response.error) return;
    dispatch(initMainTrends(response.data));
  }

  const RenderItem = ({ item }) => (
    <DisplayPosts comments={false} informations={item} />
  )

  return (
    <PageContainer>
        <FlatList
          data={mainFeed}
          renderItem={({ item, index }) => <RenderItem key={index} item={item} />} 
          keyExtractor={item => item.post_id}
          ListFooterComponent={loader && <Loader />}
          onScrollEndDrag={() => bottomHandler()}
          ListEmptyComponent={<EmptyHome navigation={navigation} />}
          refreshControl={<RefreshControl refreshing={loaderF} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => refreshPosts()} />}
        />
    </PageContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    mainFeed: state.mainFeed,
  };
};

const mapDispatchToProps = {
  addMainTrends,
  initMainTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);