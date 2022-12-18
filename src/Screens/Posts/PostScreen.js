import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addCommentTrends, initCommentTrends } from '../../Redux/commentFeed/action';

function PostScreen({ route }) {

    const { client } = useClient();
    const { post_id, informations } = route.params;
    const posts = useSelector((state) => state.commentFeed);
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        async function getData() {
            dispatch(initCommentTrends([]))
            const response = await client.post.comments(post_id);
            dispatch(initCommentTrends(response.data));
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
        dispatch(addCommentTrends(response.data));
        setLoader(false)
    }

    return (
        <PostContainer>
            <FlatList
                onTouchStart={() => bottomHandler()} 
                ListHeaderComponent={<DisplayPosts comments={true} informations={informations} />}
                data={posts} 
                renderItem={({ item, index }) => <DisplayPosts is_comment={true} key={index} informations={item} />} 
                keyExtractor={item => item.post_id} /> 
        </PostContainer>
    )
}

const mapStateToProps = (state) => {
    return {
      commentFeed: state.commentFeed,
    };
  };
  
const mapDispatchToProps = {
    addCommentTrends,
    initCommentTrends
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PostScreen);