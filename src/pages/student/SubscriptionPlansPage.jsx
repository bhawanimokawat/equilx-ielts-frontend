import React, { useState } from "react";
import StudentLayout from "./StudentLayout";

import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Brain,
  BookOpen,
  Headphones,
  BarChart3,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

// ======================================================
// SUBSCRIPTION PLANS
// ======================================================

const plans = [
  {
    id: "individual",
    name: "Individual",
    price: 1500,
    duration: "2 months",
    description: "For independent learners.",
    seats: "",
    popular: false,
    features: [
      "IELTS skill practice",
      "Mock test access",
      "Feedback features",
      "Personal practice space",
    ],
  },
  {
    id: "institute-6m",
    name: "Institute 6M",
    price: 12000,
    duration: "6 months",
    description: "For coaching institutes.",
    seats: "12 student seats",
    popular: true,
    features: [
      "Trainer and batch workflows",
      "Practice assignments",
      "Student progress review",
      "Up to 12 active Institute Students",
    ],
  },
  {
    id: "institute-12m",
    name: "Institute 12M",
    price: 17000,
    duration: "12 months",
    description: "Longer-term institute access.",
    seats: "30 student seats",
    popular: false,
    features: [
      "Trainer and batch workflows",
      "Practice assignments",
      "Student progress review",
      "Up to 30 active Institute Students",
    ],
  },
];

// ======================================================
// BENEFITS
// ======================================================

const benefits = [
  {
    icon: Brain,
    title: "AI-powered feedback",
    description: "Understand your strengths and areas to improve.",
    bg: "bg-[#FFF0F3]",
    color: "text-[#FF2454]",
  },
  {
    icon: BarChart3,
    title: "Track your progress",
    description: "Monitor practice performance over time.",
    bg: "bg-[#EAF4FF]",
    color: "text-[#1680E8]",
  },
  {
    icon: Headphones,
    title: "Speaking practice",
    description: "Build confidence with structured speaking practice.",
    bg: "bg-[#E5F9F1]",
    color: "text-[#00A879]",
  },
  {
    icon: BookOpen,
    title: "Learning resources",
    description: "Access resources to support IELTS preparation.",
    bg: "bg-[#F1EAFE]",
    color: "text-[#8653D6]",
  },
];

// ======================================================
// FAQ
// ======================================================

