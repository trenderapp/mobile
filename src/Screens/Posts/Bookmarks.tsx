import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PostInterface } from 'trender-client';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addPostBookmarks, initPostBookmarks } from '../../Redux/Bookmarks/action';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

function Bookmarks({ route }: any) {

    const { client } = useClient();
    const { t } = useTranslation();
    const { target_id } = route.params;
    const posts = useAppSelector((state) => state.postBookmarks);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    
    async function getData() {
        const response = await client.post.getSavedPost(target_id);
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;        
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initPostBookmarks(response.data));
    }

    useEffect(() => {
        dispatch(initPostBookmarks([]));
        getData()
    }, [target_id])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)        
        const response = await client.post.getSavedPost(target_id, { pagination_key: pagination_key });
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(addPostBookmarks(response.data));
        setLoader(false)
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <PostContainer title="posts.bookmarks">
            <FlatList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                onScrollEndDrag={() => bottomHandler()}
                data={posts} 
                renderItem={memoizedValue}
                keyExtractor={item => item.post_id} />
        </PostContainer>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        postSearch: state.postShares,
    };
  };
  
const mapDispatchToProps = {
    addPostBookmarks,
    initPostBookmarks
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Bookmarks);