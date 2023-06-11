import React, { useEffect, useState, useContext, memo, useCallback } from 'react';
import { FlatList } from 'react-native';
import Toast from 'react-native-toast-message';

import { useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import ProfileComponent from '../../Components/Profile/Edit/ProfileComponents';
import ProfileNotFound from '../../Components/Profile/Edit/ProfileNotFound';
import ProfileContainer from '../../Components/Container/ProfileContainer';
import { Loader } from '../../Other';
import { ProfileContext } from '../../Context/AppContext';
import { useTranslation } from 'react-i18next';
import { PostInterface } from 'trender-client';

function ProfileScreen({ route }: any) {

    const { nickname } = route.params;
    const { client } = useClient();
    const { t } = useTranslation();
    const { profile, setProfile } = useContext(ProfileContext);
    const [posts, setPosts] = useState<PostInterface.postInterface[] | undefined>(undefined)
    const [pined, setPined] = useState<any>(null);
    const [loader, setLoader] = useState(true);
    const [loading, setLoading] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    const getData = async () => {
        setPosts(undefined)

        // Get profile infomations
        const response_profile = await client.user.profile(nickname);

        if (response_profile.error) {
            setLoading(false)
            setLoader(false)
            return setProfile(response_profile.error);
        }
        setProfile(response_profile.data);
        setLoading(false)

        const response = await client.post.user.fetch(nickname);

        setLoader(false)
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data) return;
        setPaginationKey(response.pagination_key);
        setPosts(response.data);

        if (response.data.length > 0) {
            if (!response.data[0]?.from?.pined_post) return;
            const pined_post = await client.post.getPinPost(response.data[0].from.pined_post);
            
            if (pined_post.error) return Toast.show({ text1: t(`errors.${pined_post.error.code}`) as string });
            setPined({
                from: response.data[0].from,
                ...pined_post.data
            })
        }
    }

    useEffect(() => {        
        if (profile?.nickname && nickname === profile.nickname) return;
        getData()
    }, [nickname])

    const bottomHandler = async () => {
        if (!loader) return;
        const response = await client.post.user.fetch(nickname, { pagination_key: pagination_key });
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data || response.data.length < 1) return setLoader(false);
        setPaginationKey(response.pagination_key);
        if(!posts) return;
        setPosts([...posts, ...response.data])
    }

    const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts informations={item} />
    ), [])

    return (
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
                        renderItem={renderItem}
                        keyExtractor={item => item.post_id} /> : <Loader />
            }
            {
                !loading && loader && <Loader />
            }
        </ProfileContainer>
    )
}


export default memo(ProfileScreen);