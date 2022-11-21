import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, SafeAreaView,  } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';

import styles from '../../../Style/style';

import Loader from '../../../Components/Loader';
import { useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { Logo } from '../../../Components/Elements/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { axiosInstance, EmailValidator } from '../../../Services';

const RegisterEmailUsername = ({ navigation }) => {

  const { t } = useTranslation('')
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    error: false,
    response: ""
  });

  const [users, setUsers] = useState({
    email: "",
    username: "",
  });

  const handleSubmit = async () => {

    if(loading) return setError({ error: true, response: t(`errors.sending_form`) })

    if(!users.email || !users.username) return setError({ error: true, response: t(`errors.verify_fields`) });

    if(!EmailValidator(users.email) || users.username.length > 30 || users.username.length < 3 ) return setError({ error: true, response: t(`errors.verify_fields`) });
    
      setLoading(true)
  
      const request = await axiosInstance.post(`/register/email`, {
        email: users.email.toLowerCase()
      })
      const response = request.data;

      if(response.error){
        setLoading(false)
        return setError({ error: true, response: t(`errors.${response.error.code}`) })
  
      } else {
          setLoading(false)
          navigation.push('RegisterPassword', {
            email: users.email,
            username: users.username
          });
      }
};

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
                label={`${t("login.email")}`}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={users.email}
                onChangeText={(email) => setUsers({ ...users, email: email })}
              />
            </View>
            <View style={styles.SectionStyle}>
              <PaperTextInput
                label={`${t("login.username")}`}
                autoCapitalize="none"
                returnKeyType="next"
                value={users.username}
                onChangeText={(text) => setUsers({ ...users, username: text })}
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
              <LinkButtonText text={t("login.already_account")} onPress={() => navigation.replace("Login")} />
            </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default RegisterEmailUsername;