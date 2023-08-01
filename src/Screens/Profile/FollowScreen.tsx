import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { useClient } from "../../Components/Container";
import { Text } from "react-native-paper";
import MemberList from "../../Components/Profile/MemberList";
import ProfileContainer from "../../Components/Container/ProfileContainer";

function FollowScreen({ route }: any) {

    const [info, setInfo] = useState<Array<any>>([]);
    const [loader, setLoader] = useState(true);
    const { client } = useClient();
    const { nickname, type } = route.params;
    const { t } = useTranslation();
    const [paginationKey, setPaginationKey] = useState<undefined | string>(undefined)

    async function getData() {
        setLoader(true);
        const response = type !== "subscriptions" ? await client.user.follow.followers(nickname) : await client.user.follow.follows(nickname);
        setLoader(false)
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if(!response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        setInfo(response.data);
        
    }

    useEffect(() => {
        getData()
    }, [nickname])

    const bottomHandler = async () => {
        setLoader(true)
        const response = type !== "subscriptions" ? await client.user.follow.followers(nickname, { pagination_key: paginationKey }) : await client.user.follow.follows(nickname, { pagination_key: paginationKey })
        setLoader(false)
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if(!response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        setInfo(info.concat(response.data));
    }


    return (
        <ProfileContainer username={t(`profile.${type}`)}>
            { !info ? <Text>{t("commons.nothing_display")}</Text> : <MemberList noDescription={true} onBottom={() => bottomHandler()} loader={loader} list={info} /> }
        </ProfileContainer>
    )
}

export default FollowScreen;