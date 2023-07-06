import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PostInterface } from 'trender-client';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addPostShares, initPostShares } from '../../Redux/PostShares/action';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

function PostScreenShares({ route }: any) {

    const { client } = useClient();
    const { t } = useTranslation();
    const { post_id } = route.params;
    const posts = useAppSelector((state) => state.postShares);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    
    async function getData() {
        const response = await client.post.shares(post_id);
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;        
        setPaginationKey(response?.pagination_key);
        dispatch(initPostShares(response.data));
    }

    useEffect(() => {
        dispatch(initPostShares([]));
        getData()
    }, [post_id])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)        
        const response = await client.post.shares(post_id, { pagination_key: pagination_key });
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        setPaginationKey(response?.pagination_key);
        dispatch(addPostShares(response.data));
        setLoader(false)
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <PostContainer title="posts.shares">
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
    addPostShares,
    initPostShares
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PostScreenShares);