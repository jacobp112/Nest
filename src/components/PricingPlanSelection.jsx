import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Check,
  Crown,
  ArrowUpRight,
  Users,
  UserPlus,
  Home,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { btn, card } from "../theme/styles";

const PLAN_METADATA = [
  {
    id: "free",
    name: "Free",
    tagline: "Manual-first foundation",
    icon: Home,
    monthly: 0,
    annual: 0,
    annualSavings: null,
    features: [
      "Manual transaction tracking",
      "1 savings goal",
      "Monthly PDF reports",
    ],
  },
  {
    id: "premium_single",
    name: "Premium Single",
    tagline: "Automate and enhance your insight",
    icon: Crown,
    monthly: 4.99,
    annual: 49.99,
    annualSavings: "16%",
    features: [
      "Secure bank linking & sync",
      "Unlimited goals and categories",
      "Advanced reports & projections",
      "Automatic transaction matching",
    ],
    badge: "Most popular",
  },
  {
    id: "premium_couple",
    name: "Premium Couple",
    tagline: "Plan together with shared nests",
    icon: UserPlus,
    monthly: 7.99,
    annual: 79.99,
    annualSavings: "17%",
    features: [
      "Everything in Premium Single",
      "Shared nests for two people",
      "Collaborative budgeting workflow",
      "Joint insights and notifications",
    ],
    badge: "Best for partners",
  },
  {
    id: "premium_family",
    name: "Premium Family",
    tagline: "Coordinate the whole household",
    icon: Users,
    monthly: 11.99,
    annual: 119.99,
    annualSavings: "17%",
    features: [
      "All Premium Couple benefits",
      "Up to 5 household members",
      "Role-based permissions",
      "Priority concierge support",
    ],
  },
];

