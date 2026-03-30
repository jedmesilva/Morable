import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const SCREEN_W = Dimensions.get("window").width;

type PanelKey = "historico" | "preferencias" | null;

// ── CIRCULAR PROGRESS AVATAR ──────────────────────────────────────────────────
function AvatarWithRing({ progress }: { progress: number }) {
  const size = 96;
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gold}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>M</Text>
      </View>
      {/* Completion badge */}
      <View style={styles.completionBadge}>
        <Text style={styles.completionBadgeText}>{progress}%</Text>
      </View>
    </View>
  );
}

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
function DetailPanel({
  panelKey,
  onClose,
  insets,
}: {
  panelKey: PanelKey;
  onClose: () => void;
  insets: { top: number; bottom: number };
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_W)).current;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: panelKey ? 0 : SCREEN_W,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [panelKey]);

  const title =
    panelKey === "historico"
      ? "Meu histórico"
      : "Minhas preferências";

  return (
    <Modal visible={!!panelKey} transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={[styles.panelRoot, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={[styles.panelHeader, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity
            style={styles.panelBack}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <Feather name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.panelTitle}>{title}</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.panelContent, { paddingBottom: insets.bottom + 32 }]}
        >
          {panelKey === "historico" && <HistoricoContent />}
          {panelKey === "preferencias" && <PreferenciasContent />}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ── PANEL CONTENTS ────────────────────────────────────────────────────────────
function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailCardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DetailRow({ label, val }: { label: string; val: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailRowLabel}>{label}</Text>
      <Text style={styles.detailRowVal}>{val}</Text>
    </View>
  );
}

function HistoricoContent() {
  return (
    <>
      <View style={styles.histMetrics}>
        {[
          { val: "3", label: "Imóveis", color: colors.text },
          { val: "19m", label: "Média", color: colors.green },
          { val: "2021", label: "Membro desde", color: colors.gold },
        ].map((m, i) => (
          <View key={i} style={styles.histMetricCell}>
            <Text style={[styles.histMetricVal, { color: m.color }]}>{m.val}</Text>
            <Text style={styles.histMetricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
      {[
        { name: "Apto 304 · Torre B", loc: "Jardins, SP", period: "Mar 2026 → atual", dur: "Atual", stars: 0, current: true },
        { name: "Apto 201 · Torre A", loc: "Vila Madalena, SP", period: "Jun 2024 – Fev 2026", dur: "20 meses", stars: 5, current: false },
        { name: "Studio 12 · Ed. Central", loc: "Pinheiros, SP", period: "Jan 2023 – Mai 2024", dur: "16 meses", stars: 4, current: false },
      ].map((h, i) => (
        <View key={i} style={styles.histItem}>
          <View style={styles.histIcon}>
            <Ionicons name="business" size={20} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.histName}>{h.name}</Text>
            <Text style={styles.histSub}>{h.loc} · {h.period}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.histDur}>{h.dur}</Text>
            {h.stars > 0 && (
              <View style={styles.histStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Feather key={s} name="star" size={10} color={s <= h.stars ? colors.gold : "rgba(255,255,255,0.2)"} />
                ))}
              </View>
            )}
          </View>
        </View>
      ))}
    </>
  );
}

function PreferenciasContent() {
  return (
    <>
      <DetailCard title="Imóvel ideal">
        <DetailRow label="Tipo" val="Apartamento" />
        <DetailRow label="Tamanho mínimo" val="60m²" />
        <DetailRow label="Quartos" val="2+" />
        <DetailRow label="Orçamento" val="Até R$ 5.500/mês" />
      </DetailCard>
      <DetailCard title="Prioridades">
        {[
          { emoji: "🐾", label: "Aceita pets", rank: "#1" },
          { emoji: "📶", label: "Internet inclusa", rank: "#2" },
          { emoji: "🔇", label: "Silencioso", rank: "#3" },
          { emoji: "🚗", label: "Vaga de garagem", rank: "#4" },
          { emoji: "💪", label: "Academia", rank: "#5" },
        ].map((p, i) => (
          <View key={i} style={styles.detailRow}>
            <Text style={styles.detailRowLabel}>{p.emoji}{"  "}{p.label}</Text>
            <Text style={[styles.detailRowVal, { color: colors.text3, fontSize: 12 }]}>{p.rank}</Text>
          </View>
        ))}
      </DetailCard>
      <DetailCard title="Bairros favoritos">
        <View style={styles.prefNeighWrap}>
          {["Jardins", "Vila Madalena", "Pinheiros", "Itaim Bibi"].map((b, i) => (
            <View key={i} style={styles.pillBlue}>
              <Feather name="map-pin" size={10} color={colors.blue} />
              <Text style={styles.pillBlueText}>{b}</Text>
            </View>
          ))}
        </View>
      </DetailCard>
    </>
  );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activePanel, setActivePanel] = useState<PanelKey>(null);
  const profileComplete = 72;

  const openPanel = (key: PanelKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivePanel(key);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ── HERO ── */}
        <View style={[styles.hero, { paddingTop: topPad + 16 }]}>
          <View style={styles.heroGlow} pointerEvents="none" />

          {/* Avatar row: ring + edit button side by side */}
          <View style={styles.heroTop}>
            <AvatarWithRing progress={profileComplete} />
            <View style={styles.heroTopRight}>
              <TouchableOpacity
                style={styles.editProfileBtn}
                activeOpacity={0.8}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Feather name="edit-2" size={14} color={colors.text2} />
                <Text style={styles.editProfileBtnText}>Editar perfil</Text>
              </TouchableOpacity>
              {/* Completion hint */}
              <TouchableOpacity
                style={styles.completionHintRow}
                activeOpacity={0.75}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Feather name="zap" size={11} color={colors.gold} />
                <Text style={styles.completionHint}>
                  Adicione foto para mais matches
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Identity */}
          <View style={styles.identity}>
            <Text style={styles.userName}>Marina Oliveira</Text>
            <View style={styles.userMeta}>
              <Text style={styles.userMetaText}>São Paulo, SP</Text>
              <View style={styles.metaDot} />
              <Text style={styles.userMetaText}>Membro desde 2021</Text>
            </View>
          </View>

          {/* Metrics strip */}
          <View style={styles.metricsStrip}>
            {[
              { val: "3", label: "Imóveis", color: colors.text },
              { val: "19m", label: "Média locação", color: colors.green },
              { val: "4,7 ★", label: "Avaliação", color: colors.gold },
            ].map((m, i, arr) => (
              <View
                key={i}
                style={[
                  styles.metricStripCell,
                  i < arr.length - 1 && styles.metricStripCellBorder,
                ]}
              >
                <Text style={[styles.metricStripVal, { color: m.color }]}>{m.val}</Text>
                <Text style={styles.metricStripLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── BLOCKS ── */}
        <View style={styles.sections}>

          {/* SOBRE MIM */}
          <Text style={styles.sectionLabel}>Sobre mim</Text>

          {/* 2-column grid of individual info cards */}
          <View style={styles.infoGrid}>

            {/* Profissão */}
            <View style={styles.infoCard}>
              <View style={[styles.infoCardIcon, { backgroundColor: colors.blueDim, borderColor: "rgba(77,124,254,0.2)" }]}>
                <Feather name="briefcase" size={16} color={colors.blue} />
              </View>
              <Text style={styles.infoCardLabel}>Profissão</Text>
              <Text style={styles.infoCardVal}>Designer de produto</Text>
              <View style={styles.infoCardChip}>
                <Feather name="monitor" size={10} color={colors.text3} />
                <Text style={styles.infoCardChipText}>Home office 3×/sem</Text>
              </View>
            </View>

            {/* Estado civil */}
            <View style={styles.infoCard}>
              <View style={[styles.infoCardIcon, { backgroundColor: colors.goldDim, borderColor: colors.goldBorder }]}>
                <Feather name="heart" size={16} color={colors.gold} />
              </View>
              <Text style={styles.infoCardLabel}>Estado civil</Text>
              <Text style={styles.infoCardVal}>Casado</Text>
              <View style={styles.infoCardChip}>
                <Feather name="user" size={10} color={colors.text3} />
                <Text style={styles.infoCardChipText}>Carlos · Eng. Civil</Text>
              </View>
            </View>

            {/* Filhos */}
            <View style={styles.infoCard}>
              <View style={[styles.infoCardIcon, { backgroundColor: "rgba(167,139,250,0.1)", borderColor: "rgba(167,139,250,0.2)" }]}>
                <Text style={{ fontSize: 16 }}>👦</Text>
              </View>
              <Text style={styles.infoCardLabel}>Filhos</Text>
              <Text style={styles.infoCardVal}>1 filho</Text>
              <View style={styles.infoCardChip}>
                <Feather name="calendar" size={10} color={colors.text3} />
                <Text style={styles.infoCardChipText}>Pedro · 4 anos</Text>
              </View>
            </View>

            {/* Pets */}
            <View style={styles.infoCard}>
              <View style={[styles.infoCardIcon, { backgroundColor: colors.greenDim, borderColor: "rgba(62,207,142,0.2)" }]}>
                <MaterialCommunityIcons name="paw" size={16} color={colors.green} />
              </View>
              <Text style={styles.infoCardLabel}>Pets</Text>
              <Text style={styles.infoCardVal}>3 pets</Text>
              <View style={styles.infoCardChip}>
                <Text style={styles.infoCardChipText}>🐕 🐕 🐈</Text>
              </View>
            </View>

          </View>

          <TouchableOpacity style={styles.blockCard} activeOpacity={0.85} onPress={() => openPanel("preferencias")}>
            <View style={styles.blockHeader}>
              <View style={[styles.blockIcon, { backgroundColor: colors.greenDim, borderColor: "rgba(62,207,142,0.2)" }]}>
                <Ionicons name="heart" size={18} color={colors.green} />
              </View>
              <View style={styles.blockTitleWrap}>
                <Text style={styles.blockTitle}>Minhas preferências</Text>
                <Text style={styles.blockSub}>Alimenta o match dos imóveis</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.text3} />
            </View>
            <View style={styles.prefGrid}>
              {[
                { icon: <MaterialCommunityIcons name="paw" size={13} color={colors.green} />, label: "Pets OK", bg: colors.greenDim },
                { icon: <Feather name="wifi" size={13} color={colors.blue} />, label: "Internet", bg: colors.blueDim },
                { icon: <Feather name="truck" size={13} color={colors.gold} />, label: "Garagem", bg: colors.goldDim },
                { icon: <MaterialCommunityIcons name="dumbbell" size={13} color="rgba(167,139,250,0.9)" />, label: "Academia", bg: "rgba(167,139,250,0.08)" },
              ].map((p, i) => (
                <View key={i} style={styles.prefItem}>
                  <View style={[styles.prefIcon, { backgroundColor: p.bg }]}>{p.icon}</View>
                  <Text style={styles.prefLabel}>{p.label}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* TRAJETÓRIA */}
          <Text style={[styles.sectionLabel, { marginTop: 4 }]}>Trajetória</Text>
          <TouchableOpacity style={styles.blockCard} activeOpacity={0.85} onPress={() => openPanel("historico")}>
            <View style={styles.blockHeader}>
              <View style={[styles.blockIcon, { backgroundColor: colors.blueDim, borderColor: "rgba(77,124,254,0.2)" }]}>
                <Feather name="trending-up" size={18} color={colors.blue} />
              </View>
              <View style={styles.blockTitleWrap}>
                <Text style={styles.blockTitle}>Meu histórico</Text>
                <Text style={styles.blockSub}>3 imóveis · média de 19 meses</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.text3} />
            </View>
            <View style={styles.metricsRow}>
              <View style={styles.metricCell}>
                <Text style={styles.metricVal}>3</Text>
                <Text style={styles.metricLabel}>Imóveis</Text>
              </View>
              <View style={[styles.metricCell, styles.metricCellBorder]}>
                <Text style={[styles.metricVal, { color: colors.green }]}>19m</Text>
                <Text style={styles.metricLabel}>Média</Text>
              </View>
              <View style={styles.metricCell}>
                <Text style={[styles.metricVal, { color: colors.gold }]}>4,7</Text>
                <Text style={styles.metricLabel}>Nota média</Text>
              </View>
            </View>
            <View style={styles.miniTimeline}>
              {[
                { name: "Apto 304 · Torre B · atual", dur: "→", current: true },
                { name: "Apto 201 · Vila Madalena", dur: "20m", current: false },
                { name: "Studio 12 · Pinheiros", dur: "16m", current: false },
              ].map((t, i) => (
                <View key={i} style={styles.miniTlItem}>
                  <View style={[styles.miniTlDot, { backgroundColor: t.current ? colors.green : "rgba(255,255,255,0.2)" }]} />
                  <Text style={styles.miniTlName}>{t.name}</Text>
                  <Text style={styles.miniTlDur}>{t.dur}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* ASSINATURA ATUAL */}
          <Text style={[styles.sectionLabel, { marginTop: 4 }]}>Assinatura atual</Text>
          <TouchableOpacity
            style={styles.planCard}
            activeOpacity={0.85}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <View style={styles.planIcon}>
              <Ionicons name="business" size={22} color="#fff" />
            </View>
            <View style={styles.planInfo}>
              <View style={styles.planTopRow}>
                <Text style={styles.planName}>Apto 304 · Torre B</Text>
                <View style={styles.haasBadge}>
                  <Feather name="star" size={10} color={colors.gold} />
                  <Text style={styles.haasBadgeText}>HaaS</Text>
                </View>
              </View>
              <Text style={styles.planDetail}>Jardins, São Paulo · R$ 4.500/mês</Text>
              <View style={styles.planRenew}>
                <Feather name="calendar" size={10} color={colors.text3} />
                <Text style={styles.planRenewText}>Vence em 05 Abr 2026</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={colors.gold} />
          </TouchableOpacity>

          {/* CONTA */}
          <Text style={[styles.sectionLabel, { marginTop: 4 }]}>Conta</Text>
          <View style={styles.accountCard}>
            {[
              { icon: "bell", label: "Notificações", sub: "Push, e-mail e SMS" },
              { icon: "lock", label: "Privacidade", sub: "Dados e preferências" },
              { icon: "help-circle", label: "Ajuda", sub: "Central de suporte" },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={i}
                style={[styles.accountRow, i < arr.length - 1 && styles.accountRowBorder]}
                activeOpacity={0.75}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <View style={styles.accountRowIcon}>
                  <Feather name={item.icon as any} size={16} color={colors.text2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountRowLabel}>{item.label}</Text>
                  <Text style={styles.accountRowSub}>{item.sub}</Text>
                </View>
                <Feather name="chevron-right" size={14} color={colors.text3} />
              </TouchableOpacity>
            ))}
          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <View style={styles.logoutIcon}>
              <Feather name="log-out" size={16} color="rgba(255,102,102,0.8)" />
            </View>
            <Text style={styles.logoutText}>Sair da conta</Text>
            <Feather name="chevron-right" size={14} color="rgba(255,102,102,0.4)" />
          </TouchableOpacity>

        </View>
      </ScrollView>

      <DetailPanel panelKey={activePanel} onClose={() => setActivePanel(null)} insets={insets} />
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },

  // HERO
  hero: {
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    paddingBottom: 24,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(201,169,110,0.07)",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  heroTopRight: {
    flex: 1,
    gap: 10,
  },

  // AVATAR
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2a4a7f",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontFamily: "Sora_700Bold",
    color: "#fff",
  },
  completionBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  completionBadgeText: {
    fontSize: 9,
    fontFamily: "Sora_700Bold",
    color: colors.bg,
  },

  // EDIT BUTTON
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
  },
  editProfileBtnText: {
    fontSize: 13,
    fontFamily: "Sora_600SemiBold",
    color: colors.text2,
  },
  completionHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  completionHint: {
    fontSize: 11,
    color: colors.text3,
    flex: 1,
    flexWrap: "wrap",
  },

  // IDENTITY
  identity: { marginBottom: 16 },
  userName: {
    fontSize: 24,
    fontFamily: "Sora_700Bold",
    color: colors.text,
    marginBottom: 5,
  },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  userMetaText: { fontSize: 12, color: colors.text2 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.text3 },

  // METRICS STRIP
  metricsStrip: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: "hidden",
  },
  metricStripCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  metricStripCellBorder: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  metricStripVal: {
    fontSize: 17,
    fontFamily: "Sora_700Bold",
    color: colors.text,
    marginBottom: 3,
  },
  metricStripLabel: {
    fontSize: 9,
    fontWeight: "500" as const,
    color: colors.text3,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
  },

  // INFO GRID (individual cards)
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoCard: {
    width: "47.5%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  infoCardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  infoCardLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  infoCardVal: {
    fontSize: 15,
    fontFamily: "Sora_600SemiBold",
    color: colors.text,
  },
  infoCardChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  infoCardChipText: {
    fontSize: 11,
    color: colors.text3,
  },

  // SECTIONS
  sections: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
    marginBottom: 4,
    paddingLeft: 2,
  },

  // BLOCK CARDS
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
    paddingBottom: 14,
  },
  blockIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  blockTitleWrap: { flex: 1 },
  blockTitle: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 2 },
  blockSub: { fontSize: 12, color: colors.text2 },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: { fontSize: 11, fontWeight: "500" as const, color: colors.text2 },
  pillGold: { backgroundColor: colors.goldDim, borderColor: colors.goldBorder },
  pillGoldText: { fontSize: 11, fontWeight: "500" as const, color: colors.gold },

  // METRICS (inside historico card)
  metricsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metricCell: { flex: 1, alignItems: "center", paddingVertical: 14 },
  metricCellBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  metricVal: {
    fontSize: 18,
    fontFamily: "Sora_700Bold",
    color: colors.text,
    marginBottom: 3,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "500" as const,
    color: colors.text3,
    letterSpacing: 0.7,
    textTransform: "uppercase" as const,
  },

  // MINI TIMELINE
  miniTimeline: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 14,
    gap: 10,
  },
  miniTlItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  miniTlDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  miniTlName: { flex: 1, fontSize: 12, color: colors.text2 },
  miniTlDur: { fontSize: 11, fontWeight: "500" as const, color: colors.text3 },

  // PREF GRID
  prefGrid: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  prefItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prefIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  prefLabel: { fontSize: 12, color: colors.text2 },

  // PLAN CARD
  planCard: {
    backgroundColor: "rgba(201,169,110,0.06)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  planInfo: { flex: 1 },
  planTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  planName: { fontSize: 15, fontFamily: "Sora_700Bold", color: colors.gold },
  haasBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(201,169,110,0.18)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  haasBadgeText: {
    fontSize: 9,
    fontFamily: "Sora_700Bold",
    color: colors.gold,
    letterSpacing: 0.5,
  },
  planDetail: { fontSize: 12, color: colors.text2 },
  planRenew: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  planRenewText: { fontSize: 10, color: colors.text3 },

  // ACCOUNT CARD
  accountCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: "hidden",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  accountRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  accountRowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  accountRowLabel: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 1 },
  accountRowSub: { fontSize: 11, color: colors.text3 },

  // LOGOUT
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "rgba(255,102,102,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,102,102,0.14)",
    borderRadius: 20,
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,102,102,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,102,102,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { flex: 1, fontSize: 14, fontFamily: "Sora_600SemiBold", color: "rgba(255,102,102,0.8)" },

  // DETAIL PANEL
  panelRoot: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    zIndex: 100,
  },
  panelHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.bg,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  panelBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
  },
  panelTitle: { fontSize: 18, fontFamily: "Sora_700Bold", color: colors.text },
  panelContent: { padding: 20, gap: 12 },

  // DETAIL CARD
  detailCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
  },
  detailCardTitle: {
    fontSize: 11,
    fontFamily: "Sora_600SemiBold",
    color: colors.text3,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRowLabel: { fontSize: 13, color: colors.text2 },
  detailRowVal: { fontSize: 13, fontFamily: "Sora_600SemiBold", color: colors.text },

  // PET CARD
  petCard: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  petAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  petEmoji: { fontSize: 24 },
  petName: { fontSize: 15, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 3 },
  petDetail: { fontSize: 12, color: colors.text2 },

  // HISTORY (panel)
  histMetrics: { flexDirection: "row", gap: 8, marginBottom: 4 },
  histMetricCell: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  histMetricVal: { fontSize: 18, fontFamily: "Sora_700Bold", color: colors.text, marginBottom: 3 },
  histMetricLabel: {
    fontSize: 9,
    fontWeight: "500" as const,
    color: colors.text3,
    letterSpacing: 0.7,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
  },
  histItem: {
    backgroundColor: "#1a2230",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  histIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.blueDim,
    borderWidth: 1,
    borderColor: "rgba(77,124,254,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  histName: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 2 },
  histSub: { fontSize: 11, color: colors.text2 },
  histDur: { fontSize: 13, fontFamily: "Sora_600SemiBold", color: colors.text3, textAlign: "right" as const },
  histStars: { flexDirection: "row", gap: 2, marginTop: 3, justifyContent: "flex-end" as const },

  // PREFERENCES (panel)
  prefNeighWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 4 },
  pillBlue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    backgroundColor: colors.blueDim,
    borderWidth: 1,
    borderColor: "rgba(77,124,254,0.22)",
  },
  pillBlueText: { fontSize: 11, fontWeight: "500" as const, color: colors.blue },
});
