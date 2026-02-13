import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Get safe area top inset (fallback for when SafeAreaProvider isn't available)
const getTopInset = () => {
  if (Platform.OS === 'ios') {
    return 50; // Default iOS notch area
  }
  return StatusBar.currentHeight || 24; // Android status bar
};

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  type: ToastType;
  text1: string;
  text2?: string;
  visibilityTime?: number;
  onPress?: () => void;
}

interface ToastData extends ToastConfig {
  id: number;
}

// Global toast state
let toastHandler: ((config: ToastConfig) => void) | null = null;

// Static method to show toast from anywhere
export const showToast = (config: ToastConfig) => {
  if (toastHandler) {
    toastHandler(config);
  }
};

// Shorthand methods
export const CustomToast = {
  show: showToast,
  success: (text1: string, text2?: string) => showToast({ type: 'success', text1, text2 }),
  error: (text1: string, text2?: string) => showToast({ type: 'error', text1, text2 }),
  info: (text1: string, text2?: string) => showToast({ type: 'info', text1, text2 }),
  warning: (text1: string, text2?: string) => showToast({ type: 'warning', text1, text2 }),
};

const getToastColors = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { bg: '#ECFDF5', border: '#10B981', icon: 'checkmark-circle', iconColor: '#10B981' };
    case 'error':
      return { bg: '#FEF2F2', border: '#EF4444', icon: 'close-circle', iconColor: '#EF4444' };
    case 'warning':
      return { bg: '#FFFBEB', border: '#F59E0B', icon: 'warning', iconColor: '#F59E0B' };
    case 'info':
    default:
      return { bg: '#EFF6FF', border: '#3B82F6', icon: 'information-circle', iconColor: '#3B82F6' };
  }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const topInset = getTopInset();
  const idCounter = useRef(0);

  useEffect(() => {
    toastHandler = (config: ToastConfig) => {
      const id = idCounter.current++;
      setToasts((prev) => [...prev, { ...config, id }]);
    };

    return () => {
      toastHandler = null;
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {children}
      <View style={[styles.container, { top: topInset + 10 }]} pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onHide={() => removeToast(toast.id)} />
        ))}
      </View>
    </>
  );
}

function ToastItem({ toast, onHide }: { toast: ToastData; onHide: () => void }) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = getToastColors(toast.type);

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide
    const timer = setTimeout(() => {
      hideToast();
    }, toast.visibilityTime || 4000);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.bg,
          borderLeftColor: colors.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={() => {
          toast.onPress?.();
          hideToast();
        }}
        activeOpacity={0.9}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.border + '20' }]}>
          <Ionicons name={colors.icon as any} size={28} color={colors.iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text1} numberOfLines={2}>
            {toast.text1}
          </Text>
          {toast.text2 && (
            <Text style={styles.text2} numberOfLines={2}>
              {toast.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    width: width - 32,
    minHeight: 80,
    borderRadius: 16,
    borderLeftWidth: 5,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  text2: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default CustomToast;
