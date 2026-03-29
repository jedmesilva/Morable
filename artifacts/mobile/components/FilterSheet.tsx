import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

export type DistanceOption = 2 | 5 | 10 | 20 | null;

const DISTANCE_OPTIONS: { label: string; value: DistanceOption }[] = [
  { label: "2 km", value: 2 },
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "20 km", value: 20 },
  { label: "Qualquer", value: null },
];

const DISMISS_THRESHOLD = 80;

interface FilterSheetProps {
  visible: boolean;
  maxDistance: DistanceOption;
  onClose: () => void;
  onApply: (maxDistance: DistanceOption) => void;
}

export function FilterSheet({ visible, maxDistance, onClose, onApply }: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const [selectedDistance, setSelectedDistance] = useState<DistanceOption>(maxDistance);

  const translateY = useSharedValue(600);
  const backdropOpacity = useSharedValue(0);

  const dismiss = () => {
    translateY.value = withTiming(600, { duration: 260 });
    backdropOpacity.value = withTiming(0, { duration: 220 });
    setTimeout(onClose, 260);
  };

  useEffect(() => {
    if (visible) {
      setSelectedDistance(maxDistance);
      translateY.value = withSpring(0, { damping: 32, stiffness: 260, mass: 1 });
      backdropOpacity.value = withTiming(1, { duration: 280 });
    } else {
      translateY.value = withTiming(600, { duration: 260 });
      backdropOpacity.value = withTiming(0, { duration: 220 });
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        backdropOpacity.value = Math.max(0, 1 - e.translationY / 300);
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 800) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 32, stiffness: 260, mass: 1 });
        backdropOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: backdropOpacity.value > 0 ? "auto" : "none",
  }));

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onApply(selectedDistance);
    dismiss();
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDistance(null);
  };

  const hasChanges = selectedDistance !== maxDistance;
  const hasActiveFilters = selectedDistance !== null;

  if (!visible) return null;

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }, sheetStyle]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.dragArea}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtros</Text>
          <View style={styles.headerRight}>
            {hasActiveFilters && (
              <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Limpar tudo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={dismiss}>
              <Feather name="x" size={16} color={colors.text2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Distance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={14} color={colors.gold} />
            <Text style={styles.sectionTitle}>Distância máxima</Text>
          </View>
          <Text style={styles.sectionSub}>
            A partir da localização selecionada
          </Text>
          <View style={styles.optionsGrid}>
            {DISTANCE_OPTIONS.map((opt) => {
              const isSelected = selectedDistance === opt.value;
              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  style={[styles.optionChip, isSelected && styles.optionChipActive]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDistance(opt.value);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={[styles.applyBtn, !hasChanges && styles.applyBtnDim]}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Feather name="check" size={16} color="#fff" />
          <Text style={styles.applyBtnText}>
            {hasChanges ? "Aplicar filtros" : "Fechar"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 10,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    backgroundColor: "#14181f",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
  },
  dragArea: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  clearBtnText: {
    fontSize: 12,
    color: colors.text3,
    fontWeight: "500" as const,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.text3,
    marginBottom: 16,
    marginLeft: 22,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  optionChipActive: {
    backgroundColor: "rgba(201,169,110,0.14)",
    borderColor: "rgba(201,169,110,0.45)",
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.text3,
  },
  optionTextActive: {
    color: colors.gold,
    fontWeight: "600" as const,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 14,
  },
  applyBtnDim: {
    backgroundColor: "rgba(99,140,255,0.5)",
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#fff",
  },
});
