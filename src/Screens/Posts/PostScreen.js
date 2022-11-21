import React, { useContext, useEffect, useState } from 'react';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { FlatList } from 'react-native';
import { addPosts, initPosts, PostsCommentsContextListContext } from '../../Context/PostsCommentsContext';

function PostScreen({ route }) {

    const { client } = useClient();
    const { post_id, informations } = route.params;
    const { posts, dispatch } = useContext(PostsCommentsContextListContext);
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        async function getData() {
            dispatch(initPosts([]))
            const response = await client.post.comments(post_id);
            dispatch(initPosts(response.data));
            setLoader(false)
        }
        
        getData()
    
    }, [post_id])

    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)
        const response = await client.post.comments(post_id, { skip: posts.length });
        if(response.error) return setError(response.error.code);
        if(response.data < 1) return setLoader(false);
        dispatch(addPosts(response.data));
        setLoader(false)
    }

    return (
        <PostContainer>
            <FlatList
                onTouchStart={() => bottomHandler()} 
                ListHeaderComponent={<DisplayPosts comments={true} informations={informations} />}
                data={posts} 
                renderItem={({ item, index }) => <DisplayPosts key={index} informations={item} />} 
                keyExtractor={item => item.post_id} /> 
        </PostContainer>
    )
}

export default PostScreen;