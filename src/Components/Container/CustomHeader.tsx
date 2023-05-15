import { Appbar, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import useClient from "./Client/useClient";
import styles, { full_width } from '../../Style/style';
import { Avatar } from '../Member';
import { navigationProps } from '../../Services';

type SectionProps = React.FC<{
    isHome?: boolean,
    title?: JSX.Element | string,
    leftComponent?: JSX.Element,
    children?: JSX.Element
  }>

const CustomHeader: SectionProps = ({ title, isHome, leftComponent, children }) => {
    
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();
    
    return (
        <Appbar.Header elevated style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
                { !isHome ? navigation.canGoBack() ? <Appbar.BackAction onPress={() => navigation.goBack()} /> : null : (
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.openDrawer()}>
                        <Avatar marginLeft={5} marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
                    </TouchableOpacity>)}
                    { title && <Text style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{title}</Text> }
            </View>
            { children && children }
            {
                leftComponent ? leftComponent : (
                    <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    { // <Appbar.Action color={colors.text_normal} icon="qrcode-scan" onPress={() => console.log("qrcode")} />
                        // <Appbar.Action color={colors.text_normal} icon="bell" onPress={() => navigation.navigate("SettingsStack")} />
                    }
 
                </View>
                )
            }

        </Appbar.Header>
    )
}

export default CustomHeader;