import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomTabBar, type TabName } from "@/components/BottomTabBar";
import colors from "@/constants/colors";
import HomeScreen from "@/screens/HomeScreen";
import DiscoverScreen from "@/screens/DiscoverScreen";
import ActionsScreen from "@/screens/ActionsScreen";
import ProfileScreen from "@/screens/ProfileScreen";

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [showActions, setShowActions] = useState(false);

  if (showActions) {
    return (
      <View style={styles.root}>
        <ActionsScreen onBack={() => setShowActions(false)} />
      </View>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home": return <HomeScreen onOpenActions={() => setShowActions(true)} />;
      case "discover": return <DiscoverScreen />;
      case "profile": return <ProfileScreen />;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
});
