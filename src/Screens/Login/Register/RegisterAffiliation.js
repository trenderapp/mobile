import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, SafeAreaView, } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from '../../../Style/style';
import Loader from '../../../Components/Loader';

import { useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { Logo } from '../../../Components/Elements/Assets';
import { axiosInstance } from '../../../Services';

const RegisterAffiliation = ({ navigation, route }) => {

    const { t } = useTranslation('')
    const { colors } = useTheme();
    const { params } = route;

    const [error, setError] = useState({
        error: false,
        response: ""
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState({
        ...params,
        affiliation_code: undefined
    });

    const handleSubmit = async () => {

        if (users.affiliation_code) {


            setLoading(true)

            const request = await axiosInstance.post(`/register/affiliation`, {
                affiliation_code: users?.affiliation_code
            })
            const response = request.data;

            if (response.error) {
                setLoading(false)
                return setError({ error: true, response: t(`errors.${response.error.code}`) })

            } else {
                setLoading(false)
                return navigation.push('RegisterBirthdayAccept', {
                    email: users.email,
                    username: users.username,
                    password: users.password,
                    affiliation_code: users?.affiliation_code
                });
            }
        }

        navigation.push('RegisterBirthdayAccept', {
            email: users.email,
            username: users.username,
            password: users.password,
            affiliation_code: undefined
        });
    }

    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary
        }}>
            <Loader loading={loading} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <Logo />
                        </View>
                        <View style={styles.SectionStyle}>
                            <Text style={{ color: colors.warning_color, textAlign: "center" }}>{error.error && error.response}</Text>
                        </View>
                        <View style={styles.SectionStyle}>
                            <PaperTextInput
                                label={`${t("login.affiliation_code")}`}
                                autoCapitalize="none"
                                returnKeyType="next"
                                value={users?.affiliation_code ?? ""}
                                onChangeText={(text) => setUsers({ ...users, affiliation_code: text })}
                            />
                        </View>
                        <NormalButton onPress={() => handleSubmit()} text={t("commons.next")} />
                        <View style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: "space-between"
                            }}>
                                <LinkButtonText text={t("login.go_back")} onPress={() => navigation.goBack()} />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};
export default RegisterAffiliation;