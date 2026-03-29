import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const activities = [
  {
    id: "1",
    icon: "file-text" as const,
    color: "blue" as const,
    title: "Fatura de Março",
    sub: "Vence em 5 dias",
    amount: "R$ 4.800",
  },
  {
    id: "2",
    icon: "check-circle" as const,
    color: "green" as const,
    title: "Pagamento confirmado",
    sub: "Fev 2026",
    amount: "R$ 4.800",
  },
  {
    id: "3",
    icon: "tool" as const,
    color: "amber" as const,
    title: "Chamado aberto",
    sub: "Torneira — Em andamento",
    amount: "",
  },
];

const iconColorMap: Record<string, string> = {
  blue: colors.blue,
  green: colors.green,
  amber: colors.amber,
};
const iconBgMap: Record<string, string> = {
  blue: colors.blueDim,
  green: colors.greenDim,
  amber: colors.amberDim,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [balanceHidden, setBalanceHidden] = useState(false);

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeLabel}>BEM-VINDO DE VOLTA</Text>
            <Text style={styles.welcomeName}>
              Olá, Rafael <Text style={{ fontSize: 22 }}>👋</Text>
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <View style={styles.notifDot} />
              <Feather name="bell" size={18} color={colors.gold} />
            </TouchableOpacity>
            <View style={styles.avatarBtn}>
              <Text style={styles.avatarText}>R</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Property Card */}
      <View style={styles.cardSection}>
        <TouchableOpacity style={styles.propertyCard} activeOpacity={0.92}>
          <View style={styles.cardTop}>
            <View style={styles.cardTopLeft}>
              <View style={styles.buildingIcon}>
                <Feather name="home" size={24} color={colors.blue} />
              </View>
              <View>
                <Text style={styles.aptName}>Vítor Meireles 42</Text>
                <Text style={styles.aptLocation}>Leblon, Rio de Janeiro</Text>
              </View>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>MORANDO</Text>
            </View>
          </View>

          <View style={styles.cardStats}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MENSALIDADE</Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 4, justifyContent: "center" }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBalanceHidden((h) => !h);
                }}
              >
                {balanceHidden ? (
                  <Text style={styles.hiddenVal}>•••••</Text>
                ) : (
                  <Text style={styles.statValue}>R$ 4.800</Text>
                )}
                <Feather
                  name={balanceHidden ? "eye-off" : "eye"}
                  size={13}
                  color={colors.text3}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DESDE</Text>
              <Text style={styles.statValue}>Jan 2025</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>STATUS</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Ativo</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionLabel}>AÇÕES RÁPIDAS</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: "credit-card" as const, label: "Fatura" },
            { icon: "tool" as const, label: "Chamados" },
            { icon: "headphones" as const, label: "Suporte" },
            { icon: "grid" as const, label: "Mais" },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionItem} activeOpacity={0.7}>
              <View style={[styles.actionIcon, a.label === "Mais" && styles.actionIconMore]}>
                <Feather
                  name={a.icon}
                  size={20}
                  color={a.label === "Mais" ? colors.blue : colors.gold}
                />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atividade recente</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        {activities.map((a) => (
          <TouchableOpacity key={a.id} style={styles.activityItem} activeOpacity={0.8}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: iconBgMap[a.color] },
              ]}
            >
              <Feather name={a.icon} size={18} color={iconColorMap[a.color]} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{a.title}</Text>
              <Text style={styles.activitySub}>{a.sub}</Text>
            </View>
            {a.amount ? (
              <Text style={styles.activityAmount}>{a.amount}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.headerGrad1,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeLabel: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: colors.text3,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: colors.text,
  },
  headerActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201,169,110,0.14)",
    borderWidth: 1,
    borderColor: "rgba(201,169,110,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: colors.red,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.headerGrad1,
    zIndex: 1,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201,169,110,0.18)",
    borderWidth: 1,
    borderColor: "rgba(201,169,110,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: colors.gold,
  },
  cardSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.bg,
  },
  propertyCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    borderRadius: 24,
    padding: 22,
    gap: 18,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTopLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  buildingIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(26,37,64,1)",
    borderWidth: 1,
    borderColor: "rgba(99,140,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  aptName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 2,
  },
  aptLocation: { fontSize: 12, color: colors.text2 },
  cardBadge: {
    backgroundColor: "rgba(201,169,110,0.12)",
    borderWidth: 1,
    borderColor: "rgba(201,169,110,0.25)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: colors.gold,
    letterSpacing: 1,
  },
  cardStats: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 1,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
  hiddenVal: {
    fontSize: 13,
    color: colors.text3,
    fontWeight: "500" as const,
    letterSpacing: 2,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: colors.green,
    borderRadius: 3,
  },
  statusText: { fontSize: 12, fontWeight: "600" as const, color: colors.green },
  actionsSection: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 1.5,
    marginBottom: 18,
  },
  actionsGrid: { flexDirection: "row", justifyContent: "space-between" },
  actionItem: { alignItems: "center", gap: 8 },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(201,169,110,0.09)",
    borderWidth: 1,
    borderColor: "rgba(201,169,110,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconMore: {
    backgroundColor: "rgba(26,37,64,1)",
    borderColor: "rgba(99,140,255,0.25)",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: colors.text2,
  },
  recentSection: { paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.8)",
  },
  seeAll: { fontSize: 12, color: colors.gold },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: { flex: 1 },
  activityTitle: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 2,
  },
  activitySub: { fontSize: 11, color: colors.text3 },
  activityAmount: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
});
