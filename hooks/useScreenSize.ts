"use client";

import { useState, useEffect, useCallback } from "react";

// Breakpoints matching Tailwind CSS defaults
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface ScreenSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  scale: number; // Auto-calculated scale factor for content
  pixelRatio: number;
}

// Calculate scale factor based on screen size
function calculateScale(width: number, height: number): number {
  // Base reference: 1440px width (standard desktop)
  const baseWidth = 1440;
  const baseHeight = 900;

  // Calculate scale based on smaller dimension to maintain aspect ratio
  const widthScale = width / baseWidth;
  const heightScale = height / baseHeight;

  // Use the smaller scale to ensure content fits
  let scale = Math.min(widthScale, heightScale);

  // Clamp scale between reasonable bounds
  // Min 0.5 for very small screens, max 1.2 for very large screens
  scale = Math.max(0.5, Math.min(1.2, scale));

  // Round to 2 decimal places for cleaner values
  return Math.round(scale * 100) / 100;
}

// Get current breakpoint based on width
function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

// Default values for SSR
const defaultScreenSize: ScreenSize = {
  width: 1024,
  height: 768,
  breakpoint: "lg",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isLandscape: true,
  isPortrait: false,
  scale: 1,
  pixelRatio: 1,
};

/**
 * Hook to detect and track screen size with auto-scaling calculations
 *
 * @example
 * const { width, height, isMobile, scale, breakpoint } = useScreenSize();
 *
 * // Use scale for responsive elements
 * <div style={{ transform: `scale(${scale})` }}>...</div>
 *
 * // Use breakpoint for conditional rendering
 * {isMobile ? <MobileNav /> : <DesktopNav />}
 */
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(defaultScreenSize);
  const [isClient, setIsClient] = useState(false);

  const updateScreenSize = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpoint(width);

    setScreenSize({
      width,
      height,
      breakpoint,
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isLandscape: width > height,
      isPortrait: height > width,
      scale: calculateScale(width, height),
      pixelRatio: window.devicePixelRatio || 1,
    });
  }, []);

  useEffect(() => {
    setIsClient(true);
    updateScreenSize();

    // Debounced resize handler for performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateScreenSize, 100);
    };

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Handle orientation change on mobile
    window.addEventListener("orientationchange", () => {
      setTimeout(updateScreenSize, 200);
    });

    // Handle visual viewport changes (mobile keyboard, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      clearTimeout(resizeTimeout);
    };
  }, [updateScreenSize]);

  // Return default values during SSR
  if (!isClient) {
    return defaultScreenSize;
  }

  return screenSize;
}

/**
 * Hook to check if current screen matches a specific breakpoint or range
 *
 * @example
 * const isMdOrLarger = useBreakpoint("md"); // true if width >= 768px
 * const isExactlyMd = useBreakpoint("md", "lg"); // true if 768px <= width < 1024px
 */
export function useBreakpoint(min: Breakpoint, max?: Breakpoint): boolean {
  const { width } = useScreenSize();

  const minWidth = BREAKPOINTS[min];
  const maxWidth = max ? BREAKPOINTS[max] : Infinity;

  return width >= minWidth && width < maxWidth;
}

/**
 * Get responsive value based on current breakpoint
 *
 * @example
 * const fontSize = useResponsiveValue({
 *   xs: 14,
 *   sm: 16,
 *   md: 18,
 *   lg: 20,
 *   xl: 22,
 * });
 */
export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>): T | undefined {
  const { breakpoint } = useScreenSize();

  // Find the value for current breakpoint, falling back to smaller breakpoints
  const breakpoints: Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];
  const currentIndex = breakpoints.indexOf(breakpoint);

  for (let i = currentIndex; i < breakpoints.length; i++) {
    const bp = breakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

/**
 * Calculate a scaled value based on screen size
 * Useful for font sizes, spacing, etc.
 *
 * @example
 * const scaledFontSize = useScaledValue(16); // Returns 16 * scale
 * const scaledPadding = useScaledValue(24, { min: 16, max: 32 });
 */
export function useScaledValue(
  baseValue: number,
  options?: { min?: number; max?: number }
): number {
  const { scale } = useScreenSize();

  let scaledValue = baseValue * scale;

  if (options?.min !== undefined) {
    scaledValue = Math.max(options.min, scaledValue);
  }
  if (options?.max !== undefined) {
    scaledValue = Math.min(options.max, scaledValue);
  }

  return Math.round(scaledValue * 100) / 100;
}

export default useScreenSize;
