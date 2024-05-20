import React, { Suspense, lazy, useCallback, useState } from "react";
import { Divider, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { translateText } from "../../../Services";
import { NativeSyntheticEvent, StyleProp, TextLayoutEventData, TextStyle } from "react-native";
const Renderer = lazy(() => import("./Markdown/Renderer"));

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    maxLine?: number,
    translate?: string,
    token?: string,
    style?: StyleProp<TextStyle>
}>

const Markdown: SectionProps = ({ content, noBr, maxLine, translate, token, style }) => {

    const [newText, setNewText] = useState<undefined | string>(undefined);
    const [lengthMore, setLengthMore] = useState<boolean | undefined>(false);
    const { t } = useTranslation();

    const setTranslation = async (to: string) => {
        if (!token) return;
        const txt = await translateText(token, {
            content: content,
            to: to
        });
        return setNewText(txt);
    }

    const onTextLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
        maxLine && setLengthMore(e.nativeEvent.lines.length > maxLine); //to check the text is more than 5 lines or not
    }, []);

    const DisplayMoreText = () => <Text style={{ color: "#00B0F4" }}> {t("commons.see_more")}</Text>;

    return (
        <>
            <Text onTextLayout={onTextLayout} style={[style, { fontSize: 15 }]} onPress={undefined} selectable={true} numberOfLines={maxLine ? maxLine : undefined}>
                <Suspense fallback={content}>
                    <Renderer noBr={noBr ? false : true} content={maxLine ? `${content.slice(0, 150).trim()}` : content.trim()} />
                </Suspense>
            </Text>
            {
                maxLine ? lengthMore ? <DisplayMoreText />
                    : content.length > 150 ? <DisplayMoreText />
                        : null
                    : null
            }
            {
                !maxLine && !newText && translate && <Text onPress={() => setTranslation(translate)} style={{ color: "#00B0F4" }}>{t("commons.translate")}</Text>
            }
            {
                newText && (
                    <>
                        <Text onPress={() => setNewText(undefined)} style={{ color: "#00B0F4" }}>{t("commons.translated_with")} <Text>Google</Text></Text>
                        <Divider bold horizontalInset />
                        <Text style={{ fontSize: 15 }} onPress={undefined} selectable={true}>
                            <Suspense fallback={content}>
                                <Renderer noBr={noBr ? false : true} content={newText} />
                            </Suspense>
                        </Text>
                    </>
                )
            }
        </>

    );
}

export default Markdown;