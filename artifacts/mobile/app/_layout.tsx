import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
} from "@expo-google-fonts/dm-sans";
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import { useSystemBars } from "@/hooks/useSystemBars";

// Configure the Android navigation bar as early as possible (module level),
// before any component renders, to avoid the white flash on startup.
if (Platform.OS === "android") {
  NavigationBar.setPositionAsync("absolute").catch(() => {});
  NavigationBar.setBackgroundColorAsync("#0d1117").catch(() => {});
  NavigationBar.setButtonStyleAsync("light").catch(() => {});
}

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="property"
        options={{
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

function SystemBarsInit() {
  const { initNavBar } = useSystemBars();

  useEffect(() => {
    initNavBar();
  }, [initNavBar]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      {/*
        Global status bar configuration:
        - style="light"      → white clock/icons — correct contrast on the dark theme
        - translucent        → app content draws behind the status bar area (edge-to-edge)
        - backgroundColor    → transparent so the app background shows through on Android
      */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Initializes the Android navigation bar to transparent + light buttons */}
      <SystemBarsInit />

      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
