import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Line } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useSystemBars } from "@/hooks/useSystemBars";

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;

const propertyImages: Record<string, ReturnType<typeof require>> = {
  "1": require("@/assets/images/property-1.png"),
  "2": require("@/assets/images/property-2.png"),
  "3": require("@/assets/images/property-3.png"),
};

const galleryImages = [
  require("@/assets/images/property-1.png"),
  require("@/assets/images/property-2.png"),
  require("@/assets/images/property-3.png"),
];

const occupancyData = [
  { name: "Você · atual", period: "Mar 2026 → presente", duration: "Entrando", current: true },
  { name: "Morador anterior", period: "Jun 2024 → Fev 2026", duration: "20 meses", current: false },
  { name: "Morador anterior", period: "Jan 2023 → Mai 2024", duration: "16 meses", current: false },
  { name: "Morador anterior", period: "Mar 2021 → Dez 2022", duration: "21 meses", current: false },
];

const nearbyPlaces = [
  { color: "#4ade80", label: "Metrô · 400m" },
  { color: colors.blue, label: "Supermercado · 200m" },
  { color: colors.amber, label: "Farmácia · 150m" },
  { color: colors.purple, label: "Parque · 600m" },
];

export default function PropertyScreen() {
  const { activeProperty, savedProperties, toggleSave } = useApp();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxScrollRef = useRef<ScrollView>(null);
  const { setFullscreen } = useSystemBars();

  const matchBarAnim = useRef(new Animated.Value(0)).current;
  const [matchTriggered, setMatchTriggered] = useState(false);
  const matchSectionY = useRef(0);

  useEffect(() => {
    setFullscreen(lightboxIndex !== null);
  }, [lightboxIndex, setFullscreen]);

  useEffect(() => {
    if (matchTriggered && activeProperty) {
      Animated.timing(matchBarAnim, {
        toValue: activeProperty.match,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [matchTriggered]);

  if (!activeProperty) {
    router.back();
    return null;
  }

  const saved = savedProperties.includes(activeProperty.id);
  const img = propertyImages[activeProperty.id] || propertyImages["1"];

  const matchItems = [
    { icon: "heart", name: "Aceita pets", detail: activeProperty.pets ? "Cães e gatos permitidos" : "Não aceita pets", pass: activeProperty.pets },
    { icon: "wifi", name: "Internet inclusa", detail: activeProperty.wifi ? "Fibra incluída" : "Internet não inclusa", pass: activeProperty.wifi },
    { icon: "disc", name: "Vaga de garagem", detail: activeProperty.parking ? "1 vaga coberta" : "Sem vaga", pass: activeProperty.parking },
    { icon: "activity", name: "Academia", detail: activeProperty.gym ? "No condomínio" : "Sem academia", pass: activeProperty.gym },
    { icon: "users", name: "Para casal", detail: "Permitido", pass: true },
    { icon: "wind", name: "Ar condicionado", detail: "Não incluso nesta unidade", pass: false },
  ];

  const amenities = [
    { icon: "wifi", label: "Internet", active: activeProperty.wifi },
    { icon: "disc", label: "Garagem", active: activeProperty.parking },
    { icon: "activity", label: "Academia", active: activeProperty.gym },
    { icon: "heart", label: "Pets OK", active: activeProperty.pets },
    { icon: "shield", label: "Portaria 24h", active: activeProperty.security },
    { icon: "wind", label: "Ar cond.", active: false },
  ];

  const rules = [
    { ok: activeProperty.pets, text: activeProperty.pets ? "Pets permitidos (cães e gatos)" : "Pets não permitidos" },
    { ok: true, text: "Casais e famílias bem-vindos" },
    { ok: true, text: "Home office · ambiente silencioso" },
    { ok: false, text: "Sem festas ou eventos" },
    { ok: false, text: "Fumar proibido nas dependências" },
  ];

  const matchCriteriaPass = matchItems.filter((m) => m.pass).length;

  const matchBarWidth = matchBarAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // Opens the lightbox at a specific index, scrolling the carousel to position.
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setTimeout(() => {
      lightboxScrollRef.current?.scrollTo({ x: SCREEN_W * index, animated: false });
    }, 50);
  };

  // Called from thumbnails inside the lightbox — updates state + animates carousel.
  const goToLightboxIndex = (index: number) => {
    setLightboxIndex(index);
    lightboxScrollRef.current?.scrollTo({ x: SCREEN_W * index, animated: true });
  };

  return (
    <View style={styles.root}>
      {/* Fixed overlay: back + action buttons */}
      <View style={[styles.heroTopBar, { top: topPad }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroActionBtn}>
            <Feather name="share-2" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.heroActionBtn, saved && styles.heroActionBtnSaved]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleSave(activeProperty.id);
            }}
          >
            <Ionicons name={saved ? "heart" : "heart-outline"} size={16} color={saved ? colors.red : "#fff"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        scrollEventThrottle={16}
        onScroll={({ nativeEvent }) => {
          const scrollBottom =
            nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height;
          if (!matchTriggered && scrollBottom > matchSectionY.current + 80) {
            setMatchTriggered(true);
          }
        }}
      >
        {/* ── HERO ── */}
        <TouchableOpacity
          style={styles.hero}
          activeOpacity={0.95}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            openLightbox(0);
          }}
        >
          <Image source={img} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.5)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.88)",
            ]}
            locations={[0, 0.3, 0.55, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.photoCountBadge}>
            <Feather name="layers" size={11} color="rgba(255,255,255,0.7)" />
            <Text style={styles.photoCountText}>{galleryImages.length} fotos</Text>
          </View>

          <View style={styles.heroBottom}>
            <View style={styles.heroTagRow}>
              <View style={[styles.heroTag, activeProperty.available ? styles.heroTagAvailable : styles.heroTagUnavailable]}>
                <Text style={[styles.heroTagText, { color: activeProperty.available ? colors.green : colors.red }]}>
                  {activeProperty.available ? "● Disponível" : "● Indisponível"}
                </Text>
              </View>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{activeProperty.type}</Text>
              </View>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{activeProperty.floor}</Text>
              </View>
            </View>
            <View style={styles.heroPriceRow}>
              <Text style={styles.heroPrice}>
                {activeProperty.price}
                <Text style={styles.heroPricePer}>/mês</Text>
              </Text>
              <View style={styles.heroRating}>
                <Feather name="star" size={12} color={colors.amber} />
                <Text style={styles.heroRatingVal}>{activeProperty.rating}</Text>
                <Text style={styles.heroRatingCount}>({activeProperty.reviews} avaliações)</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── TITLE ── */}
        <View style={styles.titleSection}>
          <Text style={styles.propName}>{activeProperty.name}</Text>
          <View style={styles.propLocation}>
            <Feather name="map-pin" size={13} color={colors.blue} />
            <Text style={styles.propLocationText}>{activeProperty.location}</Text>
            <View style={styles.propDistance}>
              <Feather name="navigation" size={10} color={colors.blue} />
              <Text style={styles.propDistanceText}>1,2 km de você</Text>
            </View>
          </View>
          <View style={styles.quickStats}>
            {[
              { icon: "home", val: `${activeProperty.beds}`, label: "Quartos" },
              { icon: "droplet", val: `${activeProperty.baths}`, label: "Banheiros" },
              { icon: "maximize-2", val: activeProperty.area, label: "Área" },
              { icon: "disc", val: activeProperty.parking ? "1" : "0", label: "Vaga" },
            ].map((s) => (
              <View key={s.label} style={styles.qsItem}>
                <Feather name={s.icon as any} size={15} color={colors.gold} style={styles.qsIcon} />
                <Text style={styles.qsVal}>{s.val}</Text>
                <Text style={styles.qsLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── GALLERY ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Fotos e vídeos</Text>
            <View style={styles.sectionLine} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {galleryImages.map((src, i) => (
              <TouchableOpacity
                key={i}
                style={styles.galleryThumb}
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  openLightbox(i);
                }}
              >
                <Image source={src} style={styles.galleryThumbImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.gallerySeeAll}
              onPress={() => openLightbox(0)}
              activeOpacity={0.7}
            >
              <Text style={styles.gallerySeeAllCount}>+3</Text>
              <Text style={styles.gallerySeeAllLabel}>VER TUDO</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* ── MATCH / POR QUE É PRA VOCÊ ── */}
        <View
          style={styles.section}
          onLayout={({ nativeEvent }) => {
            matchSectionY.current = nativeEvent.layout.y;
          }}
        >
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Por que é pra você</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.matchHeader}>
            <View>
              <View style={styles.matchScoreRow}>
                <Text style={styles.matchNumber}>{activeProperty.match}</Text>
                <Text style={styles.matchPct}>%</Text>
              </View>
              <Text style={styles.matchLabel}>de compatibilidade</Text>
            </View>
            <View style={styles.matchMeta}>
              <Text style={styles.matchMetaText}>{matchCriteriaPass} de {matchItems.length} critérios</Text>
              <View style={styles.matchMiniBarRow}>
                {matchItems.map((m, i) => (
                  <View
                    key={i}
                    style={[
                      styles.matchMiniBar,
                      { backgroundColor: m.pass ? colors.green : "rgba(255,102,102,0.4)" },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.matchBarWrap}>
            <Animated.View style={[styles.matchBarFill, { width: matchBarWidth }]} />
          </View>

          <View style={styles.matchItems}>
            {matchItems.map((m, i) => (
              <View key={i} style={[styles.matchItem, m.pass ? styles.matchItemPass : styles.matchItemFail]}>
                <View style={[styles.matchItemIcon, m.pass ? styles.matchItemIconPass : styles.matchItemIconFail]}>
                  <Feather name={m.icon as any} size={14} color={m.pass ? colors.green : colors.red} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matchItemName}>{m.name}</Text>
                  <Text style={styles.matchItemDetail}>{m.detail}</Text>
                </View>
                <Feather
                  name={m.pass ? "check-circle" : "alert-circle"}
                  size={16}
                  color={m.pass ? colors.green : colors.red}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── COMODIDADES + REGRAS ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Comodidades</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.amenitiesGrid}>
            {amenities.map((a) => (
              <View
                key={a.label}
                style={[styles.amenityItem, a.active ? styles.amenityItemActive : styles.amenityItemInactive]}
              >
                <Feather name={a.icon as any} size={16} color={a.active ? colors.gold : colors.text3} />
                <Text style={[styles.amenityLabel, !a.active && { color: colors.text3 }]}>{a.label}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionTitleRow, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Regras do imóvel</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.rulesList}>
            {rules.map((r, i) => (
              <View key={i} style={styles.ruleItem}>
                <View style={[styles.ruleDot, { backgroundColor: r.ok ? colors.green : colors.red }]} />
                <Text style={styles.ruleText}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── HISTÓRICO DE OCUPAÇÃO ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Histórico de ocupação</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.occStatsRow}>
            {[
              { val: "4", label: "Moradores", valueColor: colors.gold },
              { val: "19m", label: "Tempo médio", valueColor: colors.green },
              { val: "2021", label: "Desde", valueColor: colors.text },
            ].map((s, i) => (
              <View key={i} style={styles.occStat}>
                <Text style={[styles.occStatVal, { color: s.valueColor }]}>{s.val}</Text>
                <Text style={styles.occStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.timeline}>
            {occupancyData.map((o, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, o.current ? styles.timelineDotCurrent : styles.timelineDotPast]} />
                  {i < occupancyData.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={[styles.timelineCard, o.current && styles.timelineCardCurrent]}>
                  <View style={styles.timelineCardHeader}>
                    <Text style={styles.timelineName}>{o.name}</Text>
                    <View style={[styles.timelineBadge, o.current ? styles.timelineBadgeCurrent : styles.timelineBadgePast]}>
                      <Text style={[styles.timelineBadgeText, { color: o.current ? colors.green : colors.text3 }]}>
                        {o.duration}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.timelinePeriod}>{o.period}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── LOCALIZAÇÃO ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.mapContainer}>
            <Svg
              style={StyleSheet.absoluteFillObject as any}
              width="100%"
              height="100%"
            >
              <Line x1="0" y1="80" x2="100%" y2="80" stroke={colors.blue} strokeWidth="8" strokeOpacity="0.14" />
              <Line x1="0" y1="110" x2="100%" y2="110" stroke={colors.blue} strokeWidth="3" strokeOpacity="0.14" />
              <Line x1="120" y1="0" x2="120" y2="100%" stroke={colors.blue} strokeWidth="5" strokeOpacity="0.14" />
              <Line x1="240" y1="0" x2="240" y2="100%" stroke={colors.blue} strokeWidth="3" strokeOpacity="0.14" />
              <Line x1="310" y1="0" x2="260" y2="100%" stroke={colors.blue} strokeWidth="2" strokeOpacity="0.10" />
            </Svg>

            <View style={styles.mapPin}>
              <View style={styles.mapPinDot} />
              <View style={styles.mapPinLine} />
            </View>

            <View style={styles.mapLabel}>
              <Text style={styles.mapLabelText}>{activeProperty.location}</Text>
            </View>

            <View style={styles.mapOpenLabel}>
              <Feather name="navigation" size={11} color={colors.blue} />
              <Text style={styles.mapOpenLabelText}>Abrir no mapa</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nearbyChipsScroll}>
            {nearbyPlaces.map((p, i) => (
              <View key={i} style={styles.nearbyChip}>
                <View style={[styles.nearbyChipDot, { backgroundColor: p.color }]} />
                <Text style={styles.nearbyChipText}>{p.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── BOTTOM CTA ── */}
      <LinearGradient
        colors={["rgba(13,17,23,0)", "rgba(13,17,23,1)"]}
        locations={[0, 0.5]}
        style={[styles.ctaBar, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }]}
      >
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSaved]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleSave(activeProperty.id);
          }}
        >
          <Ionicons name={saved ? "heart" : "heart-outline"} size={20} color={saved ? colors.red : colors.text2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
          activeOpacity={0.85}
        >
          <Feather name="zap" size={18} color="rgba(255,255,255,0.9)" />
          <Text style={styles.subscribeBtnText}>Assinar este imóvel</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ── LIGHTBOX ── */}
      <Modal
        visible={lightboxIndex !== null}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setLightboxIndex(null)}
      >
        <View style={styles.lightbox}>
          <Text style={[styles.lightboxCounter, { top: insets.top + 12 }]}>
            {(lightboxIndex ?? 0) + 1} / {galleryImages.length}
          </Text>
          <TouchableOpacity
            style={[styles.lightboxClose, { top: insets.top + 6 }]}
            onPress={() => setLightboxIndex(null)}
          >
            <Feather name="x" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Swipeable image carousel */}
          <ScrollView
            ref={lightboxScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.lightboxImgWrap}
            onMomentumScrollEnd={({ nativeEvent }) => {
              const index = Math.round(nativeEvent.contentOffset.x / SCREEN_W);
              setLightboxIndex(index);
            }}
          >
            {galleryImages.map((src, i) => (
              <View key={i} style={styles.lightboxImgPage}>
                <Image source={src} style={styles.lightboxImg} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          {/* Dot indicators */}
          <View style={styles.lightboxDots}>
            {galleryImages.map((_, i) => (
              <View
                key={i}
                style={[styles.lightboxDot, lightboxIndex === i && styles.lightboxDotActive]}
              />
            ))}
          </View>

          {/* Thumbnail strip */}
          <View style={[styles.lightboxStrip, { paddingBottom: insets.bottom + 20 }]}>
            {galleryImages.map((src, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  goToLightboxIndex(i);
                }}
                activeOpacity={0.8}
                style={[styles.lbThumb, lightboxIndex === i && styles.lbThumbActive]}
              >
                <Image source={src} style={styles.lbThumbImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  /* Hero */
  hero: { height: 340, position: "relative", overflow: "hidden" },
  heroImage: { position: "absolute", inset: 0, width: "100%", height: "100%" } as any,
  photoCountBadge: {
    position: "absolute", bottom: 64, right: 20,
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  photoCountText: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  heroTopBar: {
    position: "absolute", left: 0, right: 0,
    paddingHorizontal: 20, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center", zIndex: 10,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  heroActions: { flexDirection: "row", gap: 8 },
  heroActionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  heroActionBtnSaved: {
    backgroundColor: "rgba(255,102,102,0.25)",
    borderColor: "rgba(255,102,102,0.4)",
  },
  heroBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0, padding: 20,
  },
  heroTagRow: { flexDirection: "row", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  heroTag: {
    backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 20,
    paddingVertical: 4, paddingHorizontal: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
  },
  heroTagAvailable: {
    backgroundColor: "rgba(62,207,142,0.18)",
    borderColor: "rgba(62,207,142,0.35)",
  },
  heroTagUnavailable: {
    backgroundColor: "rgba(255,102,102,0.18)",
    borderColor: "rgba(255,102,102,0.35)",
  },
  heroTagText: { fontSize: 10, fontWeight: "600" as const, color: "rgba(255,255,255,0.85)", letterSpacing: 0.5 },
  heroPriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heroPrice: { fontFamily: "Sora_800ExtraBold", fontSize: 28, color: "#fff" },
  heroPricePer: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "rgba(255,255,255,0.55)" },
  heroRating: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroRatingVal: { fontFamily: "Sora_600SemiBold", fontSize: 13, color: "#fff" },
  heroRatingCount: { fontSize: 11, color: "rgba(255,255,255,0.45)" },

  /* Scroll */
  scrollContent: { flex: 1 },

  /* Title */
  titleSection: { padding: 20, paddingBottom: 0 },
  propName: { fontFamily: "Sora_700Bold", fontSize: 22, color: colors.text, marginBottom: 6 },
  propLocation: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 16 },
  propLocationText: { fontSize: 13, color: colors.text2, flex: 1 },
  propDistance: { flexDirection: "row", alignItems: "center", gap: 3 },
  propDistanceText: { fontSize: 11, color: colors.blue, fontFamily: "DMSans_500Medium" },

  /* Quick stats */
  quickStats: { flexDirection: "row", gap: 8, marginBottom: 20 },
  qsItem: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8, alignItems: "center",
  },
  qsIcon: { marginBottom: 5 },
  qsVal: { fontFamily: "Sora_600SemiBold", fontSize: 14, color: colors.text, marginBottom: 2 },
  qsLabel: {
    fontSize: 9, fontWeight: "500" as const, color: colors.text3,
    letterSpacing: 0.8, textTransform: "uppercase",
  },

  /* Divider */
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20, marginVertical: 4 },

  /* Sections */
  section: { padding: 20, paddingBottom: 0 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle: {
    fontFamily: "Sora_600SemiBold", fontSize: 13, color: colors.text3,
    letterSpacing: 1.2, textTransform: "uppercase",
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.border },

  /* Gallery */
  galleryThumb: {
    width: 88, height: 72, borderRadius: 12, overflow: "hidden",
    marginRight: 8, borderWidth: 1, borderColor: colors.border,
  },
  galleryThumbImg: { width: "100%", height: "100%" },
  gallerySeeAll: {
    width: 88, height: 72, borderRadius: 12,
    borderWidth: 1, borderStyle: "dashed" as const, borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", gap: 4, marginRight: 8,
  },
  gallerySeeAllCount: { fontFamily: "Sora_600SemiBold", fontSize: 13, color: colors.text3 },
  gallerySeeAllLabel: { fontSize: 9, textTransform: "uppercase", letterSpacing: 0.8, color: colors.text3 },

  /* Match */
  matchHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  matchScoreRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  matchNumber: { fontFamily: "Sora_800ExtraBold", fontSize: 42, color: colors.green, lineHeight: 48 },
  matchPct: { fontFamily: "Sora_600SemiBold", fontSize: 18, color: colors.green },
  matchLabel: { fontSize: 11, color: colors.text3, marginTop: 2 },
  matchMeta: { alignItems: "flex-end" },
  matchMetaText: { fontSize: 11, color: colors.text3, marginBottom: 6 },
  matchMiniBarRow: { flexDirection: "row", gap: 4 },
  matchMiniBar: { width: 18, height: 4, borderRadius: 2 },
  matchBarWrap: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 16,
  },
  matchBarFill: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 4,
  },
  matchItems: { gap: 8 },
  matchItem: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 10, borderRadius: 12, borderWidth: 1,
  },
  matchItemPass: { backgroundColor: "rgba(62,207,142,0.06)", borderColor: "rgba(62,207,142,0.15)" },
  matchItemFail: { backgroundColor: "rgba(255,102,102,0.05)", borderColor: "rgba(255,102,102,0.12)" },
  matchItemIcon: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  matchItemIconPass: { backgroundColor: "rgba(62,207,142,0.15)" },
  matchItemIconFail: { backgroundColor: "rgba(255,102,102,0.12)" },
  matchItemName: { fontSize: 13, fontWeight: "500" as const, color: colors.text },
  matchItemDetail: { fontSize: 11, color: colors.text3, marginTop: 1 },

  /* Amenities */
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  amenityItem: {
    width: "31%", backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 10,
    alignItems: "center", gap: 7,
  },
  amenityItemActive: { borderColor: "rgba(201,169,110,0.25)" },
  amenityItemInactive: { borderColor: colors.border, opacity: 0.45 },
  amenityLabel: { fontSize: 11, fontWeight: "500" as const, color: colors.text2, textAlign: "center" },

  /* Rules */
  rulesList: { gap: 8 },
  ruleItem: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 10, paddingHorizontal: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12,
  },
  ruleDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  ruleText: { fontSize: 13, color: colors.text2, flex: 1 },

  /* Occupancy */
  occStatsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  occStat: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: 14, padding: 14, alignItems: "center",
  },
  occStatVal: { fontFamily: "Sora_700Bold", fontSize: 20, marginBottom: 3 },
  occStatLabel: { fontSize: 10, color: colors.text3, textTransform: "uppercase", letterSpacing: 0.7 },
  timeline: { paddingLeft: 20 },
  timelineItem: { flexDirection: "row", gap: 12, marginBottom: 12 },
  timelineLeft: { alignItems: "center", paddingTop: 4 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineDotCurrent: {
    backgroundColor: colors.green,
    shadowColor: colors.green, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 6,
  },
  timelineDotPast: { backgroundColor: colors.text3 },
  timelineLine: { flex: 1, width: 1, backgroundColor: colors.border, marginTop: 4 },
  timelineCard: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: 14, padding: 12,
  },
  timelineCardCurrent: { borderColor: "rgba(62,207,142,0.2)" },
  timelineCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 },
  timelineName: { fontSize: 13, fontWeight: "500" as const, color: colors.text },
  timelineBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  timelineBadgeCurrent: { backgroundColor: "rgba(62,207,142,0.12)" },
  timelineBadgePast: { backgroundColor: "rgba(255,255,255,0.06)" },
  timelineBadgeText: { fontSize: 11, fontWeight: "600" as const },
  timelinePeriod: { fontSize: 11, color: colors.text3 },

  /* Map */
  mapContainer: {
    height: 160, borderRadius: 18, overflow: "hidden",
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: "#0d1e2e", marginBottom: 12,
    alignItems: "center", justifyContent: "center",
  },
  mapPin: { alignItems: "center" },
  mapPinDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.blue, borderWidth: 3, borderColor: "rgba(255,255,255,0.9)",
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 8,
  },
  mapPinLine: { width: 2, height: 12, backgroundColor: "rgba(255,255,255,0.3)" },
  mapLabel: {
    position: "absolute", bottom: "50%", left: "50%",
    transform: [{ translateX: -60 }, { translateY: 32 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  mapLabelText: { fontSize: 11, fontWeight: "500" as const, color: "rgba(255,255,255,0.85)" },
  mapOpenLabel: {
    position: "absolute", bottom: 12, right: 12,
    flexDirection: "row", alignItems: "center", gap: 5,
  },
  mapOpenLabelText: { fontSize: 11, fontWeight: "600" as const, color: colors.blue },
  nearbyChipsScroll: { marginBottom: 4 },
  nearbyChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8,
  },
  nearbyChipDot: { width: 6, height: 6, borderRadius: 3 },
  nearbyChipText: { fontSize: 11, color: colors.text2 },

  /* CTA */
  ctaBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingTop: 32, paddingHorizontal: 20, flexDirection: "row", gap: 10,
  },
  saveBtn: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border2,
    alignItems: "center", justifyContent: "center",
  },
  saveBtnSaved: {
    backgroundColor: "rgba(246,102,102,0.15)",
    borderColor: "rgba(246,102,102,0.35)",
  },
  subscribeBtn: {
    flex: 1, height: 52, borderRadius: 16,
    backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 10,
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 20,
  },
  subscribeBtnText: {
    fontFamily: "Sora_700Bold", fontSize: 15, color: "#fff", letterSpacing: 0.3,
  },

  /* Lightbox */
  lightbox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxCounter: {
    position: "absolute", left: 20, zIndex: 10,
    fontFamily: "Sora_600SemiBold", fontSize: 13, color: "rgba(255,255,255,0.6)",
  },
  lightboxClose: {
    position: "absolute", right: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  lightboxImgWrap: { flex: 1, width: SCREEN_W },
  lightboxImgPage: { width: SCREEN_W, alignItems: "center", justifyContent: "center" },
  lightboxImg: { width: SCREEN_W * 0.9, height: SCREEN_H * 0.6 },
  lightboxDots: { flexDirection: "row", gap: 6, paddingVertical: 12, alignItems: "center" },
  lightboxDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  lightboxDotActive: { width: 18, backgroundColor: "#fff" },
  lightboxStrip: {
    flexDirection: "row", justifyContent: "center", gap: 8,
    paddingHorizontal: 20, paddingTop: 16,
  },
  lbThumb: {
    width: 56, height: 44, borderRadius: 8, overflow: "hidden",
    borderWidth: 2, borderColor: "transparent",
  },
  lbThumbActive: { borderColor: colors.gold },
  lbThumbImg: { width: "100%", height: "100%" },
});
