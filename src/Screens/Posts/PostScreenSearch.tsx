import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addPostSearch, initPostSearch } from '../../Redux/PostSearch/action';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { PostInterface } from 'trender-client';

function PostScreenSearch({ route }: any) {

    const { client } = useClient();
    const { query } = route.params;
    const posts = useAppSelector((state) => state.postSearch);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    
    async function getData() {
        const response = await client.post.search({ query:query });
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;        
        setPaginationKey(response?.pagination_key);
        dispatch(initPostSearch(response.data));
    }

    useEffect(() => {
        dispatch(initPostSearch([]));
        getData()
    }, [query])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)        
        const response = await client.post.search({ query:query, pagination_key: pagination_key });
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        setPaginationKey(response?.pagination_key);
        dispatch(addPostSearch(response.data));
        setLoader(false)
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <PostContainer title="commons.search">
            <FlatList
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
        postSearch: state.postSearch,
    };
  };
  
const mapDispatchToProps = {
    addPostSearch,
    initPostSearch
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PostScreenSearch);