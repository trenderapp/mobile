import { Appbar, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from '@react-navigation/drawer';

import useClient from "./Client/useClient";
import useTheme from "./Theme/useTheme";
import styles, { full_width } from '../../Style/style';
import { Avatar } from '../Member';
import { RootStackParamList } from '../../Services';

type SectionProps = React.FC<{
    isHome?: boolean,
    title?: JSX.Element | string,
    leftComponent?: JSX.Element
  }>

const CustomHeader: SectionProps = ({ title, isHome, leftComponent }) => {
    
    const { client, user } = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>>();
    
    return (
        <Appbar.Header elevated style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
                { !isHome ? navigation.canGoBack() ? <Appbar.BackAction onPress={() => navigation.goBack()} /> : null : (
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.openDrawer()}>
                        <Avatar marginLeft={5} marginRight={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
                    </TouchableOpacity>)}
                    { title && <Text style={{ fontSize: 16, fontWeight:'700', marginLeft: 5 }}>{title}</Text> }
            </View>
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