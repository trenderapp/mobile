import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, SafeAreaView, } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';

import styles from '../../../Style/style';

import { useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { Logo } from '../../../Components/Elements/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterPassword = ({ navigation, route }) => {

    const { t } = useTranslation('')
    const { colors } = useTheme();
    const [showPass, setShowPass] = useState(true);
    const { params } = route;

    const [error, setError] = useState({
        error: false,
        response: ""
    });

    const [users, setUsers] = useState({
        ...params,
        password: "",
        password2: ""
    });

    const handleSubmit = async () => {

        if (users.password !== users.password2) return setError({ error: true, response: t(`errors.different_password`)});
        if(users.password.length < 8) return setError({ error: true, response: t(`errors.password_security`) });

        navigation.push('RegisterAffiliation', {
            email: users.email,
            username: users.username,
            password: users.password
        });
    }

    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary
        }}>
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
                                label={`${t("login.password")}`}
                                autoCapitalize="none"
                                secureTextEntry={showPass}
                                returnKeyType="next"
                                right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off"} color={colors.text_normal} />}
                                value={users.password}
                                onChangeText={(password) => setUsers({ ...users, password: password })}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <PaperTextInput
                                label={`${t("login.repeat_password")}`}
                                autoCapitalize="none"
                                secureTextEntry={showPass}
                                returnKeyType="next"
                                right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off"} color={colors.text_normal} />}
                                value={users.password2}
                                onChangeText={(password) => setUsers({ ...users, password2: password })}
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
export default RegisterPassword;