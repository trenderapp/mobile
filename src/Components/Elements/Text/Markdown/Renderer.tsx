import React, { useContext } from "react";
import { Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

import { emojies_defs } from "./emojis";
import Br from "../Br";
import { useTheme } from "../../../Container";
import { navigationProps, openURL } from "../../../../Services";
import { SinglePostContext } from "../../../Posts/PostContext.js";
import { UserInterface } from "trender-client";

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    maxLine?: number,
}>

const RE_TWEMOJI = /:(\w+):/gi;

// ! FIXME: Move to library
const RE_HASHTAG = /#(.*)/gi;
const RE_BR = /\n/g;

// export const RE_MENTIONS = /<@([A-z0-9]{26})>/g;
export const RE_MENTIONS = /@[A-z0-9]{1,33}/gi;
export const RE_LINKS = /(https?:\/\/[^\s]+)/gi;

const Renderer: SectionProps = ({ content, noBr, maxLine }) => {

    const ctx = useContext(SinglePostContext);
    const info = ctx?.info;

    if (typeof content === "undefined") return null;
    if (content.length === 0) return null;

    const navigation = useNavigation<navigationProps>();
    const { colors } = useTheme();

    const enter = content.split("\n");

    return (
        <Text numberOfLines={maxLine}>
            {
                enter.map((text, idx) =>
                    <Text key={idx}>{noBr && "\n"}{text.trim().split(" ").map((text, idx) => {

                        if (RE_LINKS.test(text)) return <Text key={idx} onPress={() => openURL(text)} style={{ color: colors.text_link }}>{text} </Text>
                        if (RE_HASHTAG.test(text)) return <Text key={idx} onPress={() => navigation?.navigate("PostStack", {
                            screen: "PostScreenSearch",
                            params: {
                                query: text
                            }
                        })} style={{ color: colors.text_link }}>{text} </Text>
                        if (RE_MENTIONS.test(text)) {
                            const nickname = text.replace(/@/g, "");
                            RE_MENTIONS.test(text)

                            if (info?.mentions.length < 1) return <Text key={idx}>{text} </Text>;

                            const find = info?.mentions.find((m: UserInterface.userInfo) => m.nickname === nickname);
                            if (!find) return <Text key={idx}>{text} </Text>;

                            return <Text key={idx} onPress={() => navigation?.navigate("ProfileStack", {
                                screen: "ProfileScreen",
                                params: {
                                    nickname: find.nickname
                                }
                            })} style={{ color: colors.text_link }}>{find.username} </Text>;
                        }
                        if (RE_TWEMOJI.test(text)) {
                            const sub = text.replace(/:/g, "")
                            if (!sub) return <Text key={idx} >{text} </Text>
                            return <Text key={idx} >{emojies_defs[sub]} </Text>
                        }
                        return <Text key={idx}>{text} </Text>
                    })}</Text>
                )
            }
        </Text>
    )
}

export default Renderer;