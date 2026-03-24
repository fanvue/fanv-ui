import { Button, ChevronRightIcon, HomeIcon, ToastProvider } from "@fanvue/ui";
import * as React from "react";
import { useState } from "react";
import {
  AppStoreAppCard,
  AppStoreBanner,
  AppStoreHeader,
  AppStoreInstalledApp,
  AppStoreReview,
} from "./index";
import "./showcase.css";

const DEMO_IMAGE = {
  src: "https://placehold.co/144x144/151515/ffffff/png?text=App",
  alt: "App icon",
} as const;

const DEMO_IMAGE_LARGE = {
  src: "https://placehold.co/160x160/151515/ffffff/png?text=App",
  alt: "App icon",
} as const;

const HEADER_HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
  alt: "",
} as const;

const REVIEW_SAMPLE_BODY =
  "Fantastic Experience with Content Scheduler Pro! This app was incredibly easy to install and made dropshipping products to my store simple and hassle-free. The online help chat is super user-friendly, and I had a great experience with the support team who assisted me—they were friendly, knowledgeable, and quickly helped me with everything I needed. Excellent service all around. I would definitely recommend this app to anyone looking...";

const BANNER_HEADLINE =
  "When your app runs on Fanvue's API, creators earn more. Faster. With less effort.";

function AppStoreBannerDemo() {
  return (
    <div id="app-store-banner" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-sm mb-4">App store — Banner</h2>
      <p className="typography-regular-body-md text-content-secondary">
        <code className="typography-semibold-body-sm">max-w-[320px]</code> and{" "}
        <code className="typography-semibold-body-sm">min-h-[280px]</code> below{" "}
        <code className="typography-semibold-body-sm">md</code> (1280px);{" "}
        <code className="typography-semibold-body-sm">max-w-[820px]</code> and{" "}
        <code className="typography-semibold-body-sm">min-h-[184px]</code> from{" "}
        <code className="typography-semibold-body-sm">md</code> (1280px, Eden / MUI; Figma portrait
        / landscape).
      </p>
      <div className="flex flex-col gap-6 border border-neutral-alphas-200 border-dashed p-4">
        <AppStoreBanner
          eyebrow="Build for Fanvue"
          headline={BANNER_HEADLINE}
          ctaLabel="See how to get started"
          onCtaPress={() => {}}
        />
        <AppStoreBanner
          eyebrow="Build for Fanvue"
          headline={BANNER_HEADLINE}
          description="Optional body line for the landscape variant."
          ctaLabel="See how to get started"
          onCtaPress={() => {}}
        />
      </div>
    </div>
  );
}

function AppStoreReviewDemo() {
  return (
    <div id="app-store-review" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-sm mb-4">App store — Review</h2>
      <p className="typography-regular-body-md text-content-secondary">
        Header stacks below <code className="typography-semibold-body-sm">md</code> (1280px); name,
        stars, and date align in one row from{" "}
        <code className="typography-semibold-body-sm">md</code> up (Figma Mobile=Mobile vs
        Mobile=Default).
      </p>
      <div className="max-w-full border border-neutral-alphas-200 border-dashed p-4">
        <AppStoreReview
          reviewerName="Abbie"
          avatarInitials="AB"
          rating={4}
          reviewDate="30 Jun 2025"
          body={REVIEW_SAMPLE_BODY}
          helpfulCount={15}
          onHelpfulPress={() => {}}
          onShowMorePress={() => {}}
        />
      </div>
    </div>
  );
}

function AppStoreHeaderDemo() {
  return (
    <div id="app-store-header" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-sm mb-4">App store — Header</h2>
      <div className="max-w-3xl">
        <AppStoreHeader
          title={
            <>
              Do more
              <br />
              With fanvue Apps
            </>
          }
          subtitle="Reach the full potential of your earnings"
          imageProps={{ ...HEADER_HERO_IMAGE }}
        />
      </div>
    </div>
  );
}

function AppStoreAppCardDemo() {
  return (
    <div id="app-store-app-card" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-sm mb-4">App store — App card</h2>
      <p className="typography-regular-body-md text-content-secondary">
        Below the <code className="typography-semibold-body-sm">md</code> breakpoint (1280px): max
        width 343px, no Add. At <code className="typography-semibold-body-sm">md</code> and up: max
        width 400px and Add when enabled.
      </p>
      <div className="flex flex-col gap-6 border border-neutral-alphas-200 border-dashed p-4">
        <AppStoreAppCard
          title="Content Scheduler Pro"
          description="Put your products where people go to find ideas to try and buy"
          imageProps={{ ...DEMO_IMAGE }}
          planLabel="Free plan available"
        />
        <AppStoreAppCard
          title="Content Scheduler Pro"
          description="Put your products where people go to find ideas to try and buy"
          imageProps={{ ...DEMO_IMAGE }}
          showAdd
          onAdd={() => {}}
          rating={4.6}
          reviewCount={89}
          installCount={231}
          planLabel="Free plan available"
          category="messaging"
        />
      </div>
    </div>
  );
}

function AppStoreInstalledAppDemo() {
  return (
    <div id="app-store-installed-app" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-sm mb-4">App store — Installed app</h2>
      <div className="max-w-lg border border-neutral-alphas-200 border-dashed p-4">
        <AppStoreInstalledApp
          title="Content Scheduler Pro"
          builderName="Builder name"
          imageProps={{ ...DEMO_IMAGE_LARGE }}
          onOpen={() => {}}
          onMenuPress={() => {}}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const sections = [
    { id: "app-store-header", label: "App store — Header" },
    { id: "app-store-banner", label: "App store — Banner" },
    { id: "app-store-review", label: "App store — Review" },
    { id: "app-store-app-card", label: "App store — App card" },
    { id: "app-store-installed-app", label: "App store — Installed app" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setTocOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-content-primary">
      <ToastProvider>
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-neutral-alphas-200 border-b bg-inherit px-4 py-3">
          <div className="relative">
            <Button
              variant="secondary"
              size="40"
              onClick={() => setTocOpen((prev) => !prev)}
              aria-label="Toggle table of contents"
              leftIcon={<HomeIcon />}
              rightIcon={
                <ChevronRightIcon
                  className={`transition-transform ${tocOpen ? "rotate-90" : ""}`}
                />
              }
            >
              Components
            </Button>
            {tocOpen && (
              <>
                <div
                  className="fixed inset-0 z-60"
                  onClick={() => setTocOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute top-full left-0 z-70 mt-2 max-h-[calc(100vh-100px)] w-64 overflow-y-auto rounded-xs border border-neutral-alphas-200 bg-surface-primary shadow-lg">
                  <div className="p-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className="typography-semibold-body-md w-full rounded px-3 py-2 text-left text-content-primary hover:bg-neutral-alphas-100"
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="typography-semibold-body-md">{dark ? "Dark" : "Light"}</span>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${dark ? "bg-brand-primary-default" : "bg-neutral-alphas-200"}`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${dark ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          <section className="space-y-8">
            <AppStoreHeaderDemo />
            <AppStoreBannerDemo />
            <AppStoreReviewDemo />
            <AppStoreAppCardDemo />
            <AppStoreInstalledAppDemo />
          </section>
        </main>
      </ToastProvider>
    </div>
  );
}
