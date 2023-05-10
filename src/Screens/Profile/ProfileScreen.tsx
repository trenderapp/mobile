import React, { useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import ProfileComponent from '../../Components/Profile/Edit/ProfileComponents';
import ProfileNotFound from '../../Components/Profile/Edit/ProfileNotFound';
import ProfileContainer from '../../Components/Container/ProfileContainer';
import { Loader } from '../../Other';
import { addProfileTrends, initProfileTrends } from '../../Redux/profileFeed/action';
import { ProfileContext } from '../../Context/AppContext';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { useTranslation } from 'react-i18next';

function ProfileScreen({ route }: any) {

    const { nickname } = route.params;
    const { client } = useClient();
    const { t } = useTranslation();
    const { profile, setProfile } = useContext(ProfileContext);
    const posts = useAppSelector((state) => state.profileFeed);
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const [pined, setPined] = useState<any>(null);
    const [loader, setLoader] = useState(true);
    const [loading, setLoading] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function getData() {
            dispatch(initProfileTrends([]))

            // Get profile infomations
            const response_profile = await client.user.profile(nickname);

            if(response_profile.error) {
                setLoading(false)
                setLoader(false)
                return setProfile(response_profile.error);
            }
            setProfile(response_profile.data);
            setLoading(false)

            const response = await client.post.user.fetch(nickname);

            setLoader(false)
            if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
            if(!response.data) return;
            setPaginationKey(response.pagination_key);
            dispatch(initProfileTrends(response.data));

            if(response.data.length > 0) {
                if(!response.data[0]?.from?.pined_post) return;
                const pined_post = await client.post.getPinPost(response.data[0].from.pined_post);

                if(pined_post.error) return Toast.show({ text1: t(`errors.${pined_post.error.code}`) as string });
                setPined({
                    from: response.data[0].from,
                    ...pined_post.data
                })
            }
        }
        if(profile?.nickname && nickname === profile.nickname) return;
        getData()
        
    }, [nickname, isFocused])

    const bottomHandler = async () => {
        if(!loader) return;
        const response = await client.post.user.fetch(nickname, { pagination_key: pagination_key });
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if(!response.data || response.data.length < 1) return setLoader(false);
        setPaginationKey(response.pagination_key);
        dispatch(addProfileTrends(response.data));
    }

    return(
        <ProfileContainer username={profile?.user_info?.username}>
        {
            !loading ? 
                <FlatList
                    onEndReached={() => bottomHandler()} 
                    ListHeaderComponent={profile ? profile?.code ? 
                        <ProfileNotFound error={profile} nickname={nickname} /> 
                            : <ProfileComponent setInfo={setProfile} pined={pined} informations={profile} nickname={nickname} /> 
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

const mapStateToProps = (state: RootState) => {
    return {
      profileFeed: state.profileFeed,
    };
};
  
const mapDispatchToProps = {
    addProfileTrends,
    initProfileTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);