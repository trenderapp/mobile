import React, { useEffect, useMemo, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FlatList, RefreshControl } from 'react-native';
import { Dialog, Paragraph, Portal, Button } from 'react-native-paper';
import { PageContainer, useClient, useTheme } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addMainTrends, initMainTrends } from '../../Redux/mainFeed/action';
import { Loader } from '../../Other';
import EmptyHome from '../../Components/Home/EmptyHome';
import { getAppInfo, openURL, storeLink } from '../../Services';
import { useTranslation } from 'react-i18next';

const HomeScreen = (navigation) => {

  const { client } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const posts = useSelector((state) => state.mainFeed);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [loaderF, setLoaderF] = useState(false);
  const [updateRequire, setUpdateRequire] = useState(false);

  useEffect(() => {
    async function getData() {
      const update_require = await getAppInfo();
      if(update_require) return setUpdateRequire(true);
      const response = await client.post.fetch();
      setLoader(false)
      if(!response?.data) return;
      dispatch(initMainTrends(response.data));
    }
    getData()
  }, [])

  const bottomHandler = async () => {
    setLoader(true)
    if(loader) return;
    const response = await client.post.fetch({ skip: posts.length });
    setLoaderF(false);
    if(response.error || !response.data) return;
    if(response.data.length < 1) return setLoader(false);
    dispatch(addMainTrends(response.data));
  }

  const refreshPosts = async () => {
    setLoaderF(true)
    if(loaderF) return;
    const response = await client.post.fetch({ skip: posts.length });
    setLoaderF(false)
    if(response.error || !response.data) return;
    if(response.data.length < 1) return;
    dispatch(initMainTrends(response.data));
  }

  const renderItem = ({ item }) => (
    <DisplayPosts comments={false} informations={item} />
  )

  const memoizedValue = useMemo(() => renderItem, [posts]);

  return (
    <PageContainer>
      {updateRequire && (
        <Portal>
          <Dialog visible={true}>
            <Dialog.Title>{t("update.title")}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{t("update.paragraph_1")}</Paragraph>
              <Paragraph>{t("update.paragraph_2")}</Paragraph>
              <Paragraph>{t("update.paragraph_3")}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button uppercase={false} onPress={() => openURL(storeLink())}>{t("update.update")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      <FlatList
        removeClippedSubviews={true}
        initialNumToRender={15}
        data={posts}
        renderItem={memoizedValue}
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