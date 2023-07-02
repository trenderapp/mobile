import React, { Suspense, lazy } from "react";
import { Text } from "react-native-paper";
const Renderer = lazy(() => import("./Markdown/Renderer"));

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    maxLine?: number,
}>

const Markdown: SectionProps = ({ content, noBr, maxLine }) => {
    return (
        <>
            <Text numberOfLines={maxLine ? maxLine + 1 : undefined}>
                <Suspense fallback={content}>
                    <Renderer noBr={noBr ? false : true} maxLine={maxLine} content={content} />
                </Suspense>

            </Text>
            {
                content.split("\n").length > 5 && maxLine && <Text style={{ color: "#00B0F4" }}>See more</Text>
            }
        </>

    );
}

export default Markdown;