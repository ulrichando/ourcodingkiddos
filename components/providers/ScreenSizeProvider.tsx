"use client";

import { useEffect, createContext, useContext, ReactNode } from "react";
import { useScreenSize, ScreenSize } from "@/hooks/useScreenSize";

// Context for screen size
const ScreenSizeContext = createContext<ScreenSize | null>(null);

/**
 * Hook to access screen size from context
 * Must be used within ScreenSizeProvider
 */
export function useScreenSizeContext(): ScreenSize {
  const context = useContext(ScreenSizeContext);
  if (!context) {
    throw new Error("useScreenSizeContext must be used within ScreenSizeProvider");
  }
  return context;
}

interface ScreenSizeProviderProps {
  children: ReactNode;
}

/**
 * Provider component that:
 * 1. Tracks screen size and updates on resize
 * 2. Sets CSS custom properties on :root for global access
 * 3. Provides screen size context to child components
 *
 * CSS Variables set:
 * --screen-width: Current viewport width in px
 * --screen-height: Current viewport height in px
 * --screen-scale: Auto-calculated scale factor (0.5-1.2)
 * --screen-breakpoint: Current breakpoint name (xs, sm, md, lg, xl, 2xl)
 *
 * @example
 * // In your layout.tsx or app wrapper
 * <ScreenSizeProvider>
 *   <App />
 * </ScreenSizeProvider>
 *
 * // In CSS, use the variables:
 * .responsive-element {
 *   transform: scale(var(--screen-scale));
 *   font-size: calc(16px * var(--screen-scale));
 * }
 *
 * // In components, use the hook:
 * const { isMobile, scale, breakpoint } = useScreenSizeContext();
 */
export default function ScreenSizeProvider({ children }: ScreenSizeProviderProps) {
  const screenSize = useScreenSize();

  // Update CSS custom properties when screen size changes
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty("--screen-width", `${screenSize.width}px`);
    root.style.setProperty("--screen-height", `${screenSize.height}px`);
    root.style.setProperty("--screen-scale", String(screenSize.scale));
    root.style.setProperty("--screen-breakpoint", screenSize.breakpoint);
    root.style.setProperty("--screen-pixel-ratio", String(screenSize.pixelRatio));

    // Set boolean data attributes for CSS selectors
    root.setAttribute("data-mobile", String(screenSize.isMobile));
    root.setAttribute("data-tablet", String(screenSize.isTablet));
    root.setAttribute("data-desktop", String(screenSize.isDesktop));
    root.setAttribute("data-landscape", String(screenSize.isLandscape));
    root.setAttribute("data-portrait", String(screenSize.isPortrait));
    root.setAttribute("data-breakpoint", screenSize.breakpoint);

    // Set a class for the current breakpoint
    const breakpoints = ["xs", "sm", "md", "lg", "xl", "2xl"];
    breakpoints.forEach((bp) => {
      root.classList.remove(`bp-${bp}`);
    });
    root.classList.add(`bp-${screenSize.breakpoint}`);

  }, [screenSize]);

  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
