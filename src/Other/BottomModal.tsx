import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Modal from 'react-native-modal';
import { useTheme } from '../Components/Container';

type SectionProps = PropsWithChildren<{
  isVisible?: boolean;
  dismiss?: () => void;
  scrollView?: boolean;
  onSwipeComplete?: () => void;
}>

const BottomModal = (props: SectionProps) => {
  const {children, isVisible, dismiss, scrollView} = props;
  
  const { colors } = useTheme();
  const BOTTOM_INSET = getBottomSpace();

  return (
    <Modal
      isVisible={isVisible}
      onDismiss={dismiss}
      swipeDirection="down"
      style={{
        justifyContent: 'flex-end',
        margin: 0
      }}
      onBackButtonPress={dismiss}
      onBackdropPress={dismiss}
      onSwipeComplete={dismiss}
      propagateSwipe={true}
      useNativeDriverForBackdrop
      {...props}>
      <View
        style={
          scrollView
            ? // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: colors.bg_secondary,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                height: '65%'
              }
            : {
              backgroundColor: colors.bg_secondary,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              padding: 5,
              paddingTop: 0
            }
        }>
        <View style={{
          borderBottomWidth: 4,
          borderBottomColor: colors.text_muted,
          width: '10%',
          alignSelf: 'center',
          borderRadius: 10,
          marginVertical: 10,
        }} />
        {children}
        <View style={{
          backgroundColor: colors.bg_secondary,
          width: "100%",
          height: BOTTOM_INSET
        }} />
      </View>
    </Modal>
  );
};

export default BottomModal;