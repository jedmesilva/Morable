import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const SCREEN_W = Dimensions.get("window").width;

type PanelKey = "historico" | null;

// ── PREFS STATE ───────────────────────────────────────────────────────────────
interface Prefs {
  tipos: string[];
  quartos: number | null;
  minArea: number;
  maxBudget: number;
  prioridades: string[];
  bairros: string[];
}

const DEFAULT_PREFS: Prefs = {
  tipos: ["Apartamento"],
  quartos: 2,
  minArea: 60,
  maxBudget: 5500,
  prioridades: ["Aceita pets", "Internet inclusa", "Silencioso", "Vaga de garagem", "Academia"],
  bairros: ["Jardins", "Vila Madalena", "Pinheiros", "Itaim Bibi"],
};

const TIPOS = ["Apartamento", "Casa", "Studio", "Cobertura"];
const PRIORIDADE_OPTIONS = [
  { emoji: "🐾", label: "Aceita pets" },
  { emoji: "📶", label: "Internet inclusa" },
  { emoji: "🔇", label: "Silencioso" },
  { emoji: "🚗", label: "Vaga de garagem" },
  { emoji: "💪", label: "Academia" },
  { emoji: "🪑", label: "Mobiliado" },
  { emoji: "🔒", label: "Segurança 24h" },
  { emoji: "🌿", label: "Área verde" },
];

function formatBudget(val: number) {
  return `R$ ${val.toLocaleString("pt-BR")}`;
}

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
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.gold} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
          rotation="-90" origin={`${size / 2}, ${size / 2}`} />
      </Svg>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>M</Text>
      </View>
      <View style={styles.completionBadge}>
        <Text style={styles.completionBadgeText}>{progress}%</Text>
      </View>
    </View>
  );
}

