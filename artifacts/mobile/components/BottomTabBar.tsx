import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

export type TabName = "home" | "discover" | "profile";

interface BottomTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabs: { name: TabName; icon: string; label: string }[] = [
  { name: "home", icon: "home", label: "Início" },
  { name: "discover", icon: "search", label: "Descobrir" },
  { name: "profile", icon: "user", label: "Perfil" },
];

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <View style={styles.blurBg} />
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onTabPress(tab.name);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Feather
                name={tab.icon as any}
                size={20}
                color={isActive ? colors.gold : colors.text3}
              />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(13,17,23,0.96)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  blurBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,17,23,0.96)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  iconWrap: {
    width: 42,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "rgba(201,169,110,0.12)",
  },
  label: {
    fontSize: 10,
    fontWeight: "500" as const,
    color: colors.text3,
  },
  labelActive: {
    color: colors.gold,
  },
});
