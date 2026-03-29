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
  onClose,
  onConfirm,
}: LocationSheetProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");

  const filtered =
    query.trim().length >= 2
      ? SUGGESTIONS.filter((s) =>
          s.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
      : [];

  useEffect(() => {
    if (visible) {
      setQuery("");
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
      ]).start(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } else {
      Keyboard.dismiss();
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
    Keyboard.dismiss();
    onConfirm("Localização atual");
    onClose();
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
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            { paddingBottom: insets.bottom + 20 },
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
                Distâncias serão calculadas a partir daqui
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={16} color={colors.text2} />
            </TouchableOpacity>
          </View>

          {/* Single input field with "Minha localização" inside */}
          <View style={styles.inputWrap}>
            <Feather name="search" size={16} color={colors.text3} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Bairro, cidade ou endereço..."
              placeholderTextColor={colors.text3}
              style={styles.input}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleConfirmManual}
            />
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={15} color={colors.text3} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.myLocationBtn}
                onPress={handleCurrentLocation}
                activeOpacity={0.75}
              >
                <MaterialIcons name="my-location" size={13} color={colors.blue} />
                <Text style={styles.myLocationText}>Minha localização</Text>
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
                  style={[
                    styles.suggestionItem,
                    i < filtered.length - 1 && styles.suggestionItemBorder,
                  ]}
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

          {/* Confirm button when query doesn't match any suggestion */}
          {query.trim().length > 0 && filtered.length === 0 && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirmManual}
              activeOpacity={0.85}
            >
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
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
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
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 0,
  },
  myLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.blueDim,
    borderWidth: 1,
    borderColor: "rgba(99,140,255,0.25)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  myLocationText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.blue,
  },
  suggestions: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginBottom: 12,
    maxHeight: 260,
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
