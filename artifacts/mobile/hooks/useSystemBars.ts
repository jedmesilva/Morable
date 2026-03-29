import { useCallback } from "react";
import { Platform } from "react-native";
import { setStatusBarHidden } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

/**
 * Initializes the system bars (status bar + Android navigation bar) to match
 * the app's dark theme:
 *   - Status bar: handled globally via <StatusBar> in _layout.tsx
 *   - Navigation bar (Android only): transparent background, light (white)
 *     gesture icons to contrast against the dark app background.
 *
 * Also exposes setFullscreen() to enter/exit immersive mode, hiding both bars
 * (e.g. when a photo lightbox is open).
 */
export function useSystemBars() {
  /**
   * Call once on app mount (in _layout.tsx) to configure the Android nav bar.
   * iOS doesn't have a persistent navigation bar, so this is a no-op there.
   */
  const initNavBar = useCallback(async () => {
    if (Platform.OS !== "android") return;
    try {
      // Make the navigation bar draw behind app content (edge-to-edge).
      await NavigationBar.setPositionAsync("absolute");
      // Fully transparent so the dark app background shows through.
      await NavigationBar.setBackgroundColorAsync("#00000000");
      // Light buttons (white icons) for dark backgrounds.
      await NavigationBar.setButtonStyleAsync("light");
      // Allow the bar to reappear with a swipe from the edge when hidden.
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    } catch (_) {
      // Graceful degradation — older Android versions may not support all APIs.
    }
  }, []);

  /**
   * Enters or exits fullscreen / immersive mode.
   * When hidden=true: both status bar and navigation bar disappear.
   * When hidden=false: both are restored to their default themed state.
   */
  const setFullscreen = useCallback(async (hidden: boolean) => {
    // Status bar (cross-platform via expo-status-bar imperative API).
    setStatusBarHidden(hidden, "fade");

    if (Platform.OS !== "android") return;
    try {
      if (hidden) {
        await NavigationBar.setVisibilityAsync("hidden");
        // Swipe from the bottom reveals it temporarily.
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      } else {
        await NavigationBar.setVisibilityAsync("visible");
        // Restore to the themed transparent state.
        await NavigationBar.setPositionAsync("absolute");
        await NavigationBar.setBackgroundColorAsync("#00000000");
        await NavigationBar.setButtonStyleAsync("light");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      }
    } catch (_) {
      // Graceful degradation.
    }
  }, []);

  return { initNavBar, setFullscreen };
}
