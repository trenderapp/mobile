import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addCommentTrends, initCommentTrends } from '../../Redux/commentFeed/action';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { PostInterface } from 'trender-client';

function PostScreen({ route }: any) {

    const { client } = useClient();
    const { post_id } = route.params;
    const posts = useAppSelector((state) => state.commentFeed);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [informations, setInformations] = useState<PostInterface.postResponseSchema>()

    async function getData() {
        dispatch(initCommentTrends([]))
        // Get post informations
        const post = await client.post.fetchOne(post_id);
        if(post?.error) return;
        setInformations(post?.data);
        // Get comments
        const response = await client.post.comments(post_id);
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;        
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initCommentTrends(response.data));
    }

    useEffect(() => {
        getData()
    }, [post_id])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)        
        const response = await client.post.comments(post_id, { pagination_key: pagination_key });
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        // dispatch(addCommentTrends(response.data));
        setLoader(false)
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <PostContainer title="posts.discussion">
            <FlatList
                ListHeaderComponent={informations ? <DisplayPosts comments={true} informations={informations} pined={undefined} is_comment={undefined} /> : <Loader />}
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
      commentFeed: state.commentFeed,
    };
  };
  
const mapDispatchToProps = {
    addCommentTrends,
    initCommentTrends
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PostScreen);