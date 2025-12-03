"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components on the client side
const ChatBot = dynamic(() => import("../chat/ChatBot"), {
  ssr: false,
  loading: () => null,
});

const CookieConsent = dynamic(() => import("../ui/CookieConsent"), {
  ssr: false,
  loading: () => null,
});

export default function LazyComponents() {
  return (
    <>
      <ChatBot />
      <CookieConsent />
    </>
  );
}
