import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/context/AppContext";
import type { DistanceOption } from "@/components/FilterSheet";

const TYPE_CHIPS = ["Todos", "Studio", "1 quarto", "2 quartos", "3+ quartos"];

function parseDistance(str: string): number {
  return parseFloat(str.replace(",", ".").replace(" km", ""));
}

interface DiscoverScreenProps {
  location: string;
  maxDistance: DistanceOption;
  onOpenLocationSheet: () => void;
  onOpenFilterSheet: () => void;
  onClearDistance: () => void;
}

export default function DiscoverScreen({
  location,
  maxDistance,
  onOpenLocationSheet,
  onOpenFilterSheet,
  onClearDistance,
}: DiscoverScreenProps) {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeChip, setActiveChip] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = properties.filter((p) => {
    const matchChip =
      activeChip === 0 ||
      (activeChip === 1 && p.type === "Studio") ||
      (activeChip === 2 && p.beds === 1) ||
      (activeChip === 3 && p.beds === 2) ||
      (activeChip === 4 && p.beds >= 3);
    const matchSearch =
      search.length === 0 ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchDistance =
      maxDistance === null || parseDistance(p.distance) <= maxDistance;
    return matchChip && matchSearch && matchDistance;
  });

  const hasActiveFilters = maxDistance !== null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ paddingTop: topPad + 12, paddingHorizontal: 20 }}>
          <Text style={styles.title}>Descobrir</Text>
          <Text style={styles.subtitle}>Encontre seu próximo lar</Text>

          {/* Location Bar */}
          <TouchableOpacity
            style={styles.locationBar}
            onPress={onOpenLocationSheet}
            activeOpacity={0.8}
          >
            <View style={styles.locationLeft}>
              <View style={styles.locationIcon}>
                <Feather name="map-pin" size={14} color={colors.blue} />
              </View>
              <View>
                <Text style={styles.locationLabel}>LOCALIZAÇÃO</Text>
                <Text style={styles.locationValue} numberOfLines={1}>{location}</Text>
              </View>
            </View>
            <View style={styles.locationChange}>
              <Text style={styles.locationChangeText}>Mudar</Text>
              <Feather name="chevron-down" size={14} color={colors.gold} />
            </View>
          </TouchableOpacity>

          {/* Search */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Feather name="search" size={16} color={colors.text3} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar por bairro ou endereço..."
                placeholderTextColor={colors.text3}
                style={styles.searchInput}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name="x" size={15} color={colors.text3} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
              onPress={onOpenFilterSheet}
            >
              <Feather name="sliders" size={18} color={hasActiveFilters ? colors.gold : colors.gold} />
              {hasActiveFilters && <View style={styles.filterBadge} />}
            </TouchableOpacity>
          </View>

          {/* Chips row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chips}
            contentContainerStyle={{ gap: 8, paddingRight: 4 }}
          >
            {/* Active distance chip */}
            {maxDistance !== null && (
              <TouchableOpacity
                style={styles.distanceChip}
                onPress={onClearDistance}
                activeOpacity={0.75}
              >
                <Feather name="map-pin" size={11} color={colors.blue} />
                <Text style={styles.distanceChipText}>≤ {maxDistance} km</Text>
                <Feather name="x" size={11} color={colors.blue} />
              </TouchableOpacity>
            )}

            {/* Type chips */}
            {TYPE_CHIPS.map((c, i) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, activeChip === i && styles.chipActive]}
                onPress={() => setActiveChip(i)}
              >
                <Text style={[styles.chipText, activeChip === i && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Listings */}
          <View style={{ marginTop: 4 }}>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="home" size={36} color={colors.text3} />
                <Text style={styles.emptyTitle}>Nenhum imóvel encontrado</Text>
                <Text style={styles.emptyText}>Tente ajustar os filtros de busca</Text>
                <TouchableOpacity
                  style={styles.clearFiltersBtn}
                  onPress={() => { setSearch(""); setActiveChip(0); onClearDistance(); }}
                >
                  <Feather name="x-circle" size={14} color={colors.gold} />
                  <Text style={styles.clearFiltersText}>Limpar filtros</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filtered.map((p) => <PropertyCard key={p.id} property={p} />)
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },
  locationLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  locationIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.blueDim,
    alignItems: "center",
    justifyContent: "center",
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 1,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
    maxWidth: 200,
  },
  locationChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationChangeText: { fontSize: 11, color: colors.gold },
  title: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: colors.text3, marginBottom: 18 },
  searchRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    padding: 0,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(201,169,110,0.10)",
    borderWidth: 1,
    borderColor: "rgba(201,169,110,0.20)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    backgroundColor: "rgba(201,169,110,0.18)",
    borderColor: "rgba(201,169,110,0.50)",
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.bg,
  },
  chips: { marginBottom: 20 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  chipActive: {
    backgroundColor: "rgba(201,169,110,0.14)",
    borderColor: "rgba(201,169,110,0.35)",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: colors.text3,
  },
  chipTextActive: { color: colors.gold },
  distanceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(99,140,255,0.40)",
    backgroundColor: colors.blueDim,
  },
  distanceChipText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.blue,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text2,
  },
  emptyText: { fontSize: 13, color: colors.text3, textAlign: "center" },
  clearFiltersBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(201,169,110,0.25)",
    backgroundColor: "rgba(201,169,110,0.08)",
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.gold,
  },
});
