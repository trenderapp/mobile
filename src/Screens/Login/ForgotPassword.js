import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native"
import { apibaseurl } from "../../Services/constante";
import { CustomHeader, useTheme } from "../../Components/Container";
import { NormalButton } from "../../Components/Elements/Buttons";
import { TextInput } from "../../Components/Elements/Input";
import { Text } from "react-native-paper";
import Loader from "../../Components/Loader";
import { EmailValidator } from "../../Services";

import styles from '../../Style/style';

function ForgotPassword() {

    const { t } = useTranslation('')
    const { colors } = useTheme();

    const [email, setEmail] = useState("")
    const [error, setError] = useState({
        error: false,
        response: ""
    });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleSubmit = async () => {
 
        if(loading) return;
        if(!EmailValidator(email)) return setError({ error: true, response: t(`errors.verify_fields`) });

        setLoading(true)

        const request = await fetch(`${apibaseurl}/users/me/recovery?type=password&query=${email}`, { method: "POST" });
        const response = await request.json();

        if(response.error){
            setLoading(false)
            return setError({ error: true, response: t(`errors.${response.error.code}`) })
      
          } else {
      
              setLoading(false)
              navigation.navigate('RegisterVerification', {
                email: email
              });
          }
      };

    return (
        <SafeAreaView style={{
            ...styles.mainBody,
            backgroundColor: colors.bg_primary
          }}>
            <CustomHeader title={"Forgot Password"} />
            <Loader loading={loading} />
            <KeyboardAwareScrollView style={{ marginTop: 30 }} resetScrollToCoords={{ x: 0, y: 0 }}>
                <View>
                    <View style={styles.SectionStyle}>
                        <Text style={{ color: colors.warning_color }}>{error.error && error.response}</Text>
                    </View>
                        <View style={styles.SectionStyle}>
                        <TextInput 
                            label={`${t("login.email")}`}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <NormalButton onPress={() => handleSubmit()} text={"Send recovery link"} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default ForgotPassword;