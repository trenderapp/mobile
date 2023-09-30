import React, { useEffect, useState, useContext, memo, useCallback } from 'react';
import { FlatList, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { PostInterface } from 'trender-client';
import { useNavigation as useNativeNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

import { useClient, useTheme } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import ProfileComponent from '../../Components/Profile/ProfileComponents';
import ProfileNotFound from '../../Components/Profile/Edit/ProfileNotFound';
import ProfileContainer from '../../Components/Container/ProfileContainer';
import { Loader } from '../../Other';
import { ProfileContext } from '../../Context/AppContext';
import { navigationProps } from '../../Services';
import styles, { full_width } from '../../Style/style';

function ProfileScreen({ route }: any) {

    const { nickname } = route.params;
    const { client } = useClient();
    const { colors } = useTheme();
    const naviteNavigation = useNativeNavigation<navigationProps>();
    const { t } = useTranslation();
    const { profile, setProfile } = useContext(ProfileContext);
    const [posts, setPosts] = useState<PostInterface.postInterface[]>([])
    const [pined, setPined] = useState<any>(null);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState(false);

    const getPosts = async () => {
        if (loader) return;
        setLoader(true);
        const response = await client.post.user.fetch(nickname, { pagination_key: pagination_key });
        setLoader(false);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        setPosts([...posts, ...response.data]);
    }

    const getData = async () => {
        setPosts([])
        await Promise.all([
            client.user.profile(nickname).then(async response_profile => {
                if (response_profile.error) {
                    setLoading(false)
                    setLoader(false)
                    return setProfile(response_profile.error);
                }
                setProfile(response_profile.data);
                setLoading(false)

                if (response_profile.data?.pined_post) {
                    const pined_post = await client.post.getPinPost(response_profile.data.pined_post);

                    if (pined_post.error) return Toast.show({ text1: t(`errors.${pined_post.error.code}`) as string });
                    setPined({
                        from: response_profile.data,
                        ...pined_post.data
                    })
                }
            }),
            getPosts()
        ])
    }

    useEffect(() => {
        if (profile?.nickname && nickname === profile.nickname) return;
        getData()
    }, [nickname])

    const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts informations={item} />
    ), [])

    const ProfileHeader = () => (
        <Animated.View style={[styles.row, { justifyContent: "space-between", width: full_width, backgroundColor: `${colors.bg_primary}` }]}>
            {naviteNavigation.canGoBack() && <IconButton icon="arrow-left" onPress={() => naviteNavigation.goBack()} />}
            <IconButton style={{ marginRight: 5 }} onPress={() => setModalVisible(true)} icon="dots-horizontal" />
        </Animated.View>
    )

    return (
        <ProfileContainer>
            {profile && <ProfileHeader />}
            {
                !loading ?
                    <FlatList
                        scrollEventThrottle={16}
                        onScrollEndDrag={() => getPosts()}
                        ListHeaderComponent={profile ? profile?.code ?
                            <ProfileNotFound error={profile} nickname={nickname} />
                            : <ProfileComponent modalVisible={modalVisible} setModalVisible={setModalVisible} pined={pined} informations={profile} nickname={nickname} setInfo={setProfile} />
                            : <Loader />}
                        data={posts}
                        renderItem={renderItem}
                        keyExtractor={item => item.post_id}
                        ListFooterComponent={!loading && loader && <Loader /> || undefined}
                    /> : <Loader />
            }
        </ProfileContainer>
    )
}


export default memo(ProfileScreen);