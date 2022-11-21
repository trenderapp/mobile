import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import SvgElement from '../../Components/Elements/Svg';
import { full_height, full_width } from '../../Style/style';
import Video from 'react-native-video';
import { useNavigation } from '../../Components/Container';


export function DisplayRenderScreen({ route: { params }}) {
  
  const { type, info } = params;
  const navigation = useNavigation();
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0)
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [file, setFile] = useState(info);
  
  useEffect(() => {
    info && setFile(info)
  }, [info])
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
    right: 20,
    top: 20,
  },
  bottomButtonRow: {
    position: "absolute",
    right: 20,
    bottom: 30
  }
});