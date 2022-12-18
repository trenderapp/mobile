import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import ProfileComponent from '../../Components/Profile/Edit/ProfileComponents';
import ProfileNotFound from '../../Components/Profile/Edit/ProfileNotFound';
import ProfileContainer from '../../Components/Container/ProfileContainer';
import { Loader } from '../../Other';
import { addProfileTrends, initProfileTrends } from '../../Redux/profileFeed/action';

function ProfileScreen({ route }) {

    const { nickname } = route.params;
    const { client } = useClient();
    const posts = useSelector((state) => state.profileFeed);
    const dispatch = useDispatch();
    const [pined, setPined] = useState(null);
    const [informations, setInfo] = useState(null);
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            dispatch(initProfileTrends([]))

            const response_profile = await client.user.profile(nickname);

            if(response_profile.error) {
                setLoading(false)
                setLoader(false)
                return setInfo(response_profile.error);
            }

            setInfo(response_profile.data);
            setLoading(false)

            const response = await client.post.user.fetch(nickname);

            setLoader(false)
            if(response.error) return setError(response.error.code);
            dispatch(initProfileTrends(response.data));

            if(response.data.length > 0) {
                if(!response.data[0]?.from?.pined_post) return;
                const pined_post = await client.post.getPinPost(response.data[0].from.pined_post);

                if(pined_post.error) return setError(pined_post.error.code);
                setPined({
                    from: response.data[0].from,
                    ...pined_post.data
                })
            }
        }
        if(informations?.nickname && nickname === informations.nickname) return;
        getData()
        
    }, [nickname])

    const bottomHandler = async () => {
        if(!loader) return;
        const response = await client.post.user.fetch(nickname, { skip: posts.length });
        if(response.error) return setError(response.error.code);
        if(response.data < 1) return setLoader(false);
        dispatch(addProfileTrends(response.data));
    }

    return(
        <ProfileContainer username={informations?.user_info?.username}>
        {
            !loading ? 
                <FlatList
                    onEndReached={() => bottomHandler()} 
                    ListHeaderComponent={informations ? informations?.code ? 
                        <ProfileNotFound error={informations} nickname={nickname} /> 
                            : <ProfileComponent setInfo={setInfo} pined={pined} informations={informations} nickname={nickname} /> 
                                : <Loader />}
                    data={posts}
                    renderItem={({ item, index }) => <DisplayPosts key={index} informations={item} />} 
                    keyExtractor={item => item.post_id} /> : <Loader />
        }
        {
            !loading && loader && <Loader />
        }
        </ProfileContainer>
    )
}

const mapStateToProps = (state) => {
    return {
      profileFeed: state.profileFeed,
    };
};
  
const mapDispatchToProps = {
    addProfileTrends,
    initProfileTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);