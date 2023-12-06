import * as React from 'react'
import { useRef, useState, useCallback, useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity as PressableOpacity, Platform } from 'react-native'
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler'
import { Camera, CameraRuntimeError, PhotoFile, useCameraDevice, useCameraFormat, VideoFile } from 'react-native-vision-camera'
import { MAX_ZOOM_FACTOR, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Components/Camera/Constants'
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useIsForeground } from '../../Components/Camera/useIsForeground'
import { CaptureButton } from '../../Components/Camera/CaptureButton'
import { useIsFocused } from '@react-navigation/core'
import { IconButton, Text } from 'react-native-paper'
import { useNavigation, useTheme } from '../../Components/Container';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const SCALE_FULL_ZOOM = 3

export default function CameraPage({ route: { params } }: any): React.ReactElement {

  const camera = useRef<Camera>(null)
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false)
  const zoom = useSharedValue(0)
  const isPressingButton = useSharedValue(false)

  // check if camera page is active
  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back')
  const [enableHdr, setEnableHdr] = useState(false)
  const [flash, setFlash] = useState<'off' | 'on'>('off')
  const [enableNightMode, setEnableNightMode] = useState(false)

  const device = useCameraDevice(cameraPosition)

  const [targetFps, setTargetFps] = useState(60)

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])

  const fps = Math.min(format?.maxFps ?? 1, targetFps)

  const supportsFlash = device?.hasFlash ?? false
  const supportsHdr = format?.supportsPhotoHdr
  const supports60Fps = useMemo(() => device?.formats.some((f) => f.maxFps >= 60), [device?.formats])
  const canToggleNightMode = device?.supportsLowLightBoost ?? false

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
    return {
      zoom: z,
    }
  }, [maxZoom, minZoom, zoom])
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton
    },
    [isPressingButton],
  )
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error)
  }, [])
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!')
    setIsCameraInitialized(true)
  }, [])
  const onMediaCaptured = useCallback(
    (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      let result = {};
      if (type === "photo") {
        result = {
          name: media?.path.split('/')[media.path.split('/').length - 1],
          type: "image/jpeg",
          uri: "file://" + media?.path
        }
      } else {
        result = {
          name: media.path.split('/')[media.path.split('/').length - 1],
          type: "video/mp4",
          uri: media.path
        }
      }
      return navigation.replace("DisplayRenderScreen", {
        ...params,
        type: type,
        info: result
      })
    },
    [navigation],
  )
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
  }, [])
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'))
  }, [])
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed()
  }, [onFlipCameraPressed])
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom
  }, [neutralZoom, zoom])

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then((status) => setHasMicrophonePermission(status === 'granted'))
  }, [])
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP)
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP)
    },
  })
  //#endregion

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined
    console.log(`Camera: ${device?.name} | Format: ${f}`)
  }, [device?.name, format, fps])

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                fps={fps}
                photoHdr={enableHdr}
                videoHdr={enableHdr}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                exposure={0}
                enableFpsGraph={true}
                orientation="portrait"
                photo={true}
                video={true}
                audio={hasMicrophonePermission}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      <View style={styles.leftButtonRow}>
        <IconButton mode='contained' icon="chevron-left" onPress={() => navigation.replace("PostCreatorScreen", params)} />
      </View>

      <View style={styles.rightButtonRow}>
        <IconButton mode='contained' icon="camera-retake" onPress={onFlipCameraPressed} />
        {supportsFlash && <IconButton mode='contained' icon={flash === 'on' ? 'flash' : 'flash-off'} onPress={onFlashPressed} />}
        {/*supports60Fps && (
          <PressableOpacity style={{
            margin: 6,
            overflow: 'hidden',
            elevation: 0,
            width: 40,
            height: 40,
            borderRadius: 40 / 2,
            backgroundColor: colors.bg_primary,
            justifyContent: 'center',
            alignItems: 'center',
          }} onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}>
            <Text style={{ textAlign: 'center', fontSize: 11, fontWeight: "bold", color: colors.fa_primary }}>{`${targetFps}\nFPS`}</Text>
          </PressableOpacity>
        )*/}
        {supportsHdr && <IconButton mode='contained' icon={enableHdr ? 'hdr' : 'hdr-off'} onPress={() => setEnableHdr((h) => !h)} />}
        {canToggleNightMode && <IconButton mode='contained' icon={enableNightMode ? 'moon' : 'moon-outline'} onPress={() => setEnableNightMode(!enableNightMode)} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
  },
  button: {
    margin: 6,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButtonRow: {
    marginTop: Platform.OS === "ios" ? 20 : 0,
    position: "absolute",
    left: 20,
    top: 20,
  },
  rightButtonRow: {
    marginTop: Platform.OS === "ios" ? 20 : 0,
    position: 'absolute',
    right: 20,
    top: 20,
  }
})