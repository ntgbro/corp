import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../config/theme';

const { width: screenWidth } = Dimensions.get('window');

interface DrawerItem {
  id: string;
  title: string;
  icon?: string;
  onPress: () => void;
  badgeCount?: number;
  disabled?: boolean;
}

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  items: DrawerItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  style?: ViewStyle;
  position?: 'left' | 'right';
  width?: number;
  showOverlay?: boolean;
  overlayOpacity?: number;
  animationType?: 'slide' | 'fade';
  animationDuration?: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onClose,
  items,
  headerTitle,
  headerSubtitle,
  style,
  position = 'left',
  width = screenWidth * 0.8,
  showOverlay = true,
  overlayOpacity = 0.5,
  animationType = 'slide',
  animationDuration = 300,
}) => {
  const theme = useTheme();
  const slideAnim = React.useRef(new Animated.Value(position === 'left' ? -width : screenWidth)).current;

  React.useEffect(() => {
    if (visible) {
      // Show drawer
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide drawer
      Animated.timing(slideAnim, {
        toValue: position === 'left' ? -width : screenWidth,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, width, position, animationDuration]);

  if (!visible && !showOverlay) {
    return null;
  }

  const drawerStyle = [
    styles.drawer,
    {
      width,
      [position]: 0,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    style,
  ];

  const overlayStyle = [
    styles.overlay,
    {
      opacity: showOverlay ? overlayOpacity : 0,
      backgroundColor: theme.colors.black,
    },
  ];

  const renderItem = (item: DrawerItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.drawerItem,
        {
          opacity: item.disabled ? 0.5 : 1,
        },
      ]}
      onPress={() => {
        if (!item.disabled) {
          item.onPress();
          onClose();
        }
      }}
      disabled={item.disabled}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        {item.icon && (
          <Text style={[styles.itemIcon, { color: theme.colors.primary }]}>
            {item.icon}
          </Text>
        )}
        <Text
          style={[
            styles.itemText,
            {
              color: item.disabled ? theme.colors.textSecondary : theme.colors.text,
            },
          ]}
        >
          {item.title}
        </Text>
      </View>

      {item.badgeCount !== undefined && item.badgeCount > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
          <Text style={[styles.badgeText, { color: theme.colors.white }]}>
            {item.badgeCount > 99 ? '99+' : item.badgeCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <TouchableOpacity
          style={overlayStyle}
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          drawerStyle,
          {
            transform: [
              {
                translateX: animationType === 'slide' ? slideAnim : 0,
              },
            ],
            opacity: animationType === 'fade' ? slideAnim.interpolate({
              inputRange: [-width, 0],
              outputRange: [0, 1],
            }) : 1,
          },
        ]}
      >
        {/* Header */}
        {(headerTitle || headerSubtitle) && (
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            {headerTitle && (
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                {headerTitle}
              </Text>
            )}
            {headerSubtitle && (
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                {headerSubtitle}
              </Text>
            )}
          </View>
        )}

        {/* Items */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {items.map(renderItem)}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SideDrawer;
