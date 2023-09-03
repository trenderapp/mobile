import React, { Suspense, lazy, useState } from "react";
import { Divider, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { translateText } from "../../../Services";
const Renderer = lazy(() => import("./Markdown/Renderer"));

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    maxLine?: number,
    translate?: string,
    token?: string
}>

const Markdown: SectionProps = ({ content, noBr, maxLine, translate, token }) => {

    const [newText, setNewText] = useState<undefined | string>(undefined);
    const { t } = useTranslation();

    const setTranslation = async (to: string) => {
        if(!token) return;
        const txt = await translateText(token, {
            content: content,
            to: to
        });
        return setNewText(txt);
    }

    const DisplayMoreText = () => <Text>...<Text style={{ color: "#00B0F4" }}> {t("commons.see_more")}</Text></Text>;

    return (
        <>
            <Text style={{ fontSize: 15, }} onPress={undefined} selectable={true} numberOfLines={maxLine ? maxLine + 1 : undefined}>
                <Suspense fallback={content}>
                    <Renderer noBr={noBr ? false : true} maxLine={maxLine} content={maxLine ? `${content.slice(0, 150)}` : content} />
                </Suspense>
                {
                    maxLine ? content.split("\n").length > 5 ? <DisplayMoreText />
                                : content.length > 150 ? <DisplayMoreText />
                            : null
                        : null
                }
            </Text>
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