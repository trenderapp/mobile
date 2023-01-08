import React, { useEffect, useState } from "react";
import Svg, { G, Path } from "react-native-svg"
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../../Container";
import svgList from "./SvgList";

function SvgElement({ onPress = undefined, name, size = 33, margin, noColor }) {

    const { colors } = useTheme();
    const [svg, setSvg] = useState({
        w: 512,
        h: 512,
        d: [
            "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
        ]
    })

    useEffect(() => {
        const find_one = svgList.find(s => s.name === name)
        if (find_one) return setSvg(find_one);
    }, [name]);

    return (
        <>
            {
                onPress ? (
                    <TouchableOpacity style={{
                        marginRight: margin ? margin : 0,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 5,
                        borderRadius: 60 / 2
                    }} onPress={() => onPress()}>
                        <Svg width={size} height={size} viewBox={`0 0 ${svg.w} ${svg.h}`}>
                            <G fill={noColor ? "white" : colors.fa_primary} fillRule="nonzero">
                                {
                                    svg.d.map((path, index) =>
                                        <Path key={index} d={path} />
                                    )
                                }
                            </G>
                        </Svg>
                    </TouchableOpacity>) : (
                    <View style={{
                        marginRight: margin ? margin : 0,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 5,
                        borderRadius: 60 / 2
                    }}>
                        <Svg width={size} height={size} viewBox={`0 0 ${svg.w} ${svg.h}`}>
                            <G fill={noColor ? "white" : colors.fa_primary} fillRule="nonzero">
                                {
                                    svg.d.map((path, index) =>
                                        <Path key={index} d={path} />
                                    )
                                }
                            </G>
                        </Svg>
                    </View>
                )
            }
        </>
    )
}

export default SvgElement;