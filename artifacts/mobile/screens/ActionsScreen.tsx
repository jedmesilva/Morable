import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
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

interface ActionItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  name: string;
  desc: string;
  badge?: { text: string; type: "red" | "green" | "gold" };
  wide?: boolean;
  highlight?: boolean;
}

interface ActionGroup {
  label: string;
  items: ActionItem[];
}

const groups: ActionGroup[] = [
  {
    label: "Minha moradia",
    items: [
      {
        icon: "credit-card",
        iconBg: colors.goldDim,
        iconColor: colors.gold,
        name: "Fatura",
        desc: "Ver e pagar mensalidade",
        badge: { text: "Vence em 5d", type: "red" },
      },
      {
        icon: "tool",
        iconBg: colors.blueDim,
        iconColor: colors.blue,
        name: "Chamados",
        desc: "Manutenção e reparos",
        badge: { text: "1 aberto", type: "gold" },
      },
      {
        icon: "file-text",
        iconBg: colors.blueDim,
        iconColor: colors.blue,
        name: "Documentos",
        desc: "CPF, comprovantes",
      },
      {
        icon: "shield",
        iconBg: colors.amberDim,
        iconColor: colors.amber,
        name: "Seguro",
        desc: "Cobertura do imóvel",
      },
      {
        icon: "clipboard",
        iconBg: colors.greenDim,
        iconColor: colors.green,
        name: "Contrato",
        desc: "Ver termos da assinatura",
        badge: { text: "Ativo", type: "green" },
      },
      {
        icon: "home",
        iconBg: colors.purpleDim,
        iconColor: colors.purple,
        name: "Trocar imóvel",
        desc: "Iniciar busca por mudança",
      },
    ],
  },
  {
    label: "Financeiro",
    items: [
      {
        icon: "bar-chart-2",
        iconBg: colors.greenDim,
        iconColor: colors.green,
        name: "Histórico de pagamentos",
        desc: "Todas as faturas pagas",
        wide: true,
      },
    ],
  },
  {
    label: "Serviços",
    items: [
      {
        icon: "truck",
        iconBg: colors.blueDim,
        iconColor: colors.blue,
        name: "Mudança",
        desc: "Fretes e transportes parceiros",
        badge: { text: "Parceiro", type: "green" },
        wide: true,
      },
      {
        icon: "wifi",
        iconBg: colors.purpleDim,
        iconColor: colors.purple,
        name: "Internet",
        desc: "Planos de fibra no endereço",
        badge: { text: "Parceiro", type: "green" },
      },
      {
        icon: "star",
        iconBg: colors.goldDim,
        iconColor: colors.gold,
        name: "Limpeza",
        desc: "Pontual ou recorrente",
      },
      {
        icon: "package",
        iconBg: colors.amberDim,
        iconColor: colors.amber,
        name: "Montagem",
        desc: "Móveis e instalações",
      },
    ],
  },
  {
    label: "Descoberta",
    items: [
      {
        icon: "heart",
        iconBg: colors.redDim,
        iconColor: colors.red,
        name: "Imóveis salvos",
        desc: "Seus favoritos",
        badge: { text: "3 salvos", type: "red" },
        wide: true,
        highlight: true,
      },
      {
        icon: "map",
        iconBg: colors.blueDim,
        iconColor: colors.blue,
        name: "Explorar no mapa",
        desc: "Ver imóveis próximos",
      },
      {
        icon: "zap",
        iconBg: colors.goldDim,
        iconColor: colors.gold,
        name: "Recomendados",
        desc: "Baseado no seu perfil",
      },
    ],
  },
  {
    label: "Comunidade",
    items: [
      {
        icon: "gift",
        iconBg: colors.purpleDim,
        iconColor: colors.purple,
        name: "Indicações",
        desc: "Indique e ganhe benefícios",
        wide: true,
      },
      {
        icon: "headphones",
        iconBg: colors.greenDim,
        iconColor: colors.green,
        name: "Suporte",
        desc: "Falar com a equipe",
      },
      {
        icon: "message-circle",
        iconBg: colors.blueDim,
        iconColor: colors.blue,
        name: "Chat com IA",
        desc: "Assistente HaaS",
      },
      {
        icon: "alert-triangle",
        iconBg: "rgba(255,255,255,0.05)",
        iconColor: colors.text3,
        name: "Reportar",
        desc: "Vizinhança, segurança",
      },
    ],
  },
];

const badgeBgMap: Record<string, string> = {
  red: colors.redDim,
  green: colors.greenDim,
  gold: colors.goldDim,
};
const badgeColorMap: Record<string, string> = {
  red: colors.red,
  green: colors.green,
  gold: colors.gold,
};
const badgeBorderMap: Record<string, string> = {
  red: "rgba(255,102,102,0.25)",
  green: colors.greenBorder,
  gold: colors.goldBorder,
};

export default function ActionsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Todas as ações</Text>
        <Text style={styles.headerSub}>O que você precisa fazer hoje?</Text>
      </View>

      <View style={styles.content}>
        {groups.map((g, gi) => (
          <View key={gi} style={{ marginBottom: 24 }}>
            <View style={styles.groupLabel}>
              <Text style={styles.groupLabelText}>{g.label}</Text>
              <View style={styles.groupLine} />
            </View>
            <View style={styles.groupGrid}>
              {g.items.map((item, ii) => {
                const isWide = item.wide;
                return (
                  <TouchableOpacity
                    key={ii}
                    style={[
                      styles.actionCard,
                      isWide && styles.actionCardWide,
                      item.highlight && styles.actionCardHighlight,
                    ]}
                    onPress={() =>
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.actionIcon,
                        { backgroundColor: item.iconBg },
                      ]}
                    >
                      <Feather
                        name={item.icon as any}
                        size={18}
                        color={item.iconColor}
                      />
                    </View>
                    <View style={styles.actionBody}>
                      <Text style={styles.actionName}>{item.name}</Text>
                      <Text style={styles.actionDesc}>{item.desc}</Text>
                    </View>
                    {isWide && (
                      <Feather
                        name="chevron-right"
                        size={16}
                        color={colors.text3}
                      />
                    )}
                    {item.badge && (
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: badgeBgMap[item.badge.type],
                            borderColor: badgeBorderMap[item.badge.type],
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: badgeColorMap[item.badge.type] },
                          ]}
                        >
                          {item.badge.text}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.headerGrad1,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, color: colors.text3 },
  content: { padding: 20 },
  groupLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  groupLabelText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: colors.text3,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  groupLine: { flex: 1, height: 1, backgroundColor: colors.border },
  groupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionCard: {
    width: "47.5%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    position: "relative",
    overflow: "hidden",
  },
  actionCardWide: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionCardHighlight: {
    backgroundColor: "rgba(201,169,110,0.08)",
    borderColor: colors.goldBorder,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBody: { flex: 1 },
  actionName: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 2,
    lineHeight: 18,
  },
  actionDesc: {
    fontSize: 11,
    color: colors.text3,
    lineHeight: 15,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
});
