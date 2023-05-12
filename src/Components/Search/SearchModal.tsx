import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import SearchBar from 'react-native-dynamic-search-bar';
import { CustomHeader, useClient, useTheme } from "../Container";
import MemberList from "../Profile/MemberList";
import { userInfo } from "trender-client/Managers/Interfaces/Search";

function SearchScreen() {

    const { colors } = useTheme();
    const [text, setText] = useState("");
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const { t } = useTranslation();
    const { client } = useClient();
    const [users, setUsers] = useState<userInfo[] | undefined>(undefined);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        async function getData() {
            setLoader(true)
            const response = await client.user.search(text, {
                pagination_key: pagination_key
            });
            setLoader(false)
            if (response.error || !response.data) return;
            setUsers(response.data);
            setPaginationKey(response?.pagination_key);
        }

        if (text?.length < 1) setUsers(undefined)
        if (text?.length > 1) getData();
    }, [text])

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <CustomHeader isHome={true} leftComponent={<SearchBar
                searchIconImageStyle={{
                    tintColor: colors.text_normal
                }}
                clearIconImageStyle={{
                    tintColor: colors.text_normal
                }}
                placeholderTextColor={colors.text_normal}
                style={{
                    backgroundColor: colors.bg_secondary,
                    width: 350
                }}
                textInputStyle={{
                    color: colors.text_normal
                }}
                placeholder={t("commons.search") + " ..."}
                onChangeText={(txt) => setText(txt)}
                value={text}
                onClearPress={() => {
                    setText(""),
                        setUsers(undefined)
                }}
            />} />
            {users && users.length > 0 && <MemberList list={users} loader={loader} onBottom={undefined} />}
            {typeof users === "undefined" && <Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
        </View>
    )
}

export default SearchScreen;