const faqs = [
  {
    question: "What is included in the Individual plan?",
    answer:
      "The Individual plan provides IELTS skill practice, mock test access, feedback features and a personal practice space for 2 months.",
  },
  {
    question: "What is the difference between Institute 6M and 12M?",
    answer:
      "Institute 6M provides access for 6 months with 12 student seats. Institute 12M provides access for 12 months with 30 student seats.",
  },
  {
    question: "Can an institute manage students and trainers?",
    answer:
      "Institute plans include trainer and batch workflows, practice assignments and student progress review.",
  },
  {
    question: "How can I purchase a subscription?",
    answer:
      "Click Enquire about plan to express your interest. Payment and subscription activation depend on the configured backend and payment system.",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function SubscriptionPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [notice, setNotice] = useState("");

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan.id);

    setNotice(
      `${plan.name} selected. Please contact our team to enquire about this plan.`
    );
  };

  return (
    <StudentLayout>
      <div className="mx-auto w-full max-w-[1800px] space-y-5 pb-8">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2454]">
              <Crown size={14} />
              Plans & Membership
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-3xl">
              Choose your learning plan
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#71809D] dark:text-[#C1B5C0] sm:text-sm">
              Find the right plan for your IELTS preparation and work towards
              your target band score at your own pace.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-[#E7ECF6] bg-white px-3 py-2.5 dark:border-[#49333D] dark:bg-[#211e27] sm:self-auto">
            <ShieldCheck size={17} className="text-[#00A879]" />

            <span className="text-[10px] font-bold text-[#506995] dark:text-[#C1B5C0]">
              Flexible learning options
            </span>
          </div>
        </section>

        {/* =================================================
            HERO BANNER
        ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-[#E7ECF6] dark:border-[#49333D]">
          <div className="grid min-h-[210px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">

            {/* Banner Content */}

            <div className="relative z-10 flex flex-col justify-center bg-gradient-to-r from-white via-[#F5F7FF] to-[#FFF0F4] p-5 dark:from-[#211e27] dark:via-[#29232D] dark:to-[#30232B] sm:p-7 lg:p-9">
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2454]">
                <Sparkles size={14} />
                Your IELTS Journey
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-3xl lg:text-4xl">
                Invest in your preparation.
                <span className="text-[#FF456C]">
                  {" "}Grow your confidence.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-6 text-[#506995] dark:text-[#C1B5C0] sm:text-sm">
                Practise each IELTS module, understand your performance and
                choose the level of support that fits your learning goals.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("available-plans")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#E92E59]"
                >
                  Explore plans
                  <ArrowRight size={15} />
                </button>

                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#71809D] dark:text-[#C1B5C0]">
                  <LockKeyhole size={14} />
                  Secure subscription options
                </span>
              </div>
            </div>

            {/* NEW BANNER IMAGE - NO OVERLAY CARD */}

            <div className="relative min-h-[190px] overflow-hidden sm:min-h-[230px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1100&q=90"
                alt="Students collaborating and studying together"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

          </div>
        </section>

        {/* =================================================
            PLANS HEADING
        ================================================= */}

        <section id="available-plans" className="scroll-mt-6">
          <h2 className="text-xl font-black text-[#10265F] dark:text-[#FFF8FA]">
            Plans that fit your goals
          </h2>

          <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
            Compare features and choose the right level of support.
          </p>
        </section>

        {/* =================================================
            PLAN CARDS
        ================================================= */}

        <section className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">

          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <article
                key={plan.id}
                className={`relative flex h-full flex-col rounded-[24px] border bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-[#211e27] sm:p-8 ${
                  plan.popular
                    ? "border-[#FF8FA5] shadow-[0_12px_40px_rgba(255,36,84,0.07)] dark:border-[#FF456C]"
                    : "border-[#E1E6F0] shadow-[0_3px_15px_rgba(16,38,95,0.025)] dark:border-[#49333D]"
                }`}
              >

                {/* FAVOURITE BADGE */}

                {plan.popular && (
                  <div className="mb-5 w-fit rounded-full bg-[#FFF0F3] px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-[#FF456C] dark:bg-[#402630] dark:text-[#FF8FA5]">
                    Institute Favourite
                  </div>
                )}

                {/* PLAN NAME */}

                <h3 className="text-lg font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
                  {plan.name}
                </h3>

                {/* PRICE */}

                <div className="mt-7">
                  <span className="text-3xl font-black tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-[38px]">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </span>

                  <p className="mt-1 text-sm text-[#71809D] dark:text-[#C1B5C0]">
                    Access for {plan.duration}
                    {plan.seats && ` · ${plan.seats}`}
                  </p>
                </div>

                {/* DESCRIPTION */}

                <p className="mt-5 min-h-[28px] text-sm leading-6 text-[#50617F] dark:text-[#C1B5C0]">
                  {plan.description}
                </p>

                {/* DIVIDER */}

                <div className="mt-6 border-t border-[#E1E6F0] dark:border-[#49333D]" />

                {/* FEATURES */}

                <ul className="mt-7 space-y-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <Check
                        size={21}
                        strokeWidth={2.3}
                        className="mt-0.5 shrink-0 text-[#FF456C]"
                      />

                      <span className="text-sm leading-6 text-[#40516F] dark:text-[#D5CAD2]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* ENQUIRY BUTTON */}

                <div className="mt-auto pt-10">
                  <button
                    type="button"
                    onClick={() => handlePlanSelection(plan)}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-bold transition duration-200 ${
                      plan.popular
                        ? "border-[#FF456C] bg-[#FF456C] text-white hover:bg-[#E92E59]"
                        : "border-[#E1E6F0] bg-white text-[#26396F] hover:border-[#FF456C] hover:bg-[#FFF5F7] dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA] dark:hover:bg-[#30232B]"
                    }`}
                  >
                    {isSelected && <CheckCircle2 size={17} />}
                    Enquire about plan
                  </button>
                </div>

              </article>
            );
          })}

        </section>

        {/* =================================================
            SELECTION NOTICE
        ================================================= */}

        {notice && (
          <div className="flex items-start gap-3 rounded-xl border border-[#FFCCD6] bg-[#FFF5F7] p-4 dark:border-[#69404C] dark:bg-[#30232B]">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-[#FF456C]"
            />

            <div className="flex-1">
              <p className="text-sm font-bold text-[#10265F] dark:text-[#FFF8FA]">
                Plan selected
              </p>

              <p className="mt-1 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                {notice}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-xs font-bold text-[#71809D] hover:text-[#FF456C]"
            >
              Close
            </button>
          </div>
        )}

        {/* =================================================
            BENEFITS
        ================================================= */}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-[#10265F] dark:text-[#FFF8FA]">
              More than just practice
            </h2>

            <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
              Tools designed to support your preparation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-[#E7ECF6] bg-white p-5 transition hover:shadow-md dark:border-[#49333D] dark:bg-[#211e27]"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${benefit.bg} ${benefit.color}`}
                  >
                    <Icon size={21} />
                  </span>

                  <h3 className="mt-4 text-sm font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================
            FAQ
        ================================================= */}

        <section className="rounded-2xl border border-[#E7ECF6] bg-white p-5 dark:border-[#49333D] dark:bg-[#211e27] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
              <HelpCircle size={21} />
            </span>

            <div>
              <h2 className="text-lg font-black text-[#10265F] dark:text-[#FFF8FA]">
                Frequently asked questions
              </h2>

              <p className="mt-1 text-[11px] text-[#71809D] dark:text-[#C1B5C0]">
                A few things to know before choosing a plan.
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-[#EEF1F8] dark:divide-[#49333D]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-xs font-bold text-[#10265F] dark:text-[#FFF8FA] sm:text-sm">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#71809D] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="max-w-3xl pb-4 pr-6 text-xs leading-6 text-[#71809D] dark:text-[#C1B5C0]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================
            SUPPORT BANNER
        ================================================= */}

        <section className="relative overflow-hidden rounded-2xl bg-[#10265F] p-6 sm:p-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#FF2454]/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#FF8DA5]">
                <MessageCircle size={14} />
                Need assistance?
              </span>

              <h2 className="mt-2 text-xl font-black text-white">
                Not sure which plan is right for you?
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-white/65">
                Contact our team and get help choosing the right IELTS
                subscription for your learning requirements.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotice(
                  "Please contact the Equilx team for subscription assistance."
                )
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#E92E59]"
            >
              Contact our team
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

      </div>
    </StudentLayout>
  );
}