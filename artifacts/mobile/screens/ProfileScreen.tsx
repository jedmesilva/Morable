import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const preferences = [
  { icon: "home", label: "2 quartos" },
  { icon: "map-pin", label: "Rio de Janeiro" },
  { icon: "heart", label: "Pet friendly" },
  { icon: "wifi", label: "Internet incluída" },
  { icon: "shield", label: "Portaria 24h" },
  { icon: "package", label: "Mobiliado" },
];

const history = [
  { name: "Rua Dias Ferreira 200", location: "Leblon", duration: "14 meses", dot: colors.blue },
  { name: "Rua Barão da Torre 88", location: "Ipanema", duration: "8 meses", dot: colors.green },
  { name: "Av. Atlântica 1702", location: "Copacabana", duration: "20 meses", dot: colors.gold },
];

const menuItems = [
  { icon: "bell", label: "Notificações", sub: "Push, e-mail e SMS" },
  { icon: "lock", label: "Privacidade e segurança", sub: "Senha e dados" },
  { icon: "help-circle", label: "Ajuda e suporte", sub: "FAQ e atendimento" },
  { icon: "info", label: "Sobre o Morable", sub: "Versão 1.0.0" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [profileComplete] = useState(72);

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: topPad + 20 }]}>
        <View style={styles.heroTop}>
          <TouchableOpacity style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={colors.text2} />
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>R</Text>
              </View>
              <View style={styles.avatarCam}>
                <Feather name="camera" size={11} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.identity}>
          <Text style={styles.userName}>Rafael Mendes</Text>
          <View style={styles.userMeta}>
            <Text style={styles.userMetaText}>rafael@email.com</Text>
            <View style={styles.metaDot} />
            <Text style={styles.userMetaText}>Desde Jan 2025</Text>
          </View>
        </View>

        <View style={styles.planBadge}>
          <Feather name="star" size={12} color={colors.gold} />
          <Text style={styles.planBadgeText}>PLANO PREMIUM</Text>
        </View>

        {/* Completion */}
        <View style={styles.completionWrap}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionLabel}>Perfil completo</Text>
            <Text style={styles.completionPct}>{profileComplete}%</Text>
          </View>
          <View style={styles.completionTrack}>
            <View
              style={[styles.completionFill, { width: `${profileComplete}%` }]}
            />
          </View>
          <Text style={styles.completionHint}>
            <Feather name="zap" size={10} color={colors.text3} /> Adicione mais preferências para melhores sugestões
          </Text>
        </View>
      </View>

      <View style={styles.sections}>
        {/* Stats */}
        <View style={styles.blockCard}>
          <View style={styles.metricsRow}>
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: colors.blue }]}>42</Text>
              <Text style={styles.metricLabel}>meses morando</Text>
            </View>
            <View style={[styles.metricCell, styles.metricCellBorder]}>
              <Text style={[styles.metricVal, { color: colors.gold }]}>3</Text>
              <Text style={styles.metricLabel}>imóveis HaaS</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={[styles.metricVal, { color: colors.green }]}>4.9</Text>
              <Text style={styles.metricLabel}>avaliação média</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.blockCard}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIcon, { backgroundColor: colors.goldDim }]}>
              <Feather name="sliders" size={18} color={colors.gold} />
            </View>
            <View style={styles.blockTitleWrap}>
              <Text style={styles.blockTitle}>Preferências</Text>
              <Text style={styles.blockSub}>Suas preferências de moradia</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.text3} />
          </View>
          <View style={styles.pillsRow}>
            {preferences.map((p) => (
              <View key={p.label} style={styles.pill}>
                <Feather name={p.icon as any} size={12} color={colors.gold} />
                <Text style={styles.pillText}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History */}
        <View style={styles.blockCard}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIcon, { backgroundColor: colors.blueDim }]}>
              <Feather name="clock" size={18} color={colors.blue} />
            </View>
            <View style={styles.blockTitleWrap}>
              <Text style={styles.blockTitle}>Histórico de moradia</Text>
              <Text style={styles.blockSub}>3 imóveis anteriores</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.text3} />
          </View>
          <View style={styles.timeline}>
            {history.map((h) => (
              <View key={h.name} style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: h.dot }]} />
                <Text style={styles.timelineName}>
                  {h.name} · {h.location}
                </Text>
                <Text style={styles.timelineDuration}>{h.duration}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.blockCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Feather name={item.icon as any} size={18} color={colors.text2} />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.text3} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() =>
            Alert.alert("Sair", "Tem certeza que deseja sair?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive" },
            ])
          }
        >
          <Feather name="log-out" size={16} color={colors.red} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  hero: {
    backgroundColor: colors.bg,
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#2a4a7f",
    borderWidth: 3,
    borderColor: "rgba(201,169,110,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700" as const,
    color: "#fff",
  },
  avatarCam: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: { marginBottom: 16 },
  userName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userMetaText: { fontSize: 12, color: colors.text2 },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text3,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(201,169,110,0.14)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginBottom: 18,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: colors.gold,
    letterSpacing: 0.8,
  },
  completionWrap: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
  },
  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  completionLabel: { fontSize: 12, color: colors.text2 },
  completionPct: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.gold,
  },
  completionTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
    marginBottom: 8,
  },
  completionFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  completionHint: { fontSize: 11, color: colors.text3 },
  sections: { padding: 20, gap: 12 },
  blockCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: "hidden",
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  blockIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  blockTitleWrap: { flex: 1 },
  blockTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 2,
  },
  blockSub: { fontSize: 12, color: colors.text2 },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: { fontSize: 11, fontWeight: "500" as const, color: colors.text2 },
  metricsRow: { flexDirection: "row" },
  metricCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  metricCellBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "500" as const,
    color: colors.text3,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    textAlign: "center",
  },
  timeline: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 14,
    gap: 10,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timelineDot: { width: 8, height: 8, borderRadius: 4 },
  timelineName: { flex: 1, fontSize: 12, color: colors.text2 },
  timelineDuration: { fontSize: 11, fontWeight: "500" as const, color: colors.text3 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { fontSize: 13, fontWeight: "500" as const, color: colors.text, marginBottom: 2 },
  menuSub: { fontSize: 11, color: colors.text3 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,102,102,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,102,102,0.14)",
    marginTop: 4,
  },
  logoutText: { fontSize: 13, fontWeight: "500" as const, color: colors.red },
});
