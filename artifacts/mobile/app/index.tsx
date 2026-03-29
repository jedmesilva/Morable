import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomTabBar, type TabName } from "@/components/BottomTabBar";
import { LocationSheet } from "@/components/LocationSheet";
import { FilterSheet, type DistanceOption } from "@/components/FilterSheet";
import colors from "@/constants/colors";
import HomeScreen from "@/screens/HomeScreen";
import DiscoverScreen from "@/screens/DiscoverScreen";
import ActionsScreen from "@/screens/ActionsScreen";
import ProfileScreen from "@/screens/ProfileScreen";

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [showActions, setShowActions] = useState(false);
  const [location, setLocation] = useState("Rio de Janeiro, RJ");
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [maxDistance, setMaxDistance] = useState<DistanceOption>(null);

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
      case "discover": return (
        <DiscoverScreen
          location={location}
          maxDistance={maxDistance}
          onOpenLocationSheet={() => setLocationSheetVisible(true)}
          onOpenFilterSheet={() => setFilterSheetVisible(true)}
          onClearDistance={() => setMaxDistance(null)}
        />
      );
      case "profile": return <ProfileScreen />;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <LocationSheet
        visible={locationSheetVisible}
        currentLocation={location}
        onClose={() => setLocationSheetVisible(false)}
        onConfirm={(loc) => setLocation(loc)}
      />
      <FilterSheet
        visible={filterSheetVisible}
        maxDistance={maxDistance}
        onClose={() => setFilterSheetVisible(false)}
        onApply={(dist) => setMaxDistance(dist)}
      />
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
