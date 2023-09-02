import React, { useContext } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { PostInterface } from "trender-client";
import { Markdown } from "../../Elements/Text";
import { SinglePostContext } from "../PostContext.js";
import Postheader from "./Components/Postheader";
import Carroussel from "./Components/Carroussel";
import VideoPlayer from "./Components/VideoPlayer";
import { useClient } from "../../Container";
import { useTranslation } from "react-i18next";

type PostNormalContext = {
    info: PostInterface.postResponseSchema & {
        is_comment?: boolean;
        is_share?: boolean;
        no_bottom?: boolean;
    },
}

function PostNormal({ maxLines }: { maxLines?: number }) {

    const { info }: PostNormalContext = useContext(SinglePostContext);
    const { client, token } = useClient();
    const { i18n } = useTranslation();

    const enableTranslation = (text_lang: string) => {
        if (i18n.language.startsWith(text_lang.toLocaleLowerCase())) return undefined;
        return i18n.language;
    }

    return (
        <View>
            <View style={{ paddingLeft: 5, paddingTop: 0 }}>
                {
                    info.display_not_allowed ?
                        <Button onPress={() => { }}>Subscribe to {info.from.username} to display</Button>
                        : <Markdown translate={info.content_language ? enableTranslation(info.content_language) : undefined} token={token} maxLine={maxLines} content={info.content} />
                }
            </View>
                {
                    info?.type ?
                        info.type === 1 ?
                            <Carroussel pictures={info.attachments} creator={undefined} changeList={undefined} />
                            : info.type === 2 ?
                                <VideoPlayer
                                    thumbnail={info.attachments[0]?.thumbnail ? client.post.file(info.from.user_id, info.post_id, info.attachments[0]?.thumbnail) : undefined}
                                    uri={client.post.file(info.from.user_id, info.post_id, encodeURIComponent(info.attachments[0]?.name))} attachments={undefined} />
                                : null : null
                }
        </View>
    )
}

export default PostNormal;