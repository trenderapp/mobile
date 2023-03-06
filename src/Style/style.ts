import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get("window");

export const full_width = Dimensions.get("window").width;
export const full_height = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    editContent: {
        backgroundColor: "red",
        height: "100%",
        width: "100%"
    },
    align_left: {
        textAlign: 'left'
    },
    text_title: {
        fontSize: 18
    },
    text_post: {
        padding: 10
    },
    modal: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        padding: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    full_image: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain'   
    },
    circleDiv: {
        position: "absolute",
        bottom: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 10
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
    },
    media_image: {
        width: width,
        height: 400,
    },
    banner_image: {
        width: width,
        height: "100%",
        ...StyleSheet.absoluteFillObject,
    },
    pdp33: {
        width: 33,
        height: 33,
        borderRadius: 60 / 2,
        marginRight: 5,
        resizeMode: "cover"
    },
    pdp64: {
        width: 64,
        height: 64,
        borderRadius: 60 / 2,
        resizeMode: "cover"
    },
    row: {
        flexDirection: "row",
        alignItems: 'center'
    },
    column: {
        flex: 1,
        flexDirection: "column"
    },
    Icon: {
        marginRight: 5,
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    SectionStyle: {
        flexDirection: 'column',
        minHeight: 60,
        marginTop: 5,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    EditSectionStyle: {
        flexDirection: 'column',
        minHeight: 60,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        margin: 10,
    },
    inputStyle: {
        paddingLeft: 15,
        paddingRight: 15
    },
    multilineInputStyle: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 100
    },
    errorTextStyle: {
        textAlign: 'center',
        fontSize: 14,
    },
    text_muted: {
        fontSize: 13
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 50
    },
    pined: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start"
    }
});

export default styles