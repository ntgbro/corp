import React from 'react';
import { Modal as RNModal, View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  presentationStyle = 'overFullScreen',
  style,
}) => {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      onRequestClose={onClose}
      animationType={animationType}
      presentationStyle={presentationStyle}
      transparent={true}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[
            styles.modal,
            {
              backgroundColor: theme.colors.background,
              shadowColor: theme.colors.text,
            },
            style,
          ]}
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when tapping modal content
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Modal;
