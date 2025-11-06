import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
const PointsBackgroundLazy = React.lazy(() => import('./PointsBackground.jsx'));
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
  // background handled by R3F Points, lazy-loaded when modal is open

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
      <div className="relative flex h-full flex-col overflow-hidden bg-[rgb(var(--color-overlay-rgb)/0.92)]">
  <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgb(var(--color-overlay-rgb)/0.97)_0%,_rgb(var(--color-overlay-rgb)/0.85)_55%,_transparent_100%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgb(var(--color-primary-rgb)/0.28),_transparent_65%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgb(var(--color-accent-rgb)/0.18),_transparent_60%)]" />
        <React.Suspense fallback={null}>
          <PointsBackgroundLazy className="absolute inset-0 pointer-events-none" />
        </React.Suspense>

        <div className="relative z-10 flex h-full flex-col text-text-on-dark">
          <div className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-primary/75 sm:text-xs">
                Upgrade Your Nest
              </span>
              <h2
                id="pricing-plan-title"
                className="text-2xl font-semibold text-text-on-dark sm:text-[2.1rem]"
              >
                Choose the plan that grows with you
              </h2>
              <p className="max-w-2xl text-[12px] text-text-on-dark/85 sm:text-sm">
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

          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 sm:px-10 lg:px-16">
            <div className="flex items-center gap-4 text-[12px] text-text-on-dark/90 sm:text-sm">
              <span
                className={`font-medium ${
                  billingCycle === "monthly"
                    ? "text-primary"
                    : "text-text-on-dark/75"
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
                className="relative inline-flex h-11 w-24 items-center rounded-full bg-surface/70 px-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-overlay-rgb)/0.9)]"
                aria-pressed={billingCycle === "annual"}
              >
                <span
                  className={`inline-block h-9 w-9 transform rounded-full bg-primary text-primary-content shadow-soft transition duration-300 ${
                    billingCycle === "annual"
                      ? "translate-x-12"
                      : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`font-medium ${
                  billingCycle === "annual"
                    ? "text-primary"
                    : "text-text-on-dark/75"
                }`}
              >
                Annual
              </span>
              <span className="rounded-full border border-primary/50 bg-primary/20 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary/90 shadow-sm shadow-primary/25">
                Save up to 17%
              </span>
            </div>

            <div className="relative mt-10 w-full max-w-6xl">
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView="auto"
                centeredSlides
                centeredSlidesBounds
                spaceBetween={24}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet bg-text-on-dark/40 opacity-100',
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
                }}
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="pricing-plan-swiper pb-16 !overflow-visible"
                breakpoints={{
                  640: { spaceBetween: 28 },
                  1024: { spaceBetween: 32 },
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
                    variant: isActive ? "surface" : "muted",
                    padding: "lg",
                    className: `group relative flex h-full w-[18rem] flex-col gap-4 overflow-hidden text-text-on-dark transition-all duration-300 sm:w-[21rem] lg:w-[23rem] ${
                      plan.badge
                        ? "ring-1 ring-primary/35 shadow-strong"
                        : "border-border/50"
                    } ${isActive ? "shadow-strong" : "shadow-soft"} bg-surface/95`,
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
                    <SwiperSlide
                      key={plan.id}
                      className="!flex !h-auto !w-auto !items-stretch !justify-center !px-4 !py-1.5"
                    >
                      <motion.article
                        className={planCardClassName}
                        animate={{
                          scale: isActive ? 1.02 : 0.98,
                          opacity: isActive ? 1 : 0.72,
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
                            <p className="text-[12px] text-text-on-dark/85">
                              {plan.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <p className="text-xl font-semibold text-text-on-dark sm:text-[26px]">
                            {plan.displayPrice}
                            <span className="text-base font-medium text-text-on-dark/85">
                              {plan.suffix}
                            </span>
                          </p>
                          {billingCycle === "annual" && plan.annualSavings ? (
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/80">
                              Save {plan.annualSavings} with annual billing
                            </p>
                          ) : null}
                          {discountCopy && billingCycle === "monthly" ? (
                            <p className="text-[12px] text-text-on-dark/80">
                              {discountCopy}
                            </p>
                          ) : null}
                        </div>

                        <ul className="mt-4 flex-1 space-y-2.5 text-[12px] text-text-on-dark/90">
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
                            <p className="text-center text-[11px] text-text-on-dark/80">
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
              <div className="pointer-events-auto mt-10 flex w-full flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-text-on-dark/60">
                  Plan {activeIndex + 1} of {priceCopy.length}
                </div>
                <div className="flex items-center justify-center gap-5">
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
      </div>
    </motion.div>
  );
};

export default PricingPlanSelection;
