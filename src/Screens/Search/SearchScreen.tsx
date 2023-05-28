import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import SearchBar from 'react-native-dynamic-search-bar';
import { CustomHeader, useClient, useTheme } from "../../Components/Container";
import MemberList from "../../Components/Profile/MemberList";
import { userInfo } from "trender-client/Managers/Interfaces/Search";

function SearchScreen() {

    const { colors } = useTheme();
    const [text, setText] = useState("");
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const { t } = useTranslation();
    const { client } = useClient();
    const [users, setUsers] = useState<userInfo[] | undefined>(undefined);
    const [bestUsers, setBestUsers] = useState<userInfo[] | undefined>(undefined);
    const [loader, setLoader] = useState(true);

    async function getBestUsers() {
        setLoader(true)
        const response = await client.explore.bestUsers();
        setLoader(false)
        if (response.error || !response.data) return;
        setBestUsers(response.data);
        setPaginationKey(response?.pagination_key);
    }

    useEffect(() => {
        async function getData() {
            setLoader(true)
            const response = await client.user.search(text);
            setLoader(false)
            if (response.error || !response.data) return;
            setUsers(response.data);
            setPaginationKey(response?.pagination_key);
        }
        
        if (text?.length < 1) {
            getBestUsers()
            setUsers(undefined)
        }
        if (text?.length > 1) getData();
    }, [text])

    useEffect(() => {
        getBestUsers()
    }, [])
    

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader isHome={true}>
                <SearchBar
                    searchIconImageStyle={{
                        tintColor: colors.text_normal
                    }}
                    clearIconImageStyle={{
                        tintColor: colors.text_normal
                    }}
                    placeholderTextColor={colors.text_normal}
                    style={{
                        backgroundColor: colors.bg_secondary,
                        width: 320
                    }}
                    textInputStyle={{
                        color: colors.text_normal
                    }}
                    placeholder={t("commons.search") + " ..."}
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                    onClearPress={() => {
                        setText("")
                        setUsers(undefined)
                    }}
                />
            </CustomHeader>
            {users && users.length > 0 ? <MemberList noDescription={true} list={users} loader={loader} onBottom={undefined} /> : <MemberList noDescription={true} list={bestUsers} loader={loader} onBottom={undefined} /> }
        </View>
    )
}

export default SearchScreen;