const PricingPlanSelection = ({
  currentPlan = "free",
  onSelectPlan,
  onDismiss,
  isProcessing = false,
}) => {
  const defaultPlanIndex = PLAN_METADATA.findIndex(
    (plan) => plan.id === "premium_single",
  );
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(
    defaultPlanIndex >= 0 ? defaultPlanIndex : 0,
  );
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    })
      .then(() => setParticlesReady(true))
      .catch((error) => {
        console.error("Failed to initialize pricing particles", error);
      });
  }, []);

  const particlesOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      detectRetina: true,
      background: { color: "transparent" },
      fpsLimit: 60,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "bubble" },
          resize: true,
        },
        modes: {
          bubble: { distance: 160, duration: 2, opacity: 0.4, size: 6 },
        },
      },
      particles: {
        number: { value: 80, density: { enable: true, area: 900 } },
        color: { value: ["#34d399", "#38bdf8", "#a855f7"] },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.2, max: 0.6 },
          animation: { enable: true, speed: 0.6, minimumValue: 0.2 },
        },
        size: {
          value: { min: 1, max: 3.5 },
          animation: { enable: true, speed: 3, minimumValue: 1 },
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
          wobble: { enable: true, distance: 8, speed: 0.3 },
        },
        links: { enable: false },
      },
    }),
    [],
  );

  const priceCopy = useMemo(() => {
    return PLAN_METADATA.map((plan) => {
      const price = billingCycle === "monthly" ? plan.monthly : plan.annual;
      const suffix = billingCycle === "monthly" ? " / month" : " / year";
      return {
        ...plan,
        displayPrice: plan.id === "free" ? "£0" : `£${price.toFixed(2)}`,
        suffix,
      };
    });
  }, [billingCycle]);

  useEffect(() => {
    const resolvedIndex = priceCopy.findIndex(
      (plan) => plan.id === currentPlan,
    );
    const fallbackIndex =
      resolvedIndex >= 0
        ? resolvedIndex
        : defaultPlanIndex >= 0
          ? defaultPlanIndex
          : 0;
    setActiveIndex(fallbackIndex);
    if (swiperInstance) {
      swiperInstance.slideTo(fallbackIndex);
    }
  }, [currentPlan, priceCopy, swiperInstance, defaultPlanIndex]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const dismissButtonClassName = btn({
    variant: "ghost",
    size: "sm",
    className:
      "h-9 w-9 rounded-full p-0 text-text-on-dark/70 backdrop-blur-sm hover:text-text-on-dark focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  });

  const navButtonClassName = btn({
    variant: "ghost",
    size: "sm",
    className:
      "h-10 w-10 rounded-full p-0 text-text-on-dark/80 border border-border/60 bg-surface-muted/70 shadow-soft hover:border-primary/40 hover:text-primary focus-visible:ring-primary/40",
  });

  return (
    <motion.div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-plan-title"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[rgb(var(--color-overlay-rgb)/0.9)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgb(var(--color-surface-rgb)/0.25)_0%,_rgb(var(--color-surface-muted-rgb)/0.35)_45%,_rgb(var(--color-background-rgb)/0.4)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgb(var(--color-primary-rgb)/0.2),_transparent_65%)]" />
        {particlesReady && (
          <div className="pointer-events-none absolute inset-0">
            <Particles options={particlesOptions} className="h-full w-full" />
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col text-text-on-dark">
          <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-primary/80 sm:text-[10px]">
                Upgrade Your Nest
              </span>
              <h2
                id="pricing-plan-title"
                className="text-xl font-semibold text-text-on-dark sm:text-2xl"
              >
                Choose the plan that grows with you
              </h2>
              <p className="max-w-2xl text-[11px] text-text-on-dark/75 sm:text-xs">
                Unlock automated bank syncing, collaborative household tools,
                and guided insights. Switch between monthly and annual billing
                whenever you need.
              </p>
            </div>
            {onDismiss ? (
              <button
                type="button"
                onClick={onDismiss}
                className={dismissButtonClassName}
                aria-label="Close pricing"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 sm:px-10 lg:px-16">
            <div className="flex items-center gap-2 text-[11px] text-text-on-dark/75 sm:text-xs">
              <span
                className={`font-medium ${
                  billingCycle === "monthly"
                    ? "text-primary/80"
                    : "text-text-on-dark/60"
                }`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() =>
                  setBillingCycle((prev) =>
                    prev === "monthly" ? "annual" : "monthly",
                  )
                }
                className="relative inline-flex h-9 w-16 items-center rounded-full bg-surface-muted/70 px-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-pressed={billingCycle === "annual"}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-surface shadow-soft transition duration-300 ${
                    billingCycle === "annual"
                      ? "translate-x-7"
                      : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`font-medium ${
                  billingCycle === "annual"
                    ? "text-primary/80"
                    : "text-text-on-dark/60"
                }`}
              >
                Annual
              </span>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary/80 shadow-sm shadow-primary/20">
                Save up to 17%
              </span>
            </div>

            <div className="relative mt-6 w-full max-w-[32rem]">
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1.08}
                centeredSlides
                spaceBetween={14}
                pagination={{ clickable: true }}
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="pricing-plan-swiper pb-12"
                breakpoints={{
                  640: { slidesPerView: 1.25 },
                  1024: { slidesPerView: 1.45 },
                }}
                initialSlide={
                  defaultPlanIndex >= 0 ? defaultPlanIndex : undefined
                }
              >
                {priceCopy.map((plan, index) => {
                  const Icon = plan.icon;
                  const isActive = index === activeIndex;
                  const isCurrent = currentPlan === plan.id;
                  const isFree = plan.id === "free";
                  const discountCopy =
                    billingCycle === "annual" && plan.annualSavings
                      ? `Save ${plan.annualSavings}`
                      : billingCycle === "monthly" && plan.id !== "free"
                        ? `${plan.displayPrice} billed monthly`
                        : null;

                  const planCardClassName = card({
                    variant: isActive ? "glass" : "muted",
                    padding: "lg",
                    className: `group relative flex h-full flex-col gap-3 overflow-hidden text-text-on-dark transition-all duration-300 backdrop-blur-md ${
                      plan.badge
                        ? "ring-1 ring-primary/40 shadow-glow-primary"
                        : "border-border/60"
                    }`,
                  });

                  const currentPlanButtonClassName = btn({
                    variant: "outline",
                    size: "sm",
                    block: true,
                    disabled: true,
                    className:
                      "rounded-full border-dashed border-border/60 bg-transparent text-text-on-dark/70",
                  });

                  const selectPlanButtonClassName = btn({
                    variant:
                      plan.badge || plan.id === "premium_couple"
                        ? "primary"
                        : "secondary",
                    size: "md",
                    block: true,
                    loading: isProcessing,
                    disabled: isProcessing,
                    className: "rounded-full shadow-soft",
                  });

                  return (
                    <SwiperSlide key={plan.id} className="!h-auto !py-1.5">
                      <motion.article
                        className={planCardClassName}
                        animate={{
                          scale: isActive ? 0.94 : 0.82,
                          opacity: isActive ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {plan.badge ? (
                          <div className="absolute -top-3 right-4 rounded-pill border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary/80 shadow-soft">
                            {plan.badge}
                          </div>
                        ) : null}

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 p-1.5 text-primary">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-text-on-dark">
                              {plan.name}
                            </h3>
                            <p className="text-[10px] text-text-on-dark/70">
                              {plan.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1">
                          <p className="text-lg font-semibold text-text-on-dark sm:text-[22px]">
                            {plan.displayPrice}
                            <span className="text-xs font-medium text-text-on-dark/70">
                              {plan.suffix}
                            </span>
                          </p>
                          {billingCycle === "annual" && plan.annualSavings ? (
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary/75">
                              Save {plan.annualSavings} with annual billing
                            </p>
                          ) : null}
                          {discountCopy && billingCycle === "monthly" ? (
                            <p className="text-[10px] text-text-on-dark/65">
                              {discountCopy}
                            </p>
                          ) : null}
                        </div>

                        <ul className="mt-3 flex-1 space-y-1.5 text-[10px] text-text-on-dark/80">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-left"
                            >
                              <Check className="mt-0.5 h-2.5 w-2.5 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 flex flex-col gap-2">
                          {isCurrent ? (
                            <button type="button" disabled className={currentPlanButtonClassName}>
                              {isFree ? "Your plan" : "Current plan"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onSelectPlan?.(plan.id)}
                              disabled={isProcessing}
                              aria-busy={isProcessing || undefined}
                              className={selectPlanButtonClassName}
                            >
                              <span className="flex items-center justify-center gap-1 text-sm">
                                {isProcessing
                                  ? "Processing..."
                                  : isFree
                                    ? "Upgrade"
                                    : "Choose plan"}
                                <ArrowUpRight className="h-2.5 w-2.5" />
                              </span>
                            </button>
                          )}
                          {!isFree && billingCycle === "annual" ? (
                            <p className="text-center text-[9px] text-text-on-dark/60">
                              £{plan.monthly.toFixed(2)}/mo equivalent when
                              billed annually
                            </p>
                          ) : null}
                        </div>
                      </motion.article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <div className="pointer-events-auto absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-5">
                <button
                  type="button"
                  onClick={() => swiperInstance?.slidePrev()}
                  className={navButtonClassName}
                  aria-label="View previous plan"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  className={navButtonClassName}
                  aria-label="View next plan"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingPlanSelection;
