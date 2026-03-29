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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const SCREEN_W = Dimensions.get("window").width;

type PanelKey = "vida" | "historico" | "preferencias" | null;

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
    panelKey === "vida"
      ? "Minha vida"
      : panelKey === "historico"
        ? "Meu histórico"
        : "Minhas preferências";

  return (
    <Modal visible={!!panelKey} transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={[styles.panelRoot, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* Header */}
        <View
          style={[styles.panelHeader, { paddingTop: topPad + 12 }]}
        >
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
          {panelKey === "vida" && <VidaContent />}
          {panelKey === "historico" && <HistoricoContent />}
          {panelKey === "preferencias" && <PreferenciasContent />}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ── PANEL CONTENTS ────────────────────────────────────────────────────────────
function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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

function VidaContent() {
  return (
    <>
      <DetailCard title="Pessoal">
        <DetailRow label="Estado civil" val="Casado" />
        <DetailRow label="Profissão" val="Designer de produto" />
        <DetailRow label="Trabalha de casa" val="3× por semana" />
        <DetailRow label="Rotina noturna" val="Dorme cedo" />
      </DetailCard>

      <DetailCard title="Cônjuge">
        <DetailRow label="Nome" val="Carlos Oliveira" />
        <DetailRow label="Nascimento" val="12 Mar 1988 · 37 anos" />
        <DetailRow label="Profissão" val="Engenheiro civil" />
      </DetailCard>

      <DetailCard title="Filhos · 1">
        <View style={styles.petCard}>
          <View style={styles.petAvatar}>
            <Text style={styles.petEmoji}>👦</Text>
          </View>
          <View>
            <Text style={styles.petName}>Pedro Oliveira</Text>
            <Text style={styles.petDetail}>4 anos · nascido em 08 Jun 2021</Text>
          </View>
        </View>
      </DetailCard>

      <DetailCard title="Pets · 3 no total">
        {[
          { emoji: "🐕", name: "Bolinha", detail: "Golden Retriever · 3 anos" },
          { emoji: "🐕", name: "Fred", detail: "Labrador · 5 anos" },
          { emoji: "🐈", name: "Mia", detail: "Siamesa · 2 anos" },
        ].map((p, i) => (
          <View key={i} style={[styles.petCard, i > 0 && { marginTop: 10 }]}>
            <View style={styles.petAvatar}>
              <Text style={styles.petEmoji}>{p.emoji}</Text>
            </View>
            <View>
              <Text style={styles.petName}>{p.name}</Text>
              <Text style={styles.petDetail}>{p.detail}</Text>
            </View>
          </View>
        ))}
      </DetailCard>
    </>
  );
}

function HistoricoContent() {
  return (
    <>
      {/* Mini metrics */}
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

      {/* History items */}
      {[
        {
          name: "Apto 304 · Torre B",
          loc: "Jardins, SP",
          period: "Mar 2026 → atual",
          dur: "Atual",
          stars: 0,
          current: true,
        },
        {
          name: "Apto 201 · Torre A",
          loc: "Vila Madalena, SP",
          period: "Jun 2024 – Fev 2026",
          dur: "20 meses",
          stars: 5,
          current: false,
        },
        {
          name: "Studio 12 · Ed. Central",
          loc: "Pinheiros, SP",
          period: "Jan 2023 – Mai 2024",
          dur: "16 meses",
          stars: 4,
          current: false,
        },
      ].map((h, i) => (
        <View key={i} style={styles.histItem}>
          <View style={styles.histIcon}>
            <Ionicons name="business" size={20} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.histName}>{h.name}</Text>
            <Text style={styles.histSub}>
              {h.loc} · {h.period}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.histDur}>{h.dur}</Text>
            {h.stars > 0 && (
              <View style={styles.histStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Feather
                    key={s}
                    name="star"
                    size={10}
                    color={s <= h.stars ? colors.gold : "rgba(255,255,255,0.2)"}
                  />
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
            <Text style={styles.detailRowLabel}>
              {p.emoji}{"  "}{p.label}
            </Text>
            <Text style={[styles.detailRowVal, { color: colors.text3, fontSize: 12 }]}>
              {p.rank}
            </Text>
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
          {/* Glow orb */}
          <View style={styles.heroGlow} pointerEvents="none" />

          <View style={styles.heroTop}>
            {/* Avatar */}
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>M</Text>
              </View>
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

          {/* Edit profile button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Feather name="edit-2" size={14} color={colors.text2} />
            <Text style={styles.editProfileBtnText}>Editar perfil</Text>
          </TouchableOpacity>

          {/* Plan badge */}
          <View style={styles.planBadge}>
            <Feather name="star" size={12} color={colors.gold} />
            <Text style={styles.planBadgeText}>Assinante HaaS · desde 2021</Text>
          </View>

          {/* Completion */}
          <View style={styles.completionWrap}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionLabel}>Completude do perfil</Text>
              <Text style={styles.completionPct}>{profileComplete}%</Text>
            </View>
            <View style={styles.completionTrack}>
              <View style={[styles.completionFill, { width: `${profileComplete}%` as any }]} />
            </View>
            <View style={styles.completionHintRow}>
              <Feather name="zap" size={11} color={colors.gold} />
              <Text style={styles.completionHint}>
                Complete seu perfil para matches mais precisos
              </Text>
            </View>
            <View style={styles.completionMissingWrap}>
              <Text style={styles.completionMissingTitle}>O que falta:</Text>
              {[
                { icon: "camera", label: "Foto de perfil" },
                { icon: "phone", label: "Telefone de contato" },
                { icon: "briefcase", label: "Comprovante de renda" },
              ].map((item, i) => (
                <View key={i} style={styles.completionMissingItem}>
                  <View style={styles.completionMissingDot} />
                  <Feather name={item.icon as any} size={12} color={colors.text3} />
                  <Text style={styles.completionMissingText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── BLOCKS ── */}
        <View style={styles.sections}>

          {/* MINHA VIDA */}
          <Text style={styles.sectionLabel}>Sobre mim</Text>
          <TouchableOpacity
            style={styles.blockCard}
            activeOpacity={0.85}
            onPress={() => openPanel("vida")}
          >
            <View style={styles.blockHeader}>
              <View style={[styles.blockIcon, { backgroundColor: colors.goldDim, borderColor: colors.goldBorder }]}>
                <Feather name="users" size={18} color={colors.gold} />
              </View>
              <View style={styles.blockTitleWrap}>
                <Text style={styles.blockTitle}>Minha vida</Text>
                <Text style={styles.blockSub}>Casado · 1 filho · Trabalha de casa</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.text3} />
            </View>
            <View style={styles.pillsRow}>
              <View style={styles.pill}><Text style={styles.pillText}>🐕 2 cães</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>🐈 1 gato</Text></View>
              <View style={[styles.pill, styles.pillGold]}><Text style={styles.pillGoldText}>👶 1 filho</Text></View>
            </View>
          </TouchableOpacity>

          {/* MINHAS PREFERÊNCIAS */}
          <TouchableOpacity
            style={styles.blockCard}
            activeOpacity={0.85}
            onPress={() => openPanel("preferencias")}
          >
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

            {/* 2×2 pref grid */}
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

          {/* MEU HISTÓRICO */}
          <Text style={[styles.sectionLabel, { marginTop: 4 }]}>Trajetória</Text>
          <TouchableOpacity
            style={styles.blockCard}
            activeOpacity={0.85}
            onPress={() => openPanel("historico")}
          >
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

            {/* Metrics row */}
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

            {/* Mini timeline */}
            <View style={styles.miniTimeline}>
              {[
                { name: "Apto 304 · Torre B · atual", dur: "→", current: true },
                { name: "Apto 201 · Vila Madalena", dur: "20m", current: false },
                { name: "Studio 12 · Pinheiros", dur: "16m", current: false },
              ].map((t, i) => (
                <View key={i} style={styles.miniTlItem}>
                  <View
                    style={[
                      styles.miniTlDot,
                      t.current
                        ? { backgroundColor: colors.green }
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                  />
                  <Text style={styles.miniTlName}>{t.name}</Text>
                  <Text style={styles.miniTlDur}>{t.dur}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* PLANO / ASSINATURA ATUAL */}
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
              <Text style={styles.planName}>Apto 304 · Torre B</Text>
              <Text style={styles.planDetail}>Jardins, São Paulo · R$ 4.500/mês</Text>
              <View style={styles.planRenew}>
                <Feather name="calendar" size={10} color={colors.text3} />
                <Text style={styles.planRenewText}>Vence em 05 Abr 2026</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={colors.gold} />
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Feather name="log-out" size={15} color="rgba(255,102,102,0.7)" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Detail panels */}
      <DetailPanel
        panelKey={activePanel}
        onClose={() => setActivePanel(null)}
        insets={insets}
      />
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
    paddingBottom: 28,
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatarRing: { position: "relative" },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#2a4a7f",
    borderWidth: 3,
    borderColor: "rgba(201,169,110,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 30,
    fontFamily: "Sora_700Bold",
    color: "#fff",
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    marginBottom: 18,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontFamily: "Sora_600SemiBold",
    color: colors.text2,
  },
  identity: { marginBottom: 12 },
  userName: {
    fontSize: 24,
    fontFamily: "Sora_700Bold",
    color: colors.text,
    marginBottom: 5,
  },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  userMetaText: { fontSize: 12, color: colors.text2 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.text3 },
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
    fontFamily: "Sora_700Bold",
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
  completionPct: { fontSize: 13, fontFamily: "Sora_700Bold", color: colors.gold },
  completionTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
    marginBottom: 8,
  },
  completionFill: {
    height: "100%" as any,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  completionHintRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  completionHint: { fontSize: 11, color: colors.text3 },
  completionMissingWrap: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    gap: 8,
  },
  completionMissingTitle: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  completionMissingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  completionMissingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  completionMissingText: {
    fontSize: 12,
    color: colors.text2,
  },

  // SECTIONS
  sections: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.text3,
    letterSpacing: 1.4,
    textTransform: "uppercase",
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
  pillText: { fontSize: 11, fontWeight: "500", color: colors.text2 },
  pillGold: {
    backgroundColor: colors.goldDim,
    borderColor: colors.goldBorder,
  },
  pillGoldText: { fontSize: 11, fontWeight: "500", color: colors.gold },

  // METRICS
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
    fontWeight: "500",
    color: colors.text3,
    letterSpacing: 0.7,
    textTransform: "uppercase",
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
  miniTlDur: { fontSize: 11, fontWeight: "500", color: colors.text3 },

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
  planName: { fontSize: 15, fontFamily: "Sora_700Bold", color: colors.gold, marginBottom: 3 },
  planDetail: { fontSize: 12, color: colors.text2 },
  planRenew: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  planRenewText: { fontSize: 10, color: colors.text3 },

  // LOGOUT
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
  logoutText: { fontSize: 13, fontWeight: "500", color: "rgba(255,102,102,0.7)" },

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
    textTransform: "uppercase",
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
  histMetrics: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
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
    fontWeight: "500",
    color: colors.text3,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    textAlign: "center",
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
  histDur: { fontSize: 13, fontFamily: "Sora_600SemiBold", color: colors.text3, textAlign: "right" },
  histStars: { flexDirection: "row", gap: 2, marginTop: 3, justifyContent: "flex-end" },

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
  pillBlueText: { fontSize: 11, fontWeight: "500", color: colors.blue },
});
