import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const SUGGESTIONS = [
  "Leblon, Rio de Janeiro, RJ",
  "Ipanema, Rio de Janeiro, RJ",
  "Copacabana, Rio de Janeiro, RJ",
  "Botafogo, Rio de Janeiro, RJ",
  "Flamengo, Rio de Janeiro, RJ",
  "Lapa, Rio de Janeiro, RJ",
  "Santa Teresa, Rio de Janeiro, RJ",
  "Barra da Tijuca, Rio de Janeiro, RJ",
  "Recreio dos Bandeirantes, Rio de Janeiro, RJ",
  "Tijuca, Rio de Janeiro, RJ",
  "Jardins, São Paulo, SP",
  "Vila Madalena, São Paulo, SP",
  "Pinheiros, São Paulo, SP",
  "Itaim Bibi, São Paulo, SP",
  "Moema, São Paulo, SP",
  "Perdizes, São Paulo, SP",
  "Higienópolis, São Paulo, SP",
  "Consolação, São Paulo, SP",
  "Lourdes, Belo Horizonte, MG",
  "Savassi, Belo Horizonte, MG",
  "Miramar, Porto Alegre, RS",
  "Moinhos de Vento, Porto Alegre, RS",
  "Batel, Curitiba, PR",
  "Água Verde, Curitiba, PR",
];

interface LocationSheetProps {
  visible: boolean;
  currentLocation: string;
  onClose: () => void;
  onConfirm: (location: string) => void;
}

export function LocationSheet({
  visible,
  currentLocation,
  onClose,
  onConfirm,
}: LocationSheetProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [query, setQuery] = useState("");
  const [usingCurrent, setUsingCurrent] = useState(false);

  const filtered =
    query.trim().length >= 2
      ? SUGGESTIONS.filter((s) =>
          s.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
      : [];

  useEffect(() => {
    if (visible) {
      setQuery("");
      setUsingCurrent(false);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 180,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelectSuggestion = (suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onConfirm(suggestion);
    onClose();
  };

  const handleCurrentLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUsingCurrent(true);
    setQuery("Localização atual");
    setTimeout(() => {
      onConfirm("Localização atual");
      onClose();
    }, 600);
  };

  const handleConfirmManual = () => {
    if (query.trim().length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onConfirm(query.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + 16 },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Definir localização</Text>
              <Text style={styles.headerSub}>
                Imóveis e distâncias serão calculados a partir daqui
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={16} color={colors.text2} />
            </TouchableOpacity>
          </View>

          {/* Current location button */}
          <TouchableOpacity
            style={[styles.currentLocBtn, usingCurrent && styles.currentLocBtnActive]}
            onPress={handleCurrentLocation}
            activeOpacity={0.8}
          >
            <View style={[styles.currentLocIcon, usingCurrent && styles.currentLocIconActive]}>
              <MaterialIcons
                name="my-location"
                size={16}
                color={usingCurrent ? "#fff" : colors.blue}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.currentLocLabel, usingCurrent && { color: colors.blue }]}>
                {usingCurrent ? "Usando localização atual..." : "Usar minha localização atual"}
              </Text>
              <Text style={styles.currentLocSub}>GPS · Precisão de bairro</Text>
            </View>
            {usingCurrent && (
              <Feather name="check" size={16} color={colors.blue} />
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou digite o endereço</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Input */}
          <View style={styles.inputWrap}>
            <Feather name="map-pin" size={16} color={colors.text3} />
            <TextInput
              value={query}
              onChangeText={(t) => { setQuery(t); setUsingCurrent(false); }}
              placeholder="Bairro, cidade ou endereço..."
              placeholderTextColor={colors.text3}
              style={styles.input}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleConfirmManual}
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={15} color={colors.text3} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions */}
          {filtered.length > 0 && (
            <ScrollView
              style={styles.suggestions}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filtered.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.suggestionItem, i < filtered.length - 1 && styles.suggestionItemBorder]}
                  onPress={() => handleSelectSuggestion(s)}
                  activeOpacity={0.7}
                >
                  <View style={styles.suggestionIcon}>
                    <Feather name="map-pin" size={13} color={colors.text3} />
                  </View>
                  <Text style={styles.suggestionText} numberOfLines={1}>{s}</Text>
                  <Feather name="arrow-up-left" size={13} color={colors.text3} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Confirm button — only show when there's typed text and no suggestion was picked */}
          {query.trim().length > 0 && filtered.length === 0 && !usingCurrent && (
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmManual} activeOpacity={0.85}>
              <Feather name="check" size={16} color="#fff" />
              <Text style={styles.confirmBtnText}>Confirmar "{query.trim()}"</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#14181f",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "85%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 3,
  },
  headerSub: {
    fontSize: 12,
    color: colors.text3,
    maxWidth: "85%",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  currentLocBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.blueDim,
    borderWidth: 1,
    borderColor: "rgba(99,140,255,0.2)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  currentLocBtnActive: {
    borderColor: "rgba(99,140,255,0.45)",
    backgroundColor: "rgba(99,140,255,0.12)",
  },
  currentLocIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(99,140,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  currentLocIconActive: {
    backgroundColor: colors.blue,
  },
  currentLocLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 2,
  },
  currentLocSub: {
    fontSize: 11,
    color: colors.text3,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.text3,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 0,
  },
  suggestions: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginBottom: 12,
    maxHeight: 240,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  suggestionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: colors.text2,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 4,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#fff",
  },
});
