import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { PostInterface } from 'trender-client';
import Toast from 'react-native-toast-message';

import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { Loader } from '../../Other';
import { useTranslation } from 'react-i18next';

function PostScreen({ route }: any) {

    const { client } = useClient();
    const { post_id } = route.params;
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [informations, setInformations] = useState<PostInterface.postResponseSchema>()
    const [posts, setPosts] = useState<PostInterface.postResponseSchema[]>()
    const { t } = useTranslation();

    async function getData() {
        // Get post informations
        const post = await client.post.fetchOne(post_id);
        if(post?.error) return Toast.show({ text1: t(`errors.${post.error.code}`) as string });
        setInformations(post?.data);
        // Get comments
        const response = await client.post.comments(post_id);
        setLoader(false)
        if(response.error || !response.data) return Toast.show({ text1: t(`errors.${response?.error?.code}`) as string });
        if(response.data.length < 1) return;        
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        setPosts(response.data);
    }

    useEffect(() => {
        getData()
    }, [post_id])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true);  
        const response = await client.post.comments(post_id, { pagination_key: pagination_key });
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts original_post_user={informations?.from} comments={false} is_comment informations={item} />
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
  
export default PostScreen;