import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import Toast from 'react-native-toast-message';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";

import { useNavigation } from '../../Components/Container';
import SvgElement from '../../Components/Elements/Svg';
import { full_height, full_width } from '../../Style/style';
import { useTranslation } from 'react-i18next';


export default function DisplayRenderScreen({ route: { params }}) {
  
  const { type, info } = params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0)
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [file, setFile] = useState(info);
  
  useEffect(() => {
    info && setFile(info)
  }, [info])

  const downloadFile = async () => {
    if(Platform.OS === "android") {
      const camera = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if(camera !== RESULTS.GRANTED || camera !== RESULTS.LIMITED) await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);  
    }

    await CameraRoll.save(info.uri, { 
      type: info.type,
      album: "Trender"
    })
    Toast.show({ text1: t(`commons.success`) })
  }

  return (
    <View style={styles.container}>
      {
        type === "photo" ? <Image style={{
          width: full_width,
          height: full_height
        }} source={{
          uri: file.uri
        }} /> : <>
                <View style={{
                          width: full_width,
                          height: full_height
                        }}>
                        <Pressable style={{
                            width: full_width,
                            height: full_height
                          }} onPress={() => setPaused(!paused)} >
                          <Video
                            onEnd={() => setPaused(true)}
                            source={{
                              uri: file.uri
                            }}
                            resizeMode={'cover'}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            }}
                            paused={paused}
                            repeat={true}
                            onProgress={(d) => {
                              setCurrentTime(d.currentTime)
                            }}
                            currentTime={currentTime}
                            muted={muted}
                            ref={(ref) => (videoPlayer.current = ref)}
                          />
                        </Pressable>
                      <View
                        style={{
                          position: 'absolute',
                          top: 60,
                          left: 20,
                        }}>
                        <View style={{ marginBottom: 10 }}>
                          <SvgElement noColor onPress={() => setPaused(!paused)} size={22} name={paused ? "play" : "pause"} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <SvgElement noColor onPress={() => {
                            setCurrentTime(0)
                            setPaused(false)
                          }} size={22} name={"repeat"} />
                        </View>
                        <SvgElement noColor onPress={() => setMuted(!muted)} size={22} name={muted ? "sound-mute" : "sound"} />
                      </View>
                  </View>
                </>
      }
      <View style={styles.leftButtonRow}>
        <SvgElement name={"chevron-left"} noColor size={24} onPress={() => navigation.replace("CameraScreen", params)} />
      </View>
      <View style={styles.rightButtonRow}>
        <SvgElement name={"download"} noColor size={24} onPress={() => downloadFile()} />
      </View>
      <View style={styles.bottomButtonRow}> 
        <SvgElement name={"chevron-right"} noColor size={24} onPress={() => navigation.replace("PostCreatorScreen", {
          ...params,
          initFiles: file
        })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftButtonRow: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  rightButtonRow: {
    position: "absolute",
    left: 20,
    bottom: 30,
  },
  bottomButtonRow: {
    position: "absolute",
    right: 20,
    bottom: 30
  }
});