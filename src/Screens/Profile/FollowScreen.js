import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClient } from "../../Components/Container";
import { Text } from "react-native-paper";
import MemberList from "../../Components/Profile/MemberList";
import ProfileContainer from "../../Components/Container/ProfileContainer";

function FollowScreen({ route }) {

    const [info, setInfo] = useState([]);
    const [loader, setLoader] = useState(true);
    const { client } = useClient();
    const { nickname, type } = route.params;
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            setLoader(true);
            const response = type !== "subscriptions" ? await client.user.follow.followers(nickname) : await client.user.follow.follows(nickname);
            setLoader(false)
            if(response.error) return;
            if(response.data.length > 0) return setInfo(response.data);
            setInfo(null)
            
        }

        getData()
    }, [nickname])

    const bottomHandler = async () => {
        setLoader(true)
        const response = type !== "subscriptions" ? await client.user.follow.followers(nickname, { skip: info.length }) : await client.user.follow.follows(nickname, { skip: info.length })
        setLoader(false)
        if(response.error) return setError(response.error.code);
        if(response.data.length > 0) return setInfo(info.concat(response.data));
    }


    return (
        <ProfileContainer username={t(`profile.${type}`)}>
            { !info ? <Text>{t("commons.nothing_display")}</Text> : <MemberList onBottom={() => bottomHandler()} loader={loader} list={info} /> }
        </ProfileContainer>
    )
}

export default FollowScreen;