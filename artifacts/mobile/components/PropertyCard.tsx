import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "@/constants/colors";
import { useApp, type Property } from "@/context/AppContext";

const propertyImages: Record<string, ReturnType<typeof require>> = {
  "1": require("@/assets/images/property-1.png"),
  "2": require("@/assets/images/property-2.png"),
  "3": require("@/assets/images/property-3.png"),
};

export function PropertyCard({ property }: { property: Property }) {
  const { savedProperties, toggleSave, setActiveProperty } = useApp();
  const saved = savedProperties.includes(property.id);

  const handlePress = () => {
    setActiveProperty(property);
    router.push("/property");
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSave(property.id);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.92}
    >
      <View style={styles.imageContainer}>
        <Image
          source={propertyImages[property.id]}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Gradient overlay covering the entire info section */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.82)", "rgba(0,0,0,0.96)"]}
          locations={[0, 0.35, 0.7, 1]}
          style={styles.gradient}
        />

        {/* Match badge + save button */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.matchBadge,
              property.match >= 90
                ? styles.matchHigh
                : property.match >= 80
                  ? styles.matchMed
                  : styles.matchLow,
            ]}
          >
            <Text style={styles.matchText}>{property.match}% match</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnActive]}
            onPress={handleSave}
          >
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={16}
              color={saved ? colors.red : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* All info inside the image, over the gradient */}
        <View style={styles.bottomContent}>
          <View style={styles.tagRow}>
            <View
              style={[
                styles.tag,
                property.available ? styles.tagAvailable : styles.tagUnavailable,
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  property.available
                    ? styles.tagTextAvailable
                    : styles.tagTextUnavailable,
                ]}
              >
                {property.available ? "DISPONÍVEL" : "INDISPONÍVEL"}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{property.type.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>
                {property.price}
                <Text style={styles.pricePer}>/mês</Text>
              </Text>
              <Text style={styles.location}>
                <Feather name="map-pin" size={10} color={colors.text2} />{" "}
                {property.location}
              </Text>
            </View>
            <View style={styles.rating}>
              <Feather name="star" size={11} color={colors.gold} />
              <Text style={styles.ratingVal}>{property.rating}</Text>
              <Text style={styles.ratingCount}>({property.reviews})</Text>
            </View>
          </View>

          {/* Stats row — now inside the overlay */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Feather name="home" size={12} color={colors.gold} />
              <Text style={styles.statVal}>{property.beds} quartos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Feather name="droplet" size={12} color={colors.gold} />
              <Text style={styles.statVal}>{property.baths} banheiro</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Feather name="maximize-2" size={12} color={colors.gold} />
              <Text style={styles.statVal}>{property.area}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  imageContainer: {
    height: 280,
    position: "relative",
  },
  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  } as any,
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "75%",
  },
  topRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchBadge: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  matchHigh: { backgroundColor: "rgba(62,207,142,0.85)" },
  matchMed: { backgroundColor: "rgba(201,169,110,0.85)" },
  matchLow: { backgroundColor: "rgba(245,166,35,0.75)" },
  matchText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#fff",
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  saveBtnActive: {
    backgroundColor: "rgba(255,102,102,0.25)",
    borderColor: "rgba(255,102,102,0.4)",
  },
  bottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    paddingBottom: 16,
  },
  tagRow: { flexDirection: "row", gap: 7, marginBottom: 8 },
  tag: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  tagAvailable: {
    backgroundColor: "rgba(62,207,142,0.18)",
    borderColor: "rgba(62,207,142,0.35)",
  },
  tagUnavailable: {
    backgroundColor: "rgba(255,102,102,0.18)",
    borderColor: "rgba(255,102,102,0.35)",
  },
  tagText: { fontSize: 10, fontWeight: "600" as const, color: "rgba(255,255,255,0.85)" },
  tagTextAvailable: { color: colors.green },
  tagTextUnavailable: { color: colors.red },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#fff",
  },
  pricePer: { fontSize: 13, fontWeight: "400" as const, color: colors.text2 },
  location: { fontSize: 12, color: colors.text2, marginTop: 2 },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  ratingVal: { fontSize: 13, fontWeight: "600" as const, color: "#fff" },
  ratingCount: { fontSize: 11, color: colors.text3 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  stat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" },
  statVal: { fontSize: 12, color: "rgba(255,255,255,0.75)" },
  statDivider: { width: 1, height: 14, backgroundColor: "rgba(255,255,255,0.12)" },
});