// ── HISTORICO PANEL ───────────────────────────────────────────────────────────
function HistoricoPanel({
  visible, onClose, insets,
}: { visible: boolean; onClose: () => void; insets: { top: number; bottom: number } }) {
  const slideAnim = useRef(new Animated.Value(SCREEN_W)).current;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : SCREEN_W,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.panelRoot, { transform: [{ translateX: slideAnim }] }]}>
        <View style={[styles.panelHeader, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity style={styles.panelBack} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}>
            <Feather name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.panelTitle}>Meu histórico</Text>
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.panelContent, { paddingBottom: insets.bottom + 32 }]}>
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
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ── PREFERENCIAS PANEL (editable) ─────────────────────────────────────────────
function PreferenciasPanel({
  visible, prefs, onClose, onSave, insets,
}: {
  visible: boolean;
  prefs: Prefs;
  onClose: () => void;
  onSave: (p: Prefs) => void;
  insets: { top: number; bottom: number };
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_W)).current;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [draft, setDraft] = useState<Prefs>(prefs);
  const [bairroInput, setBairroInput] = useState("");

  useEffect(() => {
    if (visible) setDraft(prefs);
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : SCREEN_W,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const toggleTipo = (t: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft((d) => ({
      ...d,
      tipos: d.tipos.includes(t) ? d.tipos.filter((x) => x !== t) : [...d.tipos, t],
    }));
  };

  const togglePrioridade = (p: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft((d) => ({
      ...d,
      prioridades: d.prioridades.includes(p)
        ? d.prioridades.filter((x) => x !== p)
        : [...d.prioridades, p],
    }));
  };

  const addBairro = () => {
    const b = bairroInput.trim();
    if (!b || draft.bairros.includes(b)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft((d) => ({ ...d, bairros: [...d.bairros, b] }));
    setBairroInput("");
    Keyboard.dismiss();
  };

  const removeBairro = (b: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft((d) => ({ ...d, bairros: d.bairros.filter((x) => x !== b) }));
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.panelRoot, { transform: [{ translateX: slideAnim }] }]}>

        {/* Header */}
        <View style={[styles.panelHeader, { paddingTop: topPad + 12 }]}>
          <TouchableOpacity style={styles.panelBack} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}>
            <Feather name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.panelTitle}>Preferências</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.panelContent, { paddingBottom: insets.bottom + 40 }]}
        >

          {/* ── TIPO DE IMÓVEL ── */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Tipo de imóvel</Text>
            <Text style={styles.editSectionSub}>Selecione todos que aceita</Text>
            <View style={styles.chipRow}>
              {TIPOS.map((t) => {
                const active = draft.tipos.includes(t);
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.selectChip, active && styles.selectChipActive]}
                    onPress={() => toggleTipo(t)}
                    activeOpacity={0.75}
                  >
                    {active && <Feather name="check" size={12} color={colors.gold} />}
                    <Text style={[styles.selectChipText, active && styles.selectChipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── QUARTOS ── */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Quartos mínimos</Text>
            <Text style={styles.editSectionSub}>Número mínimo de quartos</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={[styles.stepperBtn, (draft.quartos ?? 0) <= 0 && styles.stepperBtnDisabled]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDraft((d) => ({ ...d, quartos: d.quartos === null ? null : Math.max(1, d.quartos - 1) }));
                }}
              >
                <Feather name="minus" size={18} color={colors.text2} />
              </TouchableOpacity>
              <View style={styles.stepperVal}>
                <Text style={styles.stepperValText}>
                  {draft.quartos === null ? "Qualquer" : draft.quartos === 4 ? "4+" : String(draft.quartos)}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.stepperBtn, (draft.quartos ?? 0) >= 4 && styles.stepperBtnDisabled]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDraft((d) => ({ ...d, quartos: Math.min(4, (d.quartos ?? 0) + 1) }));
                }}
              >
                <Feather name="plus" size={18} color={colors.text2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.anyBtn, draft.quartos === null && styles.anyBtnActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDraft((d) => ({ ...d, quartos: d.quartos === null ? 1 : null }));
                }}
              >
                <Text style={[styles.anyBtnText, draft.quartos === null && styles.anyBtnTextActive]}>Qualquer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── TAMANHO MÍNIMO ── */}
          <View style={styles.editSection}>
            <View style={styles.editSectionTitleRow}>
              <Text style={styles.editSectionTitle}>Tamanho mínimo</Text>
              <View style={styles.valueBadge}>
                <Text style={styles.valueBadgeText}>{draft.minArea}m²</Text>
              </View>
            </View>
            <Text style={styles.editSectionSub}>Área útil mínima do imóvel</Text>
            <Slider
              style={styles.slider}
              minimumValue={20}
              maximumValue={200}
              step={5}
              value={draft.minArea}
              onValueChange={(v) => setDraft((d) => ({ ...d, minArea: v }))}
              minimumTrackTintColor={colors.gold}
              maximumTrackTintColor="rgba(255,255,255,0.12)"
              thumbTintColor={colors.gold}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>20m²</Text>
              <Text style={styles.sliderLabel}>200m²</Text>
            </View>
          </View>

          {/* ── ORÇAMENTO ── */}
          <View style={styles.editSection}>
            <View style={styles.editSectionTitleRow}>
              <Text style={styles.editSectionTitle}>Orçamento máximo</Text>
              <View style={styles.valueBadge}>
                <Text style={styles.valueBadgeText}>{formatBudget(draft.maxBudget)}/mês</Text>
              </View>
            </View>
            <Text style={styles.editSectionSub}>Valor máximo da mensalidade</Text>
            <Slider
              style={styles.slider}
              minimumValue={1000}
              maximumValue={15000}
              step={500}
              value={draft.maxBudget}
              onValueChange={(v) => setDraft((d) => ({ ...d, maxBudget: v }))}
              minimumTrackTintColor={colors.gold}
              maximumTrackTintColor="rgba(255,255,255,0.12)"
              thumbTintColor={colors.gold}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>R$ 1.000</Text>
              <Text style={styles.sliderLabel}>R$ 15.000</Text>
            </View>
          </View>

          {/* ── PRIORIDADES ── */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Prioridades</Text>
            <Text style={styles.editSectionSub}>O que mais importa no imóvel</Text>
            <View style={styles.prioList}>
              {PRIORIDADE_OPTIONS.map((opt) => {
                const active = draft.prioridades.includes(opt.label);
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.prioItem, active && styles.prioItemActive]}
                    onPress={() => togglePrioridade(opt.label)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.prioEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.prioLabel, active && styles.prioLabelActive]}>{opt.label}</Text>
                    <View style={[styles.prioCheck, active && styles.prioCheckActive]}>
                      {active && <Feather name="check" size={11} color={colors.gold} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── BAIRROS FAVORITOS ── */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Bairros favoritos</Text>
            <Text style={styles.editSectionSub}>Regiões de interesse para busca</Text>
            <View style={styles.bairroChips}>
              {draft.bairros.map((b) => (
                <View key={b} style={styles.bairroChip}>
                  <Feather name="map-pin" size={10} color={colors.blue} />
                  <Text style={styles.bairroChipText}>{b}</Text>
                  <TouchableOpacity
                    onPress={() => removeBairro(b)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="x" size={11} color={colors.blue} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.bairroInputRow}>
              <TextInput
                value={bairroInput}
                onChangeText={setBairroInput}
                placeholder="Adicionar bairro ou cidade..."
                placeholderTextColor={colors.text3}
                style={styles.bairroInput}
                returnKeyType="done"
                onSubmitEditing={addBairro}
              />
              <TouchableOpacity
                style={[styles.bairroAddBtn, !bairroInput.trim() && styles.bairroAddBtnDisabled]}
                onPress={addBairro}
                disabled={!bairroInput.trim()}
              >
                <Feather name="plus" size={16} color={bairroInput.trim() ? colors.blue : colors.text3} />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [historicoVisible, setHistoricoVisible] = useState(false);
  const [prefsPanelVisible, setPrefsPanelVisible] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const profileComplete = 72;

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
              <TouchableOpacity style={styles.completionHintRow} activeOpacity={0.75}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Feather name="zap" size={11} color={colors.gold} />
                <Text style={styles.completionHint}>Adicione foto para mais matches</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.identity}>
            <Text style={styles.userName}>Marina Oliveira</Text>
            <View style={styles.userMeta}>
              <Text style={styles.userMetaText}>São Paulo, SP</Text>
              <View style={styles.metaDot} />
              <Text style={styles.userMetaText}>Membro desde 2021</Text>
            </View>
          </View>

          <View style={styles.metricsStrip}>
            {[
              { val: "3", label: "Imóveis", color: colors.text },
              { val: "19m", label: "Permanência média", color: colors.green },
              { val: "4,7 ★", label: "Avaliação", color: colors.gold },
            ].map((m, i, arr) => (
              <View key={i} style={[styles.metricStripCell, i < arr.length - 1 && styles.metricStripCellBorder]}>
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

          <View style={styles.infoGrid}>
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

          {/* PREFERÊNCIAS */}
          <TouchableOpacity style={styles.blockCard} activeOpacity={0.85} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPrefsPanelVisible(true); }}>
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
              {prefs.prioridades.slice(0, 4).map((label, i) => {
                const opt = PRIORIDADE_OPTIONS.find((o) => o.label === label);
                return (
                  <View key={i} style={styles.prefItem}>
                    <View style={[styles.prefIcon, { backgroundColor: colors.greenDim }]}>
                      <Text style={{ fontSize: 12 }}>{opt?.emoji ?? "✓"}</Text>
                    </View>
                    <Text style={styles.prefLabel} numberOfLines={1}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>

          {/* TRAJETÓRIA */}
          <Text style={[styles.sectionLabel, { marginTop: 4 }]}>Trajetória</Text>
          <TouchableOpacity style={styles.blockCard} activeOpacity={0.85} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setHistoricoVisible(true); }}>
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
          <TouchableOpacity style={styles.planCard} activeOpacity={0.85}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
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

          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
            <View style={styles.logoutIcon}>
              <Feather name="log-out" size={16} color="rgba(255,102,102,0.8)" />
            </View>
            <Text style={styles.logoutText}>Sair da conta</Text>
            <Feather name="chevron-right" size={14} color="rgba(255,102,102,0.4)" />
          </TouchableOpacity>

        </View>
      </ScrollView>

      <HistoricoPanel visible={historicoVisible} onClose={() => setHistoricoVisible(false)} insets={insets} />
      <PreferenciasPanel visible={prefsPanelVisible} prefs={prefs} onClose={() => setPrefsPanelVisible(false)} onSave={setPrefs} insets={insets} />
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },

  // HERO
  hero: { backgroundColor: colors.bg, paddingHorizontal: 24, paddingBottom: 24, overflow: "hidden" },
  heroGlow: { position: "absolute", top: -100, right: -80, width: 320, height: 320, borderRadius: 160, backgroundColor: "rgba(201,169,110,0.07)" },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  heroTopRight: { flex: 1, gap: 10 },

  // AVATAR
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#2a4a7f", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 28, fontFamily: "Sora_700Bold", color: "#fff" },
  completionBadge: { position: "absolute", bottom: 0, right: 0, backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2, borderWidth: 2, borderColor: colors.bg },
  completionBadgeText: { fontSize: 9, fontFamily: "Sora_700Bold", color: colors.bg },

  editProfileBtn: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.13)" },
  editProfileBtnText: { fontSize: 13, fontFamily: "Sora_600SemiBold", color: colors.text2 },
  completionHintRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  completionHint: { fontSize: 11, color: colors.text3, flex: 1, flexWrap: "wrap" },

  identity: { marginBottom: 16 },
  userName: { fontSize: 24, fontFamily: "Sora_700Bold", color: colors.text, marginBottom: 5 },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  userMetaText: { fontSize: 12, color: colors.text2 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.text3 },

  // METRICS STRIP
  metricsStrip: { flexDirection: "row", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: "hidden" },
  metricStripCell: { flex: 1, alignItems: "center", paddingVertical: 14 },
  metricStripCellBorder: { borderRightWidth: 1, borderRightColor: colors.border },
  metricStripVal: { fontSize: 17, fontFamily: "Sora_700Bold", color: colors.text, marginBottom: 3 },
  metricStripLabel: { fontSize: 9, fontWeight: "500" as const, color: colors.text3, letterSpacing: 0.5, textTransform: "uppercase" as const, textAlign: "center" as const },

  // SECTIONS
  sections: { padding: 20, gap: 12 },
  sectionLabel: { fontSize: 10, fontWeight: "600" as const, color: colors.text3, letterSpacing: 1.4, textTransform: "uppercase" as const, marginBottom: 4, paddingLeft: 2 },

  // INFO GRID
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  infoCard: { width: "47.5%", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14, gap: 4 },
  infoCardIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  infoCardLabel: { fontSize: 10, fontWeight: "600" as const, color: colors.text3, letterSpacing: 0.8, textTransform: "uppercase" as const },
  infoCardVal: { fontSize: 15, fontFamily: "Sora_600SemiBold", color: colors.text },
  infoCardChip: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  infoCardChipText: { fontSize: 11, color: colors.text3 },

  // BLOCK CARDS
  blockCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, overflow: "hidden" },
  blockHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, paddingBottom: 14 },
  blockIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  blockTitleWrap: { flex: 1 },
  blockTitle: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 2 },
  blockSub: { fontSize: 12, color: colors.text2 },

  // PREF GRID (preview on card)
  prefGrid: { borderTopWidth: 1, borderTopColor: colors.border, padding: 14, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  prefItem: { width: "47%", flexDirection: "row", alignItems: "center", gap: 8 },
  prefIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  prefLabel: { fontSize: 12, color: colors.text2, flex: 1 },

  // METRICS (historico card)
  metricsRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border },
  metricCell: { flex: 1, alignItems: "center", paddingVertical: 14 },
  metricCellBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
  metricVal: { fontSize: 18, fontFamily: "Sora_700Bold", color: colors.text, marginBottom: 3 },
  metricLabel: { fontSize: 9, fontWeight: "500" as const, color: colors.text3, letterSpacing: 0.7, textTransform: "uppercase" as const },

  // MINI TIMELINE
  miniTimeline: { borderTopWidth: 1, borderTopColor: colors.border, padding: 14, gap: 10 },
  miniTlItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  miniTlDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  miniTlName: { flex: 1, fontSize: 12, color: colors.text2 },
  miniTlDur: { fontSize: 11, fontWeight: "500" as const, color: colors.text3 },

  // PLAN CARD
  planCard: { backgroundColor: "rgba(201,169,110,0.06)", borderWidth: 1, borderColor: colors.goldBorder, borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  planIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  planInfo: { flex: 1 },
  planTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  planName: { fontSize: 15, fontFamily: "Sora_700Bold", color: colors.gold },
  haasBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(201,169,110,0.18)", borderWidth: 1, borderColor: colors.goldBorder, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  haasBadgeText: { fontSize: 9, fontFamily: "Sora_700Bold", color: colors.gold, letterSpacing: 0.5 },
  planDetail: { fontSize: 12, color: colors.text2 },
  planRenew: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  planRenewText: { fontSize: 10, color: colors.text3 },

  // ACCOUNT CARD
  accountCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, overflow: "hidden" },
  accountRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  accountRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  accountRowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  accountRowLabel: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 1 },
  accountRowSub: { fontSize: 11, color: colors.text3 },

  // LOGOUT
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: "rgba(255,102,102,0.05)", borderWidth: 1, borderColor: "rgba(255,102,102,0.14)", borderRadius: 20 },
  logoutIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,102,102,0.08)", borderWidth: 1, borderColor: "rgba(255,102,102,0.18)", alignItems: "center", justifyContent: "center" },
  logoutText: { flex: 1, fontSize: 14, fontFamily: "Sora_600SemiBold", color: "rgba(255,102,102,0.8)" },

  // PANEL (shared)
  panelRoot: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.bg, zIndex: 100 },
  panelHeader: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: colors.bg, flexDirection: "row", alignItems: "center", gap: 14 },
  panelBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.13)", alignItems: "center", justifyContent: "center" },
  panelTitle: { flex: 1, fontSize: 18, fontFamily: "Sora_700Bold", color: colors.text },
  panelContent: { padding: 20, gap: 16 },

  // SAVE BUTTON
  saveBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "rgba(201,169,110,0.14)", borderWidth: 1, borderColor: colors.goldBorder },
  saveBtnText: { fontSize: 13, fontFamily: "Sora_700Bold", color: colors.gold },

  // EDIT SECTIONS
  editSection: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18, gap: 4 },
  editSectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  editSectionTitle: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text },
  editSectionSub: { fontSize: 12, color: colors.text3, marginBottom: 14 },
  valueBadge: { backgroundColor: "rgba(201,169,110,0.14)", borderWidth: 1, borderColor: colors.goldBorder, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10 },
  valueBadgeText: { fontSize: 12, fontFamily: "Sora_600SemiBold", color: colors.gold },

  // TIPO CHIPS
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(255,255,255,0.04)" },
  selectChipActive: { backgroundColor: "rgba(201,169,110,0.12)", borderColor: "rgba(201,169,110,0.40)" },
  selectChipText: { fontSize: 13, color: colors.text3 },
  selectChipTextActive: { color: colors.gold, fontWeight: "600" as const },

  // STEPPER
  stepperRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepperBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  stepperBtnDisabled: { opacity: 0.3 },
  stepperVal: { width: 52, alignItems: "center" },
  stepperValText: { fontSize: 18, fontFamily: "Sora_700Bold", color: colors.text },
  anyBtn: { marginLeft: "auto", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(255,255,255,0.04)" },
  anyBtnActive: { backgroundColor: "rgba(201,169,110,0.12)", borderColor: "rgba(201,169,110,0.40)" },
  anyBtnText: { fontSize: 12, color: colors.text3 },
  anyBtnTextActive: { color: colors.gold, fontWeight: "600" as const },

  // SLIDER
  slider: { width: "100%", height: 40, marginHorizontal: -4 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: -6 },
  sliderLabel: { fontSize: 11, color: colors.text3 },

  // PRIORIDADES
  prioList: { gap: 8 },
  prioItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(255,255,255,0.03)" },
  prioItemActive: { backgroundColor: "rgba(201,169,110,0.07)", borderColor: "rgba(201,169,110,0.30)" },
  prioEmoji: { fontSize: 18 },
  prioLabel: { flex: 1, fontSize: 13, color: colors.text2 },
  prioLabelActive: { color: colors.text },
  prioCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  prioCheckActive: { backgroundColor: "rgba(201,169,110,0.14)", borderColor: colors.goldBorder },

  // BAIRROS
  bairroChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  bairroChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: colors.blueDim, borderWidth: 1, borderColor: "rgba(77,124,254,0.25)" },
  bairroChipText: { fontSize: 12, fontWeight: "500" as const, color: colors.blue },
  bairroInputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bairroInput: { flex: 1, fontSize: 13, color: colors.text, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14 },
  bairroAddBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.blueDim, borderWidth: 1, borderColor: "rgba(77,124,254,0.25)", alignItems: "center", justifyContent: "center" },
  bairroAddBtnDisabled: { backgroundColor: "rgba(255,255,255,0.04)", borderColor: colors.border },

  // HISTORY PANEL
  histMetrics: { flexDirection: "row", gap: 8 },
  histMetricCell: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, alignItems: "center" },
  histMetricVal: { fontSize: 18, fontFamily: "Sora_700Bold", color: colors.text, marginBottom: 3 },
  histMetricLabel: { fontSize: 9, fontWeight: "500" as const, color: colors.text3, letterSpacing: 0.7, textTransform: "uppercase" as const, textAlign: "center" as const },
  histItem: { backgroundColor: "#1a2230", borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  histIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.blueDim, borderWidth: 1, borderColor: "rgba(77,124,254,0.2)", alignItems: "center", justifyContent: "center" },
  histName: { fontSize: 14, fontFamily: "Sora_600SemiBold", color: colors.text, marginBottom: 2 },
  histSub: { fontSize: 11, color: colors.text2 },
  histDur: { fontSize: 13, fontFamily: "Sora_600SemiBold", color: colors.text3, textAlign: "right" as const },
  histStars: { flexDirection: "row", gap: 2, marginTop: 3, justifyContent: "flex-end" as const },
});
