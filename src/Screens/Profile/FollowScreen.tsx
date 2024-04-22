import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { Text } from "react-native-paper";
import { CustomHeader, useClient, useTheme, useNavigation } from "../../Components/Container";
import ProfileContainer from "../../Components/Container/ProfileContainer";
import { FollowInterface, userFlags } from "trender-client";
import UserPermissions from "trender-client/Permissions/UserPermissions";
import { Avatar } from "../../Components/Member";
import SvgElement from "../../Components/Elements/Svg";
import styles from "../../Style/style";

function FollowScreen({ route }: any) {

    const [info, setInfo] = useState<Array<FollowInterface.followInformationsResponse>>([]);
    const [loader, setLoader] = useState(true);
    const { client } = useClient();
    const { colors } = useTheme();
    const { nickname, type } = route.params;
    const { t } = useTranslation();
    const [paginationKey, setPaginationKey] = useState<undefined | string>(undefined);
    const navigation = useNavigation();

    async function getData() {
        setLoader(true);
        const response = type !== "subscriptions" ? await client.user.follow.followers(nickname) : await client.user.follow.follows(nickname);
        setLoader(false)
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        setInfo(response.data);

    }

    useEffect(() => {
        getData()
    }, [nickname])

    const bottomHandler = async () => {
        setLoader(true)
        const response = type !== "subscriptions" ? await client.user.follow.followers(nickname, { pagination_key: paginationKey }) : await client.user.follow.follows(nickname, { pagination_key: paginationKey })
        setLoader(false)
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data) return;
        if (response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        setInfo([...info, ...response.data])
    }

    const renderItem = useCallback(({ item }: { item: FollowInterface.followInformationsResponse, index?: number }) => {

        const flags = new UserPermissions(item?.flags);

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.push('ProfileStack', {
                    screen: "ProfileScreen",
                    params: {
                        nickname: item.nickname
                    }
                })}
                style={[
                    styles.row,
                    {
                        backgroundColor: colors.bg_secondary,
                        borderRadius: 12,
                        padding: 10,
                        margin: 5
                    }
                ]}>
                { /** typeof index !== "undefined" ? <View style={{ backgroundColor: colors.bg_primary, borderRadius: 60, marginRight: 5, width: 30, height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Text>{`${index+1}`}</Text></View> : null */}
                <Avatar size={33} url={client.user.avatar(item.user_id, item.avatar)} />
                <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{item.username}</Text>
                {item.is_private && <SvgElement margin={-5} size={15} name="lock" color={colors.text_normal} />}
                {flags.has(userFlags.VERIFIED_USER) && <SvgElement name="verified" size={15} />}
            </TouchableOpacity>
        )
    }, [])

    return (
        <ProfileContainer>
            <CustomHeader title={t(`profile.${type}`) as string} />
            {!info ? <Text>{t("commons.nothing_display")}</Text> : (
                <FlatList
                    data={info}
                    keyExtractor={(item) => item.user_id}
                    renderItem={renderItem}
                    refreshControl={(<RefreshControl
                        refreshing={loader}
                        progressBackgroundColor={colors.bg_primary}
                        tintColor={colors.fa_primary}
                        colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                        onRefresh={() => getData()}/>
                    )}
                    onScrollEndDrag={() => bottomHandler()}
                    />
                        
            )
        }
        </ProfileContainer>
    )
}

export default FollowScreen;