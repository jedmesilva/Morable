import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const propertyImages: Record<string, ReturnType<typeof require>> = {
  "1": require("@/assets/images/property-1.png"),
  "2": require("@/assets/images/property-2.png"),
  "3": require("@/assets/images/property-3.png"),
};

const amenities = [
  { icon: "wifi", label: "Wi-Fi", active: true },
  { icon: "shield", label: "Portaria", active: true },
  { icon: "package", label: "Mobiliado", active: true },
  { icon: "truck", label: "Estacionamento", key: "parking" },
  { icon: "activity", label: "Academia", key: "gym" },
  { icon: "heart", label: "Pet friendly", key: "pets" },
];

const rules = [
  { label: "Proibido fumar", color: colors.red, allowed: false },
  { label: "Permitido pets", color: colors.green, allowed: true },
  { label: "Permitido mobiliar", color: colors.green, allowed: true },
  { label: "Ruído após 22h: proibido", color: colors.red, allowed: false },
];

const matchItems = [
  { label: "Faixa de preço", detail: "Dentro do orçamento", pass: true },
  { label: "Número de quartos", detail: "2 quartos — correspondente", pass: true },
  { label: "Pet friendly", detail: "Aceita animais", pass: true },
  { label: "Academia", detail: "Academia no condomínio", pass: false },
];

export default function PropertyScreen() {
  const { activeProperty, savedProperties, toggleSave } = useApp();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<"details" | "match" | "reviews">("details");

  if (!activeProperty) {
    router.back();
    return null;
  }

  const saved = savedProperties.includes(activeProperty.id);
  const img = propertyImages[activeProperty.id] || propertyImages["1"];

  const getAmenityActive = (a: typeof amenities[0]) => {
    if (a.active !== undefined) return a.active;
    if (a.key === "parking") return activeProperty.parking;
    if (a.key === "gym") return activeProperty.gym;
    if (a.key === "pets") return activeProperty.pets;
    return false;
  };

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={img} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />

        {/* Top bar */}
        <View style={[styles.heroTopBar, { top: topPad }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={[styles.heroActionBtn, saved && styles.heroActionBtnSaved]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSave(activeProperty.id);
              }}
            >
              <Feather name="heart" size={18} color={saved ? colors.red : "#fff"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroActionBtn}>
              <Feather name="share-2" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom content */}
        <View style={styles.heroBottom}>
          <View style={styles.heroTagRow}>
            <View
              style={[
                styles.heroTag,
                activeProperty.available
                  ? styles.heroTagAvailable
                  : styles.heroTagUnavailable,
              ]}
            >
              <Text
                style={[
                  styles.heroTagText,
                  activeProperty.available
                    ? { color: colors.green }
                    : { color: colors.red },
                ]}
              >
                {activeProperty.available ? "DISPONÍVEL" : "INDISPONÍVEL"}
              </Text>
            </View>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{activeProperty.type.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.heroPriceRow}>
            <Text style={styles.heroPrice}>
              {activeProperty.price}
              <Text style={styles.heroPricePer}>/mês</Text>
            </Text>
            <View style={styles.heroRating}>
              <Feather name="star" size={12} color={colors.gold} />
              <Text style={styles.heroRatingVal}>{activeProperty.rating}</Text>
              <Text style={styles.heroRatingCount}>({activeProperty.reviews})</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.propName}>{activeProperty.name}</Text>
          <View style={styles.propLocation}>
            <Feather name="map-pin" size={13} color={colors.text2} />
            <Text style={styles.propLocationText}>{activeProperty.location}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            {[
              { icon: "home", val: `${activeProperty.beds}`, label: "quartos" },
              { icon: "droplet", val: `${activeProperty.baths}`, label: "banheiro" },
              { icon: "maximize-2", val: activeProperty.area, label: "área" },
              { icon: "layers", val: activeProperty.floor, label: "andar" },
            ].map((s) => (
              <View key={s.label} style={styles.qsItem}>
                <Feather name={s.icon as any} size={16} color={colors.gold} />
                <Text style={styles.qsVal}>{s.val}</Text>
                <Text style={styles.qsLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(["details", "match", "reviews"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
                {t === "details" ? "Detalhes" : t === "match" ? "Match" : "Avaliações"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "details" && (
          <>
            {/* Amenities */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>COMODIDADES</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.amenitiesGrid}>
                {amenities.map((a) => {
                  const active = getAmenityActive(a);
                  return (
                    <View
                      key={a.label}
                      style={[styles.amenityItem, !active && styles.amenityItemInactive]}
                    >
                      <Feather name={a.icon as any} size={20} color={active ? colors.gold : colors.text3} />
                      <Text style={styles.amenityLabel}>{a.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Rules */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>REGRAS DO IMÓVEL</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.rulesList}>
                {rules.map((r) => (
                  <View key={r.label} style={styles.ruleItem}>
                    <View style={[styles.ruleDot, { backgroundColor: r.color }]} />
                    <Text style={styles.ruleText}>{r.label}</Text>
                    <Feather
                      name={r.allowed ? "check" : "x"}
                      size={14}
                      color={r.allowed ? colors.green : colors.red}
                    />
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === "match" && (
          <View style={styles.section}>
            <View style={styles.matchHeader}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
                  <Text style={styles.matchNumber}>{activeProperty.match}</Text>
                  <Text style={styles.matchPct}>%</Text>
                </View>
                <Text style={styles.matchLabel}>de compatibilidade</Text>
              </View>
            </View>
            <View style={styles.matchBarWrap}>
              <View style={[styles.matchBarFill, { width: `${activeProperty.match}%` }]} />
            </View>
            <View style={styles.matchItems}>
              {matchItems.map((m) => (
                <View
                  key={m.label}
                  style={[styles.matchItem, m.pass ? styles.matchItemPass : styles.matchItemFail]}
                >
                  <View
                    style={[
                      styles.matchItemIcon,
                      m.pass ? styles.matchItemIconPass : styles.matchItemIconFail,
                    ]}
                  >
                    <Feather
                      name={m.pass ? "check" : "x"}
                      size={14}
                      color={m.pass ? colors.green : colors.red}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.matchItemName}>{m.label}</Text>
                    <Text style={styles.matchItemDetail}>{m.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "reviews" && (
          <View style={styles.section}>
            <View style={styles.reviewSummary}>
              <View style={styles.reviewScoreLeft}>
                <Text style={styles.reviewScoreBig}>{activeProperty.rating}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Feather
                      key={i}
                      name="star"
                      size={14}
                      color={i <= Math.round(activeProperty.rating) ? colors.gold : colors.border}
                    />
                  ))}
                </View>
                <Text style={styles.reviewCount}>{activeProperty.reviews} avaliações</Text>
              </View>
            </View>

            {[
              { initials: "R.M.", color: "#2a4a7f", name: "R. Mendes", tenure: "20 meses", stars: 5, text: "Imóvel excelente, muito silencioso. A gestão foi super eficiente em todos os chamados. Entrega e saída sem burocracia, tudo pelo app." },
              { initials: "C.A.", color: "#2a6b4a", name: "C. Almeida", tenure: "16 meses", stars: 4, text: "Apartamento bem conservado, estrutura boa. Tive um problema com o chuveiro mas foi resolvido em dois dias." },
            ].map((r) => (
              <View key={r.name} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={[styles.reviewAvatar, { backgroundColor: r.color }]}>
                    <Text style={styles.reviewAvatarText}>{r.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <Text style={styles.reviewTenure}>{r.tenure}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Feather
                        key={i}
                        name="star"
                        size={12}
                        color={i <= r.stars ? colors.gold : colors.border}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        >
          <Text style={styles.ctaBtnText}>Agendar visita</Text>
          <Feather name="calendar" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaSecondary}>
          <Feather name="message-circle" size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 320, position: "relative" },
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  } as any,
  heroOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroTopBar: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroActions: { flexDirection: "row", gap: 8 },
  heroActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroActionBtnSaved: {
    backgroundColor: "rgba(255,102,102,0.25)",
    borderColor: "rgba(255,102,102,0.4)",
  },
  heroBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  heroTagRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  heroTag: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  heroTagAvailable: {
    backgroundColor: "rgba(62,207,142,0.18)",
    borderColor: "rgba(62,207,142,0.35)",
  },
  heroTagUnavailable: {
    backgroundColor: "rgba(255,102,102,0.18)",
    borderColor: "rgba(255,102,102,0.35)",
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.85)",
  },
  heroPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroPrice: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: "#fff",
  },
  heroPricePer: { fontSize: 13, fontWeight: "400" as const, color: colors.text2 },
  heroRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  heroRatingVal: { fontSize: 13, fontWeight: "600" as const, color: "#fff" },
  heroRatingCount: { fontSize: 11, color: colors.text3 },
  scrollContent: { flex: 1 },
  titleSection: { padding: 20 },
  propName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 6,
  },
  propLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 16,
  },
  propLocationText: { fontSize: 13, color: colors.text2 },
  quickStats: {
    flexDirection: "row",
    gap: 8,
  },
  qsItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 4,
  },
  qsVal: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
  qsLabel: {
    fontSize: 9,
    fontWeight: "500" as const,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20 },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: "rgba(201,169,110,0.14)",
    borderColor: colors.goldBorder,
  },
  tabBtnText: { fontSize: 12, fontWeight: "600" as const, color: colors.text3 },
  tabBtnTextActive: { color: colors.gold },
  section: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 1.2,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.border },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amenityItem: {
    width: "30%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 7,
  },
  amenityItemInactive: {
    borderColor: colors.border,
    opacity: 0.4,
  },
  amenityLabel: { fontSize: 11, fontWeight: "500" as const, color: colors.text2, textAlign: "center" },
  rulesList: { gap: 8 },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  ruleDot: { width: 6, height: 6, borderRadius: 3 },
  ruleText: { flex: 1, fontSize: 13, color: colors.text2 },
  matchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  matchNumber: {
    fontSize: 48,
    fontWeight: "800" as const,
    color: colors.green,
    lineHeight: 52,
  },
  matchPct: { fontSize: 18, fontWeight: "600" as const, color: colors.green },
  matchLabel: { fontSize: 11, color: colors.text3, marginTop: 2 },
  matchBarWrap: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  matchBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  matchItems: { gap: 8 },
  matchItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  matchItemPass: {
    backgroundColor: "rgba(62,207,142,0.06)",
    borderColor: "rgba(62,207,142,0.15)",
  },
  matchItemFail: {
    backgroundColor: "rgba(255,102,102,0.05)",
    borderColor: "rgba(255,102,102,0.12)",
  },
  matchItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  matchItemIconPass: { backgroundColor: "rgba(62,207,142,0.15)" },
  matchItemIconFail: { backgroundColor: "rgba(255,102,102,0.12)" },
  matchItemName: { fontSize: 13, fontWeight: "500" as const, color: colors.text },
  matchItemDetail: { fontSize: 11, color: colors.text3, marginTop: 1 },
  reviewSummary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  reviewScoreLeft: { alignItems: "center" },
  reviewScoreBig: {
    fontSize: 48,
    fontWeight: "800" as const,
    color: colors.text,
    lineHeight: 52,
    marginBottom: 6,
  },
  starsRow: { flexDirection: "row", gap: 3, marginBottom: 4 },
  reviewCount: { fontSize: 11, color: colors.text3 },
  reviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  reviewAvatarText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#fff",
  },
  reviewName: { fontSize: 14, fontWeight: "500" as const, color: colors.text, marginBottom: 2 },
  reviewTenure: { fontSize: 11, color: colors.text3 },
  reviewText: { fontSize: 13, lineHeight: 20, color: colors.text2 },
  ctaBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: "rgba(13,17,23,0.97)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.gold,
    borderRadius: 16,
    paddingVertical: 15,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#fff",
  },
  ctaSecondary: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(201,169,110,0.12)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
