import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Keyboard, View } from 'react-native';
import { Text,  Button, Dialog, Portal, TextInput as PaperTextInput } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from 'react-native-toast-message';
import styles from '../../Style/style';

function AffiliationScreen() {

    const { t } = useTranslation();
    const { client, user } = useClient();
    const { colors } = useTheme();
    const [affiliation_code, setAffiliate] = useState("");
    const [myCode, setCode] = useState(" ");
    
    useEffect(() => {
        async function getData() {
            const request = await client.affiliation.fetch();
            if(request.error) return;
            setAffiliate(request.data?.affiliate_to ?? "")
            setCode(request.data?.my_code ?? " ")
        }

        getData()
    }, [])

    const registerAffiliate = async () => {
        if(affiliation_code.length < 3) return;
        const request = await client.affiliation.set(affiliation_code);
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
        Toast.show({ text1: t(`commons.success`)});
    }
    
    const generateCode  = async () => {
        const request = await client.affiliation.generate();
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
        Toast.show({ text1: t(`commons.success`)});
        setCode(request.data.code)
    }

    const deleteCode  = async () => {
        const request = await client.affiliation.delete();
        if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`)});
        Toast.show({ text1: t(`commons.success`)});
    }

    const copyCode = async () => {
        Clipboard.setString(myCode);
        Toast.show({ text1: t(`commons.success`)});
    }

    return (
        <SettingsContainer title={t("settings.affiliation")}>
            <PaperTextInput
                disabled
                style={{ margin: 10 }}
                label={`${t("settings.my_code")}`}
                autoCapitalize="none"
                value={myCode}
                right={<PaperTextInput.Icon onPress={() => {
                    myCode.length < 6 ? generateCode() : copyCode()
                }} icon={myCode.length < 6 ? "refresh" : "content-copy"} color={colors.text_normal} />}
            />
            <PaperTextInput
                style={{ margin: 10 }}
                label={`${t("settings.affiliation_code")}`}
                autoCapitalize="none"
                value={affiliation_code}
                right={<PaperTextInput.Icon disabled={affiliation_code.length < 3 && affiliation_code.length !== 0} onPress={() => {
                    Keyboard.dismiss()
                    if(affiliation_code.length === 0) return deleteCode()
                    else registerAffiliate()
                }} icon={"content-save"} color={colors.text_normal} />}
                onChangeText={(text) => setAffiliate(text)}
            />
        </SettingsContainer>
    )
}

export default AffiliationScreen;