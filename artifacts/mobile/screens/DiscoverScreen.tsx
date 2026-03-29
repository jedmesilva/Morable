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

const chips = ["Todos", "Studio", "1 quarto", "2 quartos", "3+ quartos"];

export default function DiscoverScreen() {
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
    return matchChip && matchSearch;
  });

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={{ paddingTop: topPad + 12, paddingHorizontal: 20 }}>
        {/* Location Bar */}
        <View style={styles.locationBar}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIcon}>
              <Feather name="map-pin" size={14} color={colors.blue} />
            </View>
            <View>
              <Text style={styles.locationLabel}>LOCALIZAÇÃO</Text>
              <Text style={styles.locationValue}>Rio de Janeiro, RJ</Text>
            </View>
          </View>
          <View style={styles.locationChange}>
            <Text style={styles.locationChangeText}>Mudar</Text>
            <Feather name="chevron-down" size={14} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.title}>Descobrir</Text>
        <Text style={styles.subtitle}>Encontre seu próximo lar</Text>

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
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Feather name="sliders" size={18} color={colors.gold} />
          </TouchableOpacity>
        </View>

        {/* Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chips}
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          {chips.map((c, i) => (
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
            </View>
          ) : (
            filtered.map((p) => <PropertyCard key={p.id} property={p} />)
          )}
        </View>
      </View>
    </ScrollView>
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
  locationLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
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
});
