import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl } from 'react-native';
import { PageContainer, useClient, useTheme } from '../../Components/Container';
import { Text } from 'react-native-paper';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addPosts, initPosts, PostsListContext } from '../../Context/PostsContext';
import { Loader } from '../../Other';

const HomeScreen = () => {
  
  const { client } = useClient();
  const { t } = useTranslation()
  const { colors } = useTheme();
  const { posts, dispatch } = useContext(PostsListContext);
  const [loader, setLoader] = useState(true);
  const [loaderF, setLoaderF] = useState(false);

  useEffect(() => {

    async function getData() {
        const response = await client.post.fetch();
        setLoader(false)
        dispatch(initPosts(response.data));
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
    dispatch(addPosts(response.data));
  }

  const refreshPosts = async () => {
    setLoaderF(true)
    if(loaderF) return;
    const response = await client.post.fetch({ skip: posts.length });
    setLoaderF(false)
    if(response.error) return;
    dispatch(initPosts(response.data));
  }

  return (
    <PageContainer>
        <FlatList
          data={posts}
          renderItem={({ item, index }) => <DisplayPosts key={index} comments={false} informations={item} />} 
          keyExtractor={item => item.post_id}
          ListFooterComponent={loader && <Loader />}
          onScrollEndDrag={() => bottomHandler()}
          ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
          refreshControl={<RefreshControl refreshing={loaderF} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => refreshPosts()} />}
        />
    </PageContainer>
  );
};

export default HomeScreen;