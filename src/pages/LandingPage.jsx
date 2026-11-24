
import { useEffect, useState } from "react";

import {

  ArrowDownRight,

  ArrowRight,

  AudioLines,

  BarChart3,

  BookOpen,

  Check,

  ChevronDown,

  CirclePlay,

  Clock3,

  FileCheck2,

  FileText,

  GraduationCap,

  Headphones,

  Menu,
  Mail,
  MapPin,
  Phone,

  MessageSquareText,

  Mic,

  Moon,

  PenLine,

  Sparkles,

  Sun,

  Target,

  Users,

  X,

} from "lucide-react";

const skills = [

  {

    title: "Listening",

    eyebrow: "LISTEN WITH INTENTION",

    desc: "Build accuracy with focused exercises and exam-style audio practice.",

    meta: "4 sections · 40 questions",

    Icon: Headphones,

    tint: "rose",

    href: "#get-started",

  },

  {

    title: "Reading",

    eyebrow: "READ WITH STRATEGY",

    desc: "Improve comprehension, accuracy and time management.",

    meta: "3 passages · 40 questions",

    Icon: BookOpen,

    tint: "violet",

    href: "#get-started",

  },

  {

    title: "Writing",

    eyebrow: "WRITE WITH CLARITY",

    desc: "Practise both tasks and review structured feedback.",

    meta: "Task 1 & Task 2",

    Icon: PenLine,

    tint: "blue",

    href: "#feedback",

  },

  {

    title: "Speaking",

    eyebrow: "SPEAK WITH CONFIDENCE",

    desc: "Practise the three-part format and review your responses.",

    meta: "Parts 1, 2 & 3",

    Icon: Mic,

    tint: "mint",

    href: "#feedback",

  },

];

const resources = [

  {

    title: "Grammar essentials",

    desc: "Strengthen sentence structure and accuracy.",

    Icon: BookOpen,

  },

  {

    title: "Vocabulary builder",

    desc: "Learn useful words in context.",

    Icon: GraduationCap,

  },

  {

    title: "Exam strategies",

    desc: "Prepare for question types and time limits.",

    Icon: Target,

  },

];

const plans = [

  {

    name: "Free",

    price: "₹0",

    duration: "No expiry",

    desc: "A simple way to start building your routine.",

    features: [

      "2 full mock tests",

      "8 practice tests",

      "All study materials",

    ],

    featured: false,

  },

  {

    name: "Student Pro",

    price: "₹1,500",

    duration: "2 months",

    desc: "For independent learners ready to go deeper.",

    features: [

      "Full test library",

      "AI Writing feedback",

      "AI Speaking feedback",

      "Progress reports",

    ],

    featured: true,

  },

  {

    name: "Institute 6M",

    price: "₹12,000",

    duration: "6 months",

    desc: "A connected workspace for coaching institutes.",

    features: [

      "Trainer and student management",

      "Batches and assignments",

      "Human Writing grading",

      "Live Speaking, chat and CRM",

    ],

    featured: false,

  },

  {

    name: "Institute 12M",

    price: "₹17,000",

    duration: "12 months",

    desc: "Institute workflows for a full year.",

    features: [

      "Everything in Institute 6M",

      "Trainer and batch workflows",

      "Institute reports",

      "CRM and communication tools",

    ],

    featured: false,

  },

];

const navLinks = [

  ["Practice", "#practice"],

  ["Study resources", "#resources"],

  ["How it works", "#how-it-works"],

  ["Pricing", "#pricing"],

];

function LandingPage() {

  const [dark, setDark] = useState(() => {

    try {

      return localStorage.getItem("equilx-theme") === "dark";

    } catch {

      return false;

    }

  });

  const [menuOpen, setMenuOpen] = useState(false);

  const [previewTab, setPreviewTab] = useState("mock");

  useEffect(() => {

    try {

      localStorage.setItem("equilx-theme", dark ? "dark" : "light");

    } catch {

      // Theme switching still works without local storage.

    }

  }, [dark]);

  useEffect(() => {

    const elements = document.querySelectorAll("[data-reveal]");

    const reduceMotion = window.matchMedia(

      "(prefers-reduced-motion: reduce)"

    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {

      elements.forEach((el) => el.classList.add("visible"));

      return;

    }

    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },

      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }

    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();

  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (

    <div className={dark ? "dark" : ""}>

      <style>{`

        .eq-premium {
          --rose: #eb455f;
          --ink: #2b3467;
          --cursor-x: 50%;
          --cursor-y: 20%;
          position: relative;
          color: var(--ink);
          isolation: isolate;
        }

        .eq-premium::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(
            460px circle at var(--cursor-x) var(--cursor-y),
            rgba(235, 69, 95, 0.075),
            transparent 72%
          );
        }

        .eq-premium > header,
        .eq-premium > main,
        .eq-premium > footer {
          position: relative;
          z-index: 1;
        }

        @media (pointer: coarse), (prefers-reduced-motion: reduce) {
          .eq-premium::before {
            display: none;
          }
        }

        .dark .eq-premium {

          color: #fff8fa;

        }

        .eq-premium a,

        .eq-premium button {

          -webkit-tap-highlight-color: transparent;

        }

        .eq-premium a:focus-visible,

        .eq-premium button:focus-visible {

          outline: 3px solid #eb455f80;

          outline-offset: 4px;

        }

        .eq-premium .eq-header {

          box-shadow: 0 5px 28px #3d1c2910;

        }


        /* Premium navbar-only enhancements */
        .eq-premium .eq-header {
          position: sticky;
          top: 0;
          overflow: visible;
          isolation: isolate;
          background: rgba(255, 255, 255, 0.82);
          border-color: rgba(235, 69, 95, 0.16);
          box-shadow: 0 8px 34px rgba(43, 52, 103, 0.07);
          transition: background .3s ease, box-shadow .3s ease, border-color .3s ease;
        }

        .eq-premium .eq-header::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 1px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(235,69,95,.65), rgba(137,112,224,.55), transparent);
          opacity: .8;
        }

        .dark .eq-premium .eq-header {
          background: rgba(23, 21, 27, 0.84);
          border-color: rgba(235, 69, 95, 0.2);
          box-shadow: 0 8px 34px rgba(0, 0, 0, 0.2);
        }

        .eq-premium .eq-nav-brand {
          position: relative;
          border-radius: 18px;
          padding: 5px 10px 5px 5px;
          transition: transform .3s ease, background .3s ease;
        }
        .eq-premium .eq-nav-brand:hover {
          transform: translateY(-1px);
          background: rgba(235, 69, 95, .055);
        }
        .eq-premium .eq-nav-brand .eq-brand {
          transition: box-shadow .3s ease, transform .3s ease;
          box-shadow: 0 0 0 1px rgba(255,255,255,.35) inset, 0 7px 22px rgba(235,69,95,.3);
        }
        .eq-premium .eq-nav-brand:hover .eq-brand {
          transform: rotate(-5deg) scale(1.04);
          box-shadow: 0 0 24px rgba(235,69,95,.42), 0 7px 22px rgba(235,69,95,.25);
        }
        .eq-premium .eq-nav-brand .eq-nav-name {
          transition: text-shadow .3s ease;
        }
        .eq-premium .eq-nav-brand:hover .eq-nav-name {
          text-shadow: 0 0 18px rgba(235,69,95,.2);
        }
        .eq-premium .eq-nav-link {
          position: relative;
          padding: 10px 1px;
          border-radius: 8px;
          transition: color .25s ease, text-shadow .25s ease;
        }
        .eq-premium .eq-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 3px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(90deg, #eb455f, #b56ae8);
          transform: scaleX(0);
          transform-origin: left;
          box-shadow: 0 0 10px rgba(235,69,95,.5);
          transition: transform .28s ease;
        }
        .eq-premium .eq-nav-link:hover,
        .eq-premium .eq-nav-link:focus-visible {
          color: #eb455f;
          text-shadow: 0 0 16px rgba(235,69,95,.18);
        }
        .eq-premium .eq-nav-link:hover::after,
        .eq-premium .eq-nav-link:focus-visible::after { transform: scaleX(1); }
        .eq-premium .eq-nav-login {
          border-radius: 10px;
          transition: color .25s ease, background .25s ease, text-shadow .25s ease;
        }
        .eq-premium .eq-nav-login:hover {
          color: #eb455f;
          background: rgba(235,69,95,.06);
          text-shadow: 0 0 14px rgba(235,69,95,.25);
        }
        .eq-premium .eq-nav-icon-btn {
          display: inline-grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(255,255,255,.65);
          box-shadow: 0 3px 12px rgba(43,52,103,.04);
          transition: transform .25s ease, color .25s ease, border-color .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .dark .eq-premium .eq-nav-icon-btn { background: rgba(255,255,255,.035); }
        .eq-premium .eq-nav-icon-btn:hover {
          transform: translateY(-2px);
          color: #eb455f;
          border-color: rgba(235,69,95,.6);
          box-shadow: 0 0 0 3px rgba(235,69,95,.07), 0 7px 20px rgba(235,69,95,.12);
        }
        .eq-premium .eq-nav-cta {
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(235,69,95,.25), 0 0 0 1px rgba(255,255,255,.18) inset;
        }
        .eq-premium .eq-nav-cta::before {
          content: "";
          position: absolute;
          top: -40%;
          bottom: -40%;
          left: -65%;
          width: 38%;
          transform: skewX(-20deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
          transition: left .55s ease;
          pointer-events: none;
        }
        .eq-premium .eq-nav-cta:hover::before { left: 130%; }
        .eq-premium .eq-mobile-nav {
          border-top: 1px solid rgba(235,69,95,.14);
          background: rgba(255,255,255,.96);
          box-shadow: 0 18px 28px rgba(43,52,103,.08);
          animation: eq-nav-drop .22s ease both;
        }
        .dark .eq-premium .eq-mobile-nav {
          background: rgba(23,21,27,.97);
          border-color: rgba(235,69,95,.2);
        }
        .eq-premium .eq-mobile-link {
          border: 1px solid transparent;
          transition: color .2s ease, background .2s ease, border-color .2s ease, transform .2s ease;
        }
        .eq-premium .eq-mobile-link:hover {
          color: #eb455f;
          border-color: rgba(235,69,95,.18);
          background: linear-gradient(90deg, rgba(235,69,95,.09), rgba(181,106,232,.055));
          transform: translateX(3px);
        }
        @keyframes eq-nav-drop {
          from { opacity: 0; transform: translateY(-7px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .eq-premium .eq-nav-brand,
          .eq-premium .eq-nav-link,
          .eq-premium .eq-nav-icon-btn,
          .eq-premium .eq-nav-cta,
          .eq-premium .eq-mobile-link { transition: none !important; }
          .eq-premium .eq-mobile-nav { animation: none; }
        }


        .eq-premium .eq-hero {

          position: relative;

          isolation: isolate;

          overflow: hidden;

          background:

            radial-gradient(ellipse at 5% 10%, #eb455f18, transparent 35%),

            radial-gradient(ellipse at 95% 70%, #8c70e013, transparent 38%),

            linear-gradient(130deg, #fff8fa, #fff 65%, #fff9fb);

        }

        .dark .eq-premium .eq-hero {

          background:

            radial-gradient(ellipse at 5% 10%, #eb455f20, transparent 35%),

            radial-gradient(ellipse at 95% 70%, #8c70e019, transparent 38%),

            linear-gradient(130deg, #17151b, #20171d);

        }

        .eq-premium .eq-glow {

          position: absolute;

          inset: 0;

          z-index: -1;

          pointer-events: none;

          background: radial-gradient(

            430px circle at var(--px, 50%) var(--py, 35%),

            #eb455f18,

            transparent 72%

          );

        }

        .eq-premium .eq-grid {

          position: absolute;

          inset: 0;

          z-index: -1;

          pointer-events: none;

          opacity: .3;

          background-image:

            linear-gradient(#8f5d6f12 1px, transparent 1px),

            linear-gradient(90deg, #8f5d6f12 1px, transparent 1px);

          background-size: 42px 42px;

          mask-image: linear-gradient(to bottom, black, transparent 75%);

        }

        .eq-premium .eq-title {

          font-size: clamp(3rem, 5.5vw, 5.4rem);

          line-height: .99;

          letter-spacing: -.075em;

          font-weight: 800;

          text-wrap: balance;

        }

        .eq-premium .eq-gradient {

          background: linear-gradient(100deg, #eb455f, #f17b91 60%, #b95c92);

          background-clip: text;

          -webkit-background-clip: text;

          color: transparent;

        }

        .eq-premium .eq-brand {

          display: grid;

          width: 43px;

          height: 43px;

          place-items: center;

          border-radius: 14px;

          background: linear-gradient(135deg, #f16b80, #d82f50);

          color: white;

          font-size: 23px;

          font-weight: 800;

          box-shadow: 0 7px 20px #eb455f35;

        }

        .eq-premium .eq-primary {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          padding: 14px 21px;

          border-radius: 13px;

          background: #eb455f;

          color: white;

          font-size: 13px;

          font-weight: 700;

          box-shadow: 0 9px 24px #eb455f30;

          transition: transform .25s, box-shadow .25s, background .25s;

        }

        .eq-premium .eq-primary:hover {

          transform: translateY(-3px);

          background: #d83450;

          box-shadow: 0 14px 30px #eb455f40;

        }

        .eq-premium .eq-secondary {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          padding: 13px 20px;

          border: 1px solid #e8dce1;

          border-radius: 13px;

          background: #ffffffa8;

          font-size: 13px;

          font-weight: 700;

          transition: .25s;

        }

        .dark .eq-premium .eq-secondary {

          background: #251d24;

          border-color: #49313a;

        }

        .eq-premium .eq-secondary:hover {

          transform: translateY(-2px);

          border-color: #eb455f80;

        }

        .eq-premium .eq-icon {

          display: grid;

          width: 46px;

          height: 46px;

          flex-shrink: 0;

          place-items: center;

          border-radius: 15px;

          color: #eb455f;

          background: #fff0f3;

        }

        .dark .eq-premium .eq-icon {

          background: #402a32;

          color: #ffb5c3;

        }

        .eq-premium .eq-product {

          transform: perspective(1400px) rotateY(-2deg);

          transition: transform .55s, box-shadow .55s;

          box-shadow: 0 28px 90px #6f374920;

        }

        .eq-premium .eq-product:hover {

          transform: perspective(1400px) rotateY(0) translateY(-4px);

          box-shadow: 0 35px 100px #6f374930;

        }

        .eq-premium .eq-orbit {

          position: absolute;

          width: 135px;

          height: 135px;

          right: -25px;

          top: -35px;

          border: 1px solid #eb455f35;

          border-radius: 50%;

          pointer-events: none;

          animation: eq-orbit 19s linear infinite;

        }

        .eq-premium .eq-orbit::after {

          content: "";

          position: absolute;

          inset: 18px;

          border: 1px solid #8c70e035;

          border-radius: 50%;

        }

        .eq-premium .eq-float {

          animation: eq-float 5s ease-in-out infinite;

        }

        .eq-premium .eq-kicker {

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 2px;

          color: #eb455f;

        }

        .eq-premium .eq-heading {

          font-size: clamp(2rem, 3.5vw, 3.25rem);

          font-weight: 800;

          line-height: 1.1;

          letter-spacing: -.055em;

          text-wrap: balance;

        }

        /* Refined text and section interaction polish */
        .eq-premium .eq-heading,
        .eq-premium .eq-title {
          transition: text-shadow .3s ease;
        }
        .eq-premium .eq-heading:hover,
        .eq-premium .eq-title:hover {
          text-shadow: 0 0 28px rgba(235, 69, 95, .09);
        }
        .eq-premium #how-it-works,
        .eq-premium #resources,
        .eq-premium #institutes,
        .eq-premium #get-started {
          position: relative;
          isolation: isolate;
        }
        .eq-premium #how-it-works::before,
        .eq-premium #resources::before,
        .eq-premium #institutes::before,
        .eq-premium #get-started::before {
          content: "";
          position: absolute;
          inset: 8% 0;
          z-index: -1;
          pointer-events: none;
          opacity: .7;
          background: radial-gradient(ellipse at 50% 50%, rgba(235, 69, 95, .045), transparent 68%);
        }
        .dark .eq-premium #how-it-works::before,
        .dark .eq-premium #resources::before,
        .dark .eq-premium #institutes::before,
        .dark .eq-premium #get-started::before {
          background: radial-gradient(ellipse at 50% 50%, rgba(181, 106, 232, .07), transparent 68%);
        }
        .eq-premium .eq-plan.eq-featured {
          box-shadow: 0 18px 48px rgba(209, 77, 114, .14), 0 0 0 1px rgba(235, 69, 95, .06);
        }
        .eq-premium .eq-plan.eq-featured:hover {
          box-shadow: 0 25px 58px rgba(209, 77, 114, .2), 0 0 0 1px rgba(235, 69, 95, .12);
        }
        .eq-premium .eq-resource:focus-visible,
        .eq-premium .eq-skill-card:focus-visible {
          outline: 3px solid rgba(235, 69, 95, .55);
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .eq-premium .eq-heading,
          .eq-premium .eq-title { transition: none !important; }
          .eq-premium .eq-heading:hover,
          .eq-premium .eq-title:hover { text-shadow: none; }
        }

        .eq-premium #practice {
          position: relative;
          isolation: isolate;
        }

        .eq-premium #practice::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 8% 25%, rgba(235, 69, 95, 0.09), transparent 38%),
            radial-gradient(ellipse at 92% 65%, rgba(124, 99, 214, 0.10), transparent 40%);
        }

        .eq-premium .eq-skill-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #ece5e8;
          border-radius: 24px;
          background: linear-gradient(145deg, #ffffff, #fff8fa);
          box-shadow: 0 8px 28px rgba(43, 52, 103, 0.04);
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }

        .dark .eq-premium .eq-skill-card {
          background: linear-gradient(145deg, #241c24, #1b171d);
          border-color: #49313a;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
        }

        .eq-premium .eq-skill-card:hover {
          transform: translateY(-7px);
          border-color: rgba(235, 69, 95, 0.65);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.13);
        }

        .eq-premium .eq-art {
          position: relative;
          height: 170px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding: 20px;
          isolation: isolate;
        }

        .eq-premium .eq-art::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          transition: transform .5s ease;
        }

        .eq-premium .eq-skill-card:hover .eq-art::before {
          transform: scale(1.08);
        }

        .eq-premium .art-rose::before {
          background: linear-gradient(135deg, #f8cbd6, #eaa1b4 55%, #f9e4ea);
        }

        .eq-premium .art-violet::before {
          background: linear-gradient(135deg, #d8d0fa, #b9adee 55%, #eeeaff);
        }

        .eq-premium .art-blue::before {
          background: linear-gradient(135deg, #c8e4fa, #9bc8ed 55%, #e7f4ff);
        }

        .eq-premium .art-mint::before {
          background: linear-gradient(135deg, #c6eadb, #94d4bd 55%, #e7f7ef);
        }

        .dark .eq-premium .eq-art::before {
          filter: brightness(.72) saturate(.9);
        }

        .eq-premium .eq-art-orb {
          position: absolute;
          width: 145px;
          height: 145px;
          right: 10px;
          top: -30px;
          border: 1px solid rgba(255, 255, 255, .7);
          border-radius: 42% 58% 63% 37%;
          background: rgba(255, 255, 255, .16);
          transform: rotate(-20deg);
          transition: transform .55s ease;
          pointer-events: none;
        }

        .eq-premium .eq-skill-card:hover .eq-art-orb {
          transform: rotate(12deg) scale(1.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .eq-premium .eq-skill-card,
          .eq-premium .eq-art-orb {
            transition: none;
          }

          .eq-premium .eq-skill-card:hover {
            transform: none;
          }
        }

        .eq-premium .eq-step {

          display: flex;

          align-items: center;

          gap: 17px;

          padding: 20px;

          border: 1px solid #ece5e8;

          border-radius: 18px;

          background: #ffffffd9;

          transition: transform .3s, border-color .3s, box-shadow .3s;

        }

        .dark .eq-premium .eq-step {

          background: #211b22;

          border-color: #49313a;

        }

        .eq-premium .eq-step:hover {

          transform: translateX(5px);

          border-color: #eb455f70;

          box-shadow: 0 12px 30px #371f2a0d;

        }

        .eq-premium .eq-reveal {

          opacity: 0;

          transform: translateY(22px);

          transition: opacity .7s, transform .7s;

        }

        .eq-premium .eq-reveal.visible {

          opacity: 1;

          transform: translateY(0);

        }

        .eq-premium .eq-feedback {

          border: 1px solid #eee1e6;

          border-radius: 24px;

          background: white;

          box-shadow: 0 26px 75px #502b3a12;

        }

        .dark .eq-premium .eq-feedback {

          background: #211b22;

          border-color: #49313a;

        }

        .eq-premium .eq-resource {

          display: flex;

          align-items: center;

          gap: 16px;

          padding: 18px;

          border: 1px solid #eee5e8;

          border-radius: 17px;

          transition: transform .3s, border-color .3s, box-shadow .3s;

        }

        .dark .eq-premium .eq-resource {

          border-color: #49313a;

          background: #211b22;

        }

        .eq-premium .eq-resource:hover {

          transform: translateX(5px);

          border-color: #eb455f70;

          box-shadow: 0 12px 30px #371f2a0d;

        }

        .eq-premium .eq-plan {

          position: relative;

          display: flex;

          flex-direction: column;

          padding: 23px;

          border: 1px solid #e9e1e5;

          border-radius: 20px;

          background: white;

          transition: transform .3s, box-shadow .3s, border-color .3s;

        }

        .dark .eq-premium .eq-plan {

          background: #211b22;

          border-color: #49313a;

        }

        .eq-premium .eq-plan:hover {

          transform: translateY(-5px);

          border-color: #eb455f80;

          box-shadow: 0 20px 48px #44243112;

        }

        .eq-premium .eq-featured {

          border-color: #eb455f90;

          box-shadow: 0 15px 40px #d14d7218;

        }

        .eq-premium .eq-chip {

          display: inline-flex;

          align-items: center;

          gap: 6px;

          border: 1px solid #f0dce2;

          border-radius: 999px;

          padding: 7px 10px;

          background: #ffffffb5;

          font-size: 10px;

          font-weight: 600;

        }

        .dark .eq-premium .eq-chip {

          background: #2b2027;

          border-color: #49313a;

        }

        .eq-premium .eq-cta {

          border: 1px solid #f0dce2;

          background:

            radial-gradient(ellipse at 95% 0%, #eb455f20, transparent 40%),

            linear-gradient(110deg, #fff8fa, #fff 75%);

        }

        .dark .eq-premium .eq-cta {

          background: linear-gradient(110deg, #211b22, #1b171d);

          border-color: #49313a;

        }

        @keyframes eq-float {

          0%, 100% { transform: translateY(0); }

          50% { transform: translateY(-7px); }

        }

        @keyframes eq-orbit {

          to { transform: rotate(360deg); }

        }

        @media (max-width: 767px) {

          .eq-premium .eq-title {

            font-size: clamp(2.8rem, 12vw, 4rem);

          }

          .eq-premium .eq-glow {

            display: none;

          }

          .eq-premium .eq-product {

            transform: none;

          }

          .eq-premium .eq-step {

            padding: 15px;

          }

        }

        @media (pointer: coarse) {

          .eq-premium .eq-glow {

            display: none;

          }

        }

        @media (prefers-reduced-motion: reduce) {

          .eq-premium *,

          .eq-premium *::before,

          .eq-premium *::after {

            animation-duration: .01ms !important;

            animation-iteration-count: 1 !important;

            transition-duration: .01ms !important;

          }

          .eq-premium .eq-reveal {

            opacity: 1;

            transform: none;

          }

        }

      `}</style>

      <div
        className="eq-premium min-h-screen overflow-hidden bg-white text-[#2B3467] transition-colors duration-300 dark:bg-[#17151b] dark:text-[#fff8fa]"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--cursor-x",
            `${((event.clientX - rect.left) / rect.width) * 100}%`
          );
          const cursorY = `${((event.clientY - rect.top) / rect.height) * 100}%`;
          event.currentTarget.style.setProperty("--cursor-y", cursorY);
          event.currentTarget.style.setProperty("--px", `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty("--py", `${event.clientY - rect.top}px`);
        }}
      >

        <header className="eq-header sticky top-0 z-50 border-b border-[#f2e6e9] bg-white/90 backdrop-blur-2xl dark:border-[#3a2930] dark:bg-[#17151b]/90">

          <nav

            className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 xl:px-10"

            aria-label="Main navigation"

          >

            <a href="#home" onClick={closeMenu} className="eq-nav-brand flex items-center gap-3">

              <span className="eq-brand">e</span>

              <span>

                <span className="eq-nav-name block text-xl font-bold tracking-tight">

                  Equilx <span className="text-[#EB455F]">IELTS</span>

                </span>

                <span className="mt-1 block text-[9px] font-bold tracking-[2px] text-slate-500 dark:text-[#c9b9be]">

                  PREPARE WITH PURPOSE

                </span>

              </span>

            </a>

            <div className="hidden items-center gap-7 lg:flex">

              {navLinks.map(([label, href]) => (

                <a

                  key={label}

                  href={href}

                  className="eq-nav-link text-[13px] font-medium text-slate-600 dark:text-[#d7cbd0]"

                >

                  {label}

                </a>

              ))}

            </div>

            <div className="hidden items-center gap-3 lg:flex">

              <button

                onClick={() => setDark((value) => !value)}

                aria-label="Toggle theme"

                className="eq-nav-icon-btn rounded-xl border border-[#eee1e6] p-2.5 dark:border-[#49313a]"

              >

                {dark ? <Sun size={17} /> : <Moon size={17} />}

              </button>

              <a

                href="/dashboard"

                className="eq-nav-login px-3 py-2 text-sm font-semibold"

              >

                Log in

              </a>

              <a href="/dashboard" className="eq-primary eq-nav-cta">

                Get started <ArrowRight size={16} />

              </a>

            </div>

            <div className="flex items-center gap-2 lg:hidden">

              <button

                onClick={() => setDark((value) => !value)}

                aria-label="Toggle theme"

                className="eq-nav-icon-btn rounded-xl border border-[#eee1e6] p-2.5 dark:border-[#49313a]"

              >

                {dark ? <Sun size={17} /> : <Moon size={17} />}

              </button>

              <button

                onClick={() => setMenuOpen((value) => !value)}

                aria-label="Toggle menu"

                aria-expanded={menuOpen}

                className="rounded-xl border border-[#eee1e6] p-2.5 dark:border-[#49313a]"

              >

                {menuOpen ? <X size={19} /> : <Menu size={19} />}

              </button>

            </div>

          </nav>

          {menuOpen && (

            <div className="eq-mobile-nav px-5 py-4 lg:hidden">

              <div className="mx-auto flex max-w-[1320px] flex-col gap-2">

                {navLinks.map(([label, href]) => (

                  <a

                    key={label}

                    href={href}

                    onClick={closeMenu}

                    className="eq-mobile-link rounded-xl px-3 py-3 text-sm"

                  >

                    {label}

                  </a>

                ))}

                <a href="/dashboard" onClick={closeMenu} className="eq-primary eq-nav-cta mt-2">

                  Get started <ArrowRight size={16} />

                </a>

              </div>

            </div>

          )}

        </header>

        <main>

          <section

            id="home"
            className="eq-hero"
>

            <div className="eq-glow" />

            <div className="eq-grid" />

            <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[.88fr_1.12fr] lg:py-[76px] xl:px-10">

              <div className="eq-reveal relative z-10" data-reveal>

                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0dce2] bg-white/80 px-3 py-2 text-[10px] font-bold tracking-[1px] text-[#C83450] dark:border-[#49313a] dark:bg-[#211b22] dark:text-[#ffb5c3]">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#EB455F]" />

                  IELTS PREPARATION, MADE SIMPLE

                </span>

                <h1 className="eq-title">

                  Prepare smarter.

                  <span className="eq-gradient block">Perform with</span>

                  confidence.

                </h1>

                <p className="mt-5 max-w-[530px] text-base leading-8 text-slate-600 dark:text-[#d7cbd0]">

                  Practise all four IELTS skills, take full mock tests and improve

                  with structured feedback — all in one focused learning space.

                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                  <a href="/dashboard" className="eq-primary">

                    Start free practice <ArrowRight size={17} />

                  </a>

                  <a href="#how-it-works" className="eq-secondary">

                    Explore the platform <ArrowDownRight size={16} />

                  </a>

                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-600 dark:text-[#d7cbd0]">

                  {["4 IELTS skills", "Free study materials", "Practice at your pace"].map((item) => (

                    <span key={item} className="inline-flex items-center gap-2">

                      <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#EB455F] shadow-sm dark:bg-[#402a32]">

                        <Check size={12} strokeWidth={3} />

                      </span>

                      {item}

                    </span>

                  ))}

                </div>

                <div className="mt-9 flex items-center gap-3 border-t border-[#eadde2] pt-5 dark:border-[#49313a]">

                  <div className="flex -space-x-2">

                    {[BookOpen, Headphones, PenLine].map((Icon, index) => (

                      <span

                        key={index}

                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#fff0f3] text-[#EB455F] dark:border-[#17151b] dark:bg-[#402a32]"

                      >

                        <Icon size={15} />

                      </span>

                    ))}

                  </div>

                  <p className="max-w-[260px] text-[11px] leading-5 text-slate-500 dark:text-[#bcaeb3]">

                    One place for practice, feedback and free learning resources.

                  </p>

                </div>

              </div>

              <div className="eq-reveal relative z-10 mx-auto w-full max-w-[680px]" data-reveal>

                <div className="eq-orbit" />

                <div className="eq-orbit eq-float" style={{ top: "auto", bottom: "8%", left: "-30px", right: "auto", width: 85, height: 85 }} />

                <div className="eq-product relative rounded-[26px] border border-[#f0e4e8] bg-white/95 p-3 backdrop-blur-xl dark:border-[#49313a] dark:bg-[#211b22]/95 sm:p-4">

                  <div className="flex items-center justify-between border-b border-[#f1e7ea] px-2 pb-3 dark:border-[#49313a] sm:px-3">

                    <div className="flex items-center gap-2.5">

                      <span className="eq-brand !h-8 !w-8 !rounded-xl !text-base">e</span>

                      <div>

                        <p className="text-[11px] font-bold">Your learning space</p>

                        <p className="mt-0.5 text-[9px] text-slate-500 dark:text-[#bcaeb3]">A clearer next step</p>

                      </div>

                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-[#f0dce2] bg-[#fff7f9] px-2.5 py-1.5 text-[9px] font-semibold text-[#C83450] dark:border-[#49313a] dark:bg-[#33232b] dark:text-[#ffb5c3]">

                      <Sparkles size={11} /> PRODUCT PREVIEW

                    </span>

                  </div>

                  <div className="grid gap-3 pt-3 md:grid-cols-[142px_1fr]">

                    <aside className="hidden border-r border-[#f5eaed] pr-3 dark:border-[#49313a] md:block">

                      <p className="mb-3 px-2 pt-1 text-[9px] font-semibold uppercase tracking-[1.5px] text-slate-400">

                        Workspace

                      </p>

                      {[

                        ["Overview", BarChart3],

                        ["Mock tests", FileText],

                        ["Skill practice", BookOpen],

                        ["Feedback", MessageSquareText],

                        ["Study library", GraduationCap],

                      ].map(([label, Icon], index) => (

                        <div

                          key={label}

                          className={`mb-1 flex items-center gap-2 rounded-xl px-2 py-2.5 text-[10px] font-medium ${

                            index === 0

                              ? "bg-[#fff0f3] text-[#D83D58] dark:bg-[#402a32] dark:text-[#ffb5c3]"

                              : "text-slate-500 dark:text-[#c9b9be]"

                          }`}

                        >

                          <Icon size={14} /> {label}

                        </div>

                      ))}

                      <div className="mt-5 rounded-xl bg-[#fff7f8] p-3 dark:bg-[#2b2027]">

                        <Sparkles size={15} className="text-[#EB455F]" />

                        <p className="mt-2 text-[10px] font-bold">Keep your focus</p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-[#bcaeb3]">

                          Small, steady practice adds up.

                        </p>

                      </div>

                    </aside>

                    <div className="min-w-0 p-1 sm:p-2">

                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div>

                          <p className="text-[10px] text-slate-500 dark:text-[#bcaeb3]">

                            YOUR NEXT STEP

                          </p>

                          <h2 className="mt-1 text-[22px] font-bold tracking-tight sm:text-[25px]">

                            Make progress visible.

                          </h2>

                          <p className="mt-1 text-[11px] text-slate-500 dark:text-[#bcaeb3]">

                            Choose a preview to explore the experience.

                          </p>

                        </div>

                        <div className="flex items-center gap-1 rounded-xl border border-[#e9ebf2] p-1 dark:border-[#49313a]">

                          {[

                            ["mock", "Mock test"],

                            ["writing", "Feedback"],

                            ["progress", "Progress"],

                          ].map(([key, label]) => (

                            <button

                              key={key}

                              onClick={() => setPreviewTab(key)}

                              aria-pressed={previewTab === key}

                              className={`rounded-lg px-2 py-2 text-[9px] font-semibold transition sm:px-2.5 ${

                                previewTab === key

                                  ? "bg-[#EB455F] text-white shadow-sm"

                                  : "text-slate-500 hover:bg-[#fff0f3] dark:text-[#c9b9be] dark:hover:bg-[#402a32]"

                              }`}

                            >

                              {label}

                            </button>

                          ))}

                        </div>

                      </div>

                      {previewTab === "mock" && (

                        <div className="mt-4 space-y-3">

                          <div className="rounded-2xl border border-[#e9ebf2] p-3 dark:border-[#49313a] sm:p-4">

                            <div className="flex items-center justify-between gap-3">

                              <div className="flex items-center gap-2">

                                <span className="eq-icon !h-9 !w-9 !rounded-xl">

                                  <Clock3 size={17} />

                                </span>

                                <div>

                                  <p className="text-[11px] font-bold">Full mock test</p>

                                  <p className="mt-0.5 text-[9px] text-slate-500 dark:text-[#bcaeb3]">

                                    Four-skill exam format

                                  </p>

                                </div>

                              </div>

                              <span className="rounded-full bg-[#f5f7f9] px-2.5 py-1 text-[9px] font-semibold text-slate-600 dark:bg-[#30262d] dark:text-[#d7cbd0]">

                                EXAM MODE

                              </span>

                            </div>

                            <div className="mt-4 grid grid-cols-4 gap-2">

                              {[

                                ["Listening", Headphones],

                                ["Reading", BookOpen],

                                ["Writing", PenLine],

                                ["Speaking", Mic],

                              ].map(([label, Icon]) => (

                                <div key={label} className="rounded-xl bg-[#fff8fa] px-1.5 py-3 text-center dark:bg-[#2b2027]">

                                  <Icon size={17} className="mx-auto text-[#EB455F]" />

                                  <p className="mt-2 text-[9px] font-semibold">{label}</p>

                                </div>

                              ))}

                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-[#f0e7ea] pt-3 text-[10px] dark:border-[#49313a]">

                              <span className="text-slate-500 dark:text-[#bcaeb3]">

                                Timed · Structured · Reviewable

                              </span>

                              <span className="flex items-center gap-1 font-semibold text-[#EB455F]">

                                Explore <ArrowRight size={12} />

                              </span>

                            </div>

                          </div>

                          <div className="grid grid-cols-2 gap-3">

                            <div className="rounded-xl bg-[#fff7f8] p-3 dark:bg-[#2b2027]">

                              <AudioLines size={17} className="text-[#EB455F]" />

                              <p className="mt-2 text-[10px] font-bold">Focused practice</p>

                              <p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-[#bcaeb3]">

                                Work on one skill or section.

                              </p>

                            </div>

                            <div className="rounded-xl bg-[#f7f5ff] p-3 dark:bg-[#28232e]">

                              <FileCheck2 size={17} className="text-[#7C63D6]" />

                              <p className="mt-2 text-[10px] font-bold">Review your answers</p>

                              <p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-[#bcaeb3]">

                                Understand where to improve.

                              </p>

                            </div>

                          </div>

                        </div>

                      )}

                      {previewTab === "writing" && (

                        <div className="mt-4 rounded-2xl border border-[#e9ebf2] p-3 dark:border-[#49313a] sm:p-4">

                          <div className="flex items-center justify-between gap-2">

                            <div>

                              <p className="text-[11px] font-bold">Writing feedback preview</p>

                              <p className="mt-1 text-[9px] text-slate-500 dark:text-[#bcaeb3]">

                                Structured criteria · AI estimate

                              </p>

                            </div>

                            <span className="rounded-full bg-[#fff0f3] px-2.5 py-1 text-[9px] font-semibold text-[#C83450] dark:bg-[#402a32] dark:text-[#ffb5c3]">

                              ILLUSTRATIVE

                            </span>

                          </div>

                          <div className="mt-4 space-y-3">

                            {[

                              ["Task Achievement / Response", "Review", 72],

                              ["Coherence & Cohesion", "Developing", 58],

                              ["Lexical Resource", "Review", 65],

                              ["Grammar Range & Accuracy", "Developing", 54],

                            ].map(([criterion, status, width]) => (

                              <div key={criterion}>

                                <div className="flex justify-between gap-2 text-[10px]">

                                  <span>{criterion}</span>

                                  <span className="font-semibold text-[#EB455F]">{status}</span>

                                </div>

                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f4e9ed] dark:bg-[#42353b]">

                                  <div

                                    className="h-full rounded-full bg-[#EB455F]"

                                    style={{ width: `${width}%` }}

                                  />

                                </div>

                              </div>

                            ))}

                          </div>

                          <div className="mt-4 flex gap-2 rounded-xl bg-[#fff7f8] p-3 dark:bg-[#2b2027]">

                            <Sparkles size={15} className="mt-0.5 shrink-0 text-[#EB455F]" />

                            <p className="text-[10px] leading-5 text-slate-600 dark:text-[#d7cbd0]">

                              Feedback can highlight areas to improve, sentence corrections and next-step suggestions. AI bands are estimates, not official IELTS results.

                            </p>

                          </div>

                        </div>

                      )}

                      {previewTab === "progress" && (

                        <div className="mt-4 rounded-2xl border border-[#e9ebf2] p-3 dark:border-[#49313a] sm:p-4">

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="text-[11px] font-bold">Progress overview</p>

                              <p className="mt-1 text-[9px] text-slate-500 dark:text-[#bcaeb3]">

                                Sample reporting experience

                              </p>

                            </div>

                            <BarChart3 size={19} className="text-[#EB455F]" />

                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">

                            {[

                              ["Skill trends", "Compare progress"],

                              ["Weak question types", "Find focus areas"],

                              ["Recent attempts", "Review past work"],

                              ["Next assignment", "Know what comes next"],

                            ].map(([title, desc]) => (

                              <div key={title} className="rounded-xl bg-[#fff8fa] p-3 dark:bg-[#2b2027]">

                                <p className="text-[10px] font-bold">{title}</p>

                                <p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-[#bcaeb3]">{desc}</p>

                              </div>

                            ))}

                          </div>

                          <p className="mt-3 text-[9px] text-slate-400">

                            Concept preview — no live student data.

                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

                <div className="eq-float mt-4 flex items-center gap-3 rounded-2xl border border-[#f0dce2] bg-white/90 p-3 shadow-xl dark:border-[#49313a] dark:bg-[#211b22] sm:absolute sm:-bottom-5 sm:-left-5 sm:mt-0">

                  <span className="eq-icon"><Sparkles size={17} /></span>

                  <div>

                    <p className="text-[11px] font-bold">Practice with purpose</p>

                    <p className="mt-1 text-[9px] text-slate-500 dark:text-[#bcaeb3]">

                      Practice · Review · Improve

                    </p>

                  </div>

                </div>

                <p className="mt-3 text-center text-[10px] text-slate-400">

                  Interactive concept preview · Sample content only

                </p>

              </div>

            </div>

          </section>

          <section className="mx-auto grid max-w-[1320px] gap-5 px-5 py-9 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 xl:px-10" data-reveal>

            {[

              ["Four-skill preparation", "Listening, Reading, Writing and Speaking.", Headphones],

              ["Exam-style practice", "Full mocks and focused skill sessions.", FileText],

              ["Feedback that guides", "AI feedback for Writing and Speaking.", Sparkles],

              ["Free learning library", "IELTS and English study resources.", BookOpen],

            ].map(([title, desc, Icon]) => (

              <div key={title} className="flex items-center gap-4 transition hover:-translate-y-1">

                <span className="eq-icon"><Icon size={21} /></span>

                <div>

                  <h3 className="text-xs font-bold">{title}</h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-[#bcaeb3]">{desc}</p>

                </div>

              </div>

            ))}

          </section>

          <section id="practice" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24 xl:px-10">

            <div className="eq-reveal flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>

              <div>

                <p className="eq-kicker">YOUR FOUR IELTS SKILLS</p>

                <h2 className="eq-heading mt-3">Every skill has a next step.</h2>

              </div>

              <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-[#d7cbd0]">

                Move between focused practice and full exam preparation, with each skill easy to find and return to.

              </p>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {skills.map(({ title, eyebrow, desc, meta, Icon, tint, href }, index) => (

                <a

                  key={title}

                  href={href}

                  className="eq-skill-card eq-reveal"

                  data-reveal

                  style={{ transitionDelay: `${index * 80}ms` }}

                >

                  <div className={`eq-art art-${tint}`}>

                    <span className="absolute left-4 top-4 text-[10px] font-extrabold tracking-[2px] text-[#2b346780]">

                      0{index + 1}

                    </span>

                    <div className="eq-art-orb" />

                    <span className="eq-icon relative z-10">

                      <Icon size={23} />

                    </span>

                    <span className="relative z-10 ml-auto grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/50 text-[#2b3467] transition group-hover:rotate-[-35deg]">

                      <ArrowRight size={16} />

                    </span>

                  </div>

                  <div className="px-4 pb-4 pt-4">

                    <p className="text-[9px] font-bold tracking-[1.5px] text-[#EB455F]">{eyebrow}</p>

                    <h3 className="mt-2 text-[17px] font-bold">{title}</h3>

                    <p className="mt-2 min-h-[58px] text-xs leading-6 text-slate-600 dark:text-[#d7cbd0]">{desc}</p>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e9ebf2] pt-3 text-[10px] text-slate-500 dark:border-[#49313a] dark:text-[#bcaeb3]">

                      <span>{meta}</span>

                      <span className="font-semibold text-[#EB455F]">Explore</span>

                    </div>

                  </div>

                </a>

              ))}

            </div>

          </section>

          <section id="how-it-works" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24 xl:px-10">

            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

              <div className="eq-reveal" data-reveal>

                <p className="eq-kicker">A ROUTINE THAT MAKES SENSE</p>

                <h2 className="eq-heading mt-3 max-w-lg">Less guessing. More meaningful practice.</h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-[#d7cbd0]">

                  A clear path from learning to practice helps you spend more time improving and less time deciding where to start.

                </p>

                <a href="#resources" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#EB455F] hover:gap-3">

                  Explore study resources <ArrowRight size={16} />

                </a>

              </div>

              <div className="space-y-3">

                {[

                  ["01", "Choose your focus", "Start with the skill, module or question type you want to work on.", Target],

                  ["02", "Practise in context", "Use focused exercises or prepare with a full exam-style mock.", CirclePlay],

                  ["03", "Review and improve", "Use your results and feedback to plan what to practise next.", BarChart3],

                ].map(([number, title, desc, Icon]) => (

                  <article key={number} className="eq-step eq-reveal" data-reveal>

                    <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border border-[#f1d9e0] bg-[#fff6f8] text-xs font-extrabold text-[#EB455F] dark:border-[#49313a] dark:bg-[#402a32] dark:text-[#ffb5c3]">

                      {number}

                    </span>

                    <div className="min-w-0 flex-1">

                      <h3 className="text-sm font-bold">{title}</h3>

                      <p className="mt-1.5 text-xs leading-6 text-slate-600 dark:text-[#d7cbd0]">{desc}</p>

                    </div>

                    <span className="eq-icon hidden sm:grid"><Icon size={19} /></span>

                  </article>

                ))}

              </div>

            </div>

          </section>

          <section id="feedback" className="border-y border-[#f3e9ed] bg-[#fffafb] dark:border-[#3a2930] dark:bg-[#1c171d]">

            <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-24 xl:px-10">

              <div className="eq-reveal" data-reveal>

                <p className="eq-kicker">FEEDBACK THAT MOVES YOU FORWARD</p>

                <h2 className="eq-heading mt-3">Understand your work. Know what to improve.</h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0]">

                  Writing and Speaking practice can be supported by structured AI feedback. In institute mode, trainers add human judgement where the learning journey calls for it.

                </p>

                <div className="mt-7 space-y-4">

                  {[

                    ["Writing feedback", "Criterion-based comments, sentence corrections and improvement suggestions."],

                    ["Speaking practice", "Recorded answers, transcript-based insights and practical tips."],

                    ["Trainer review", "In coaching mode, see trainer feedback alongside the AI draft."],

                  ].map(([title, desc]) => (

                    <div key={title} className="flex gap-3">

                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ffedf1] text-[#EB455F] dark:bg-[#402a32]">

                        <Check size={13} strokeWidth={3} />

                      </span>

                      <div>

                        <h3 className="text-[13px] font-bold">{title}</h3>

                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-[#d7cbd0]">{desc}</p>

                      </div>

                    </div>

                  ))}

                </div>

                <p className="mt-6 text-[10px] leading-5 text-slate-500 dark:text-[#bcaeb3]">

                  AI-generated band scores are estimates, not official IELTS results.

                </p>

              </div>

              <div className="eq-reveal" data-reveal>

                <div className="eq-feedback p-5 sm:p-6">

                  <div className="flex items-center justify-between border-b border-[#f0e7ea] pb-4 dark:border-[#49313a]">

                    <div className="flex items-center gap-2">

                      <span className="eq-brand !h-8 !w-8 !rounded-xl !text-base">e</span>

                      <div>

                        <p className="text-[11px] font-bold">Writing review</p>

                        <p className="text-[9px] text-slate-500 dark:text-[#bcaeb3]">Illustrative interface</p>

                      </div>

                    </div>

                    <span className="rounded-full bg-[#fff0f3] px-2.5 py-1.5 text-[9px] font-semibold text-[#C83450] dark:bg-[#402a32] dark:text-[#ffb5c3]">

                      AI DRAFT

                    </span>

                  </div>

                  <div className="mt-4 rounded-xl bg-[#fff8fa] p-4 dark:bg-[#2b2027]">

                    <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-slate-400">Feedback summary</p>

                    <p className="mt-2 text-xs leading-6 text-slate-700 dark:text-[#e4d8de]">

                      Your response has a clear central idea. Develop the supporting examples and use more precise transitions to strengthen the argument.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {["Clarity", "Structure", "Vocabulary"].map((label) => (

                        <span key={label} className="eq-chip">{label}</span>

                      ))}

                    </div>

                  </div>

                  <div className="mt-4 space-y-3">

                    {[

                      ["Task Response", "Strengthen the supporting example."],

                      ["Coherence & Cohesion", "Make the transition between ideas clearer."],

                      ["Lexical Resource", "Choose more precise wording in key sentences."],

                      ["Grammar", "Review complex sentence structure."],

                    ].map(([label, note], index) => (

                      <div key={label} className="flex gap-3 rounded-xl border border-[#eee5e8] p-3 dark:border-[#49313a]">

                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[10px] font-bold text-[#EB455F] dark:bg-[#402a32]">

                          {String(index + 1).padStart(2, "0")}

                        </span>

                        <div>

                          <p className="text-[10px] font-bold">{label}</p>

                          <p className="mt-1 text-[10px] leading-5 text-slate-500 dark:text-[#bcaeb3]">{note}</p>

                        </div>

                      </div>

                    ))}

                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f7f4ff] p-3 dark:bg-[#2d2637]">

                    <Sparkles size={15} className="shrink-0 text-[#7C63D6]" />

                    <p className="text-[10px] leading-5 text-slate-600 dark:text-[#d7cbd0]">

                      A trainer can review and publish final Writing feedback in institute mode.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          <section id="resources" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24 xl:px-10">

            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">

              <div className="eq-reveal" data-reveal>

                <p className="eq-kicker">LEARN BEYOND THE TEST</p>

                <h2 className="eq-heading mt-3">A stronger English foundation starts here.</h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0]">

                  Find practical resources to strengthen the language skills you use throughout your IELTS preparation.

                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#f0dce2] bg-[#fff7f9] px-3 py-2 text-[11px] font-semibold text-[#C83450] dark:border-[#49313a] dark:bg-[#2b2027] dark:text-[#ffb5c3]">

                  <BookOpen size={14} /> Study materials are free for everyone

                </div>

              </div>

              <div className="space-y-3">

                {resources.map(({ title, desc, Icon }, index) => (

                  <a

                    key={title}

                    href="/dashboard"

                    className="eq-resource eq-reveal"

                    data-reveal

                    style={{ transitionDelay: `${index * 80}ms` }}

                  >

                    <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl bg-[#fff0f3] text-[#EB455F] dark:bg-[#402a32]">

                      <Icon size={20} />

                    </span>

                    <span className="min-w-0 flex-1">

                      <span className="block text-sm font-bold">{title}</span>

                      <span className="mt-1 block text-[11px] leading-5 text-slate-500 dark:text-[#bcaeb3]">{desc}</span>

                    </span>

                    <ArrowRight size={17} className="text-[#EB455F]" />

                  </a>

                ))}

              </div>

            </div>

          </section>

          <section id="institutes" className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-8 lg:pb-24 xl:px-10">

            <div className="eq-reveal grid gap-8 overflow-hidden rounded-[28px] border border-[#efdee4] bg-[#fffafb] p-7 dark:border-[#49313a] dark:bg-[#211b22] sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:p-14" data-reveal>

              <div>

                <p className="eq-kicker">FOR IELTS COACHING INSTITUTES</p>

                <h2 className="eq-heading mt-3">Bring students, trainers and progress into one workspace.</h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0]">

                  Support the work around learning — from batch assignments and trainer review to institute reporting, communication and CRM.

                </p>

                <div className="mt-6 flex flex-wrap gap-2">

                  {[

                    "Trainer & student management",

                    "Batch assignments",

                    "Human Writing review",

                    "Live Speaking",

                    "Reports & CRM",

                  ].map((feature) => (

                    <span key={feature} className="eq-chip">

                      <Check size={12} className="text-[#EB455F]" /> {feature}

                    </span>

                  ))}

                </div>

                <a href="#pricing" className="eq-primary mt-8">

                  Explore institute plans <ArrowRight size={16} />

                </a>

              </div>

              <div className="relative flex min-h-[280px] items-center justify-center">

                <div className="eq-float w-full max-w-[340px] rounded-2xl border border-[#eee1e6] bg-white p-5 shadow-xl dark:border-[#49313a] dark:bg-[#211b22]">

                  <div className="flex items-center justify-between">

                    <span className="text-[10px] font-bold">Institute overview</span>

                    <span className="h-2 w-2 rounded-full bg-[#EB455F]" />

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-[#fff5f7] p-3 dark:bg-[#2b2027]">

                      <Users size={16} className="text-[#EB455F]" />

                      <p className="mt-3 text-[9px] text-slate-500 dark:text-[#bcaeb3]">Learners</p>

                      <p className="mt-1 text-sm font-bold">Student groups</p>

                    </div>

                    <div className="rounded-xl bg-[#f7f4ff] p-3 dark:bg-[#2d2637]">

                      <FileCheck2 size={16} className="text-[#7C63D6]" />

                      <p className="mt-3 text-[9px] text-slate-500 dark:text-[#bcaeb3]">Assignments</p>

                      <p className="mt-1 text-sm font-bold">Review queue</p>

                    </div>

                  </div>

                  <div className="mt-3 rounded-xl border border-[#eee5e8] p-3 dark:border-[#49313a]">

                    <div className="flex items-center gap-2">

                      <MessageSquareText size={14} className="text-[#EB455F]" />

                      <div>

                        <p className="text-[10px] font-bold">Trainer communication</p>

                        <p className="text-[9px] text-slate-500 dark:text-[#bcaeb3]">Keep work connected</p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

          <section id="pricing" className="border-y border-[#f3e9ed] bg-[#fffafb] dark:border-[#3a2930] dark:bg-[#1c171d]">

            <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24 xl:px-10">

              <div className="eq-reveal mx-auto max-w-2xl text-center" data-reveal>

                <p className="eq-kicker">SIMPLE, CLEAR PLANS</p>

                <h2 className="eq-heading mt-3">Find the right way to prepare.</h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0] sm:text-base">

                  Start with free practice or choose a plan that fits an individual learner or an institute.

                </p>

              </div>

              <div className="mx-auto mt-10 grid max-w-[1180px] gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {plans.map((plan, index) => (

                  <article

                    key={plan.name}

                    className={`eq-plan eq-reveal ${plan.featured ? "eq-featured" : ""}`}

                    data-reveal

                    style={{ transitionDelay: `${index * 70}ms` }}

                  >

                    {plan.featured && (

                      <span className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full bg-[#fff0f3] px-3 py-1.5 text-[9px] font-extrabold text-[#C83450] dark:bg-[#402a32] dark:text-[#ffb5c3]">

                        <Sparkles size={12} /> FOR INDEPENDENT LEARNERS

                      </span>

                    )}

                    <div className="flex items-start justify-between gap-2">

                      <h3 className="text-sm font-bold">{plan.name}</h3>

                      <span className="rounded-full bg-[#f7f4f5] px-2.5 py-1 text-[9px] font-semibold text-slate-500 dark:bg-[#30262d] dark:text-[#d7cbd0]">

                        {plan.duration}

                      </span>

                    </div>

                    <p className="mt-5 text-[32px] font-bold tracking-[-1.5px]">

                      {plan.price}

                    </p>

                    <p className="mt-2 min-h-[42px] text-[11px] leading-5 text-slate-500 dark:text-[#bcaeb3]">

                      {plan.desc}

                    </p>

                    <div className="my-5 border-t border-[#e9e1e5] dark:border-[#49313a]" />

                    <ul className="flex-1 space-y-3 text-[11px] leading-5 text-slate-600 dark:text-[#d7cbd0]">

                      {plan.features.map((feature) => (

                        <li key={feature} className="flex gap-2">

                          <Check size={14} className="mt-0.5 shrink-0 text-[#EB455F]" />

                          {feature}

                        </li>

                      ))}

                    </ul>

                    <a

                      href={plan.name === "Free" ? "/dashboard" : "#get-started"}

                      className={`mt-7 flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-[11px] font-bold transition ${

                        plan.featured

                          ? "bg-[#EB455F] text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#cf334d]"

                          : "border border-[#e7d5db] hover:border-[#EB455F] hover:bg-[#fff4f6] dark:border-[#49313a] dark:hover:bg-[#33252c]"

                      }`}

                    >

                      {plan.name === "Free" ? "Start for free" : "Explore plan"}

                      <ArrowRight size={14} />

                    </a>

                  </article>

                ))}

              </div>

              <p className="mx-auto mt-5 max-w-3xl text-center text-[10px] leading-5 text-slate-500 dark:text-[#bcaeb3]">

                Institute seat limits and GST treatment require confirmation.

                Plan access should be connected to verified account entitlements.

              </p>

            </div>

          </section>

          <section id="get-started" className="px-5 py-16 sm:px-8 lg:py-24">

            <div className="eq-cta eq-reveal mx-auto flex max-w-[1320px] flex-col gap-7 rounded-[28px] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14" data-reveal>

              <div className="max-w-2xl">

                <p className="eq-kicker">YOUR NEXT STEP STARTS HERE</p>

                <h2 className="eq-heading mt-3">Make your preparation count.</h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0] sm:text-base">

                  Start with a focused practice session and build from there, one skill at a time.

                </p>

              </div>

              <a href="/dashboard" className="eq-primary shrink-0">

                Start free practice <ArrowRight size={17} />

              </a>

            </div>

          </section>

        </main>

        <footer className="border-t border-[#e6e9f1] bg-white/70 dark:border-[#3a2930] dark:bg-[#17151b]/70">
          <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 xl:px-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-start">
              <a href="#home" className="flex items-center gap-3 justify-self-start">
                <span className="eq-brand !h-9 !w-9 !rounded-xl !text-base">e</span>
                <span>
                  <span className="block text-sm font-bold">
                    Equilx <span className="text-[#EB455F]">IELTS</span>
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-[#bcaeb3]">
                    Prepare with purpose.
                  </span>
                </span>
              </a>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0f3] text-[#EB455F] dark:bg-[#402a32] dark:text-[#ffb5c3]">
                    <Phone size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Call us</p>
                    <a href="tel:+919119194166" className="mt-1 block text-xs text-slate-500 transition hover:text-[#EB455F] dark:text-[#bcaeb3]">
                      +91 91191 94166
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0f3] text-[#EB455F] dark:bg-[#402a32] dark:text-[#ffb5c3]">
                    <Mail size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Email us</p>
                    <a href="mailto:ielts@equilx.in" className="mt-1 block break-all text-xs text-slate-500 transition hover:text-[#EB455F] dark:text-[#bcaeb3]">
                      ielts@equilx.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0f3] text-[#EB455F] dark:bg-[#402a32] dark:text-[#ffb5c3]">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Office</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#bcaeb3]">
                      Bhamashah Techno Hub, Jaipur
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-[#e6e9f1] pt-5 dark:border-[#3a2930] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-[#bcaeb3]">
                <a href="#practice" className="hover:text-[#EB455F]">Practice</a>
                <a href="#resources" className="hover:text-[#EB455F]">Resources</a>
                <a href="#institutes" className="hover:text-[#EB455F]">For institutes</a>
                <a href="#pricing" className="hover:text-[#EB455F]">Pricing</a>
              </div>
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Equilx Corporation
              </p>
            </div>
          </div>
        </footer>

      </div>

    </div>

  );

}

export default LandingPage;
