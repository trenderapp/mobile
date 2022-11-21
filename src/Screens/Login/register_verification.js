import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native";
import { useTheme } from "../../Components/Container";
import { Button, Text } from "react-native-paper";

import styles from '../../Style/style';

function RegisterVerification({ navigation, route }) {

    const { t } = useTranslation('')
    const { colors } = useTheme();
    const [email, setEmail] = useState("")

    useEffect(() => {
        setEmail(route?.params?.email ?? "")
    }, [])

    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary,
            alignItems: 'center'
        }}>
            <Text>{t("login.email_verif_link_send", {
                email: email
            })}</Text>
            <Button onPress={() => navigation.replace("Login")}>{t("commons.next")}</Button>
        </SafeAreaView>
    )
}

export default RegisterVerification;