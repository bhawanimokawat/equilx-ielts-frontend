import { useEffect, useState } from "react";
import {
  ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, Headphones,
  Menu, Moon, PenLine, Sun, Target, TrendingUp, Users, Mic, X,
  GraduationCap, ShieldCheck, Sparkles, ChartNoAxesColumnIncreasing,
  CalendarDays, FileText, BarChart3
} from "lucide-react";

const skills = [
  {
    title: "Listening",
    desc: "Practise with section-wise exercises and full-length tests.",
    meta: "4 sections · 40 questions",
    image: "/images/listening.jpg",
    Icon: Headphones,
    tint: "rose",
  },
  {
    title: "Reading",
    desc: "Improve comprehension, accuracy and time management.",
    meta: "3 passages · 40 questions",
    image: "/images/reading.jpg",
    Icon: BookOpen,
    tint: "violet",
  },
  {
    title: "Writing",
    desc: "Practise both tasks and review detailed feedback.",
    meta: "Task 1 & Task 2",
    image: "/images/writing.jpg",
    Icon: PenLine,
    tint: "blue",
  },
  {
    title: "Speaking",
    desc: "Build confidence with structured speaking practice.",
    meta: "Parts 1, 2 & 3",
    image: "/images/speaking.jpg",
    Icon: Mic,
    tint: "mint",
  },
];

const resources = [
  { title: "Grammar essentials", desc: "Strengthen sentence structure and accuracy.", Icon: BookOpen },
  { title: "Vocabulary builder", desc: "Learn useful words in context.", Icon: GraduationCap },
  { title: "Exam strategies", desc: "Prepare for question types and time limits.", Icon: Target },
];

const navLinks = [
  ["Practice", "#practice"],
  ["Study resources", "#resources"],
  ["How it works", "#how-it-works"],
  ["Pricing", "#pricing"],
];

function LandingPage() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("equilx-theme") === "dark"; }
    catch { return false; }
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("equilx-theme", dark ? "dark" : "light"); }
    catch { /* Theme works even when storage is unavailable. */ }
  }, [dark]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen overflow-hidden bg-white text-[#2B3467] transition-colors duration-300 dark:bg-[#17151b] dark:text-[#fff8fa]">
        <header className="sticky top-0 z-50 border-b border-[#f2e6e9] bg-white/95 backdrop-blur-xl dark:border-[#3a2930] dark:bg-[#17151b]/95">
          <nav className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 xl:px-10">
            <a href="#home" onClick={closeMenu} className="flex shrink-0 items-center gap-2.5">
              <span className="brand-mark">e</span>
              <span className="leading-tight">
                <span className="block text-[20px] font-bold tracking-[-.7px]">Equilx <span className="text-[#EB455F]">IELTS</span></span>
                <span className="mt-1 block text-[9px] font-bold tracking-[2px] text-slate-500 dark:text-[#c9b9be]">PREPARE WITH PURPOSE</span>
              </span>
            </a>
            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.map(([label, href], i) => <a key={label} href={href} className="nav-link">{label}{i < 2 && <ChevronDown size={13} className="ml-1 inline opacity-60" />}</a>)}
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <button onClick={() => setDark(v => !v)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="theme-toggle">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
              <a href="#get-started" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#EB455F] dark:text-[#f5e9ed]">Log in</a>
              <a href="#get-started" className="primary-btn">Get started <ArrowRight size={16} /></a>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setDark(v => !v)} aria-label="Toggle theme" className="theme-toggle">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
              <button onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} className="theme-toggle">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
            </div>
          </nav>
          {menuOpen && <div className="border-t border-[#f2e6e9] bg-white px-5 py-4 dark:border-[#3a2930] dark:bg-[#17151b] lg:hidden"><div className="mx-auto flex max-w-[1320px] flex-col gap-1">{navLinks.map(([label, href]) => <a key={label} href={href} onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-white dark:hover:bg-[#33252c]">{label}</a>)}<a href="#get-started" onClick={closeMenu} className="primary-btn mt-2 justify-center">Get started <ArrowRight size={16} /></a></div></div>}
        </header>

        <main>
          <section id="home" className="hero-wash">
            <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[.88fr_1.12fr] lg:gap-10 lg:py-[54px] xl:px-10">
              <div className="relative z-10">
                <span className="eyebrow"><span className="h-2 w-2 rounded-full bg-[#EB455F]" /> IELTS PREPARATION, MADE SIMPLE</span>
                <h1 className="hero-title">Your IELTS goal.<span className="block accent-text">A clearer way</span>to get there.</h1>
                <p className="mt-5 max-w-[530px] text-[16px] leading-[1.75] text-slate-600 dark:text-[#d7cbd0] sm:text-[17px]">Practise all four skills, explore study resources and prepare with a structured plan that helps you make every session count.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="#practice" className="primary-btn justify-center">Start practising <ArrowRight size={17} /></a><a href="#how-it-works" className="secondary-btn justify-center">Explore the platform</a></div>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-[12px] font-medium text-slate-600 dark:text-[#d7cbd0]">{["Structured practice", "Useful study resources", "Learn at your pace"].map(item => <span key={item} className="inline-flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#EB455F] dark:bg-[#402a32]"><Check size={12} strokeWidth={3} /></span>{item}</span>)}</div>
              </div>

              <div className="relative mx-auto w-full max-w-[680px]">
                <div className="dashboard-glow" />
                <div className="relative rounded-[23px] border border-[#f0e4e8] bg-white/95 p-3 shadow-[0_22px_65px_rgba(111,55,73,.08)] dark:border-[#49313a] dark:bg-[#211b22] sm:p-4">
                  <div className="grid gap-3 md:grid-cols-[145px_1fr]">
                    <aside className="hidden border-r border-[#f5eaed] pr-3 dark:border-[#49313a] md:block">
                      <div className="flex items-center gap-2 px-2 py-3"><span className="brand-mark !h-8 !w-8 !rounded-xl !text-base">e</span><span className="text-xs font-bold">Equilx <span className="text-[#EB455F]">IELTS</span></span></div>
                      <div className="mt-2 space-y-1">{[["Dashboard", TrendingUp], ["Practice", BookOpen], ["Mock tests", FileText], ["Study resources", GraduationCap], ["Progress", BarChart3], ["Settings", ShieldCheck]].map(([label, Icon], i) => <div key={label} className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] font-medium ${i === 0 ? "bg-white text-[#EB455F] dark:bg-[#402a32] dark:text-[#ffb5c3]" : "text-slate-500 dark:text-[#c9b9be]"}`}><Icon size={14} />{label}</div>)}</div>
                    </aside>
                    <div className="min-w-0 p-1 sm:p-2">
                      <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] text-slate-500 dark:text-[#bcaeb3]">Good morning,</p><h2 className="mt-1 text-[22px] font-bold tracking-tight sm:text-[25px]">Keep going!</h2><p className="mt-1 text-[11px] text-slate-500 dark:text-[#bcaeb3]">A little practice brings you closer to your goal.</p></div><div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#e9ebf2] px-3 py-2.5 dark:border-[#49313a]"><span className="rounded-lg bg-white p-2 text-[#EB455F] dark:bg-[#402a32]"><CalendarDays size={16} /></span><span><span className="block text-[9px] text-slate-500 dark:text-[#bcaeb3]">Study streak</span><b className="mt-0.5 block text-[11px]">7 days</b></span></div></div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1.08fr_.92fr]">
                        <div className="space-y-2">{[["Listening", "28 / 40", 70, Headphones], ["Reading", "22 / 40", 55, BookOpen], ["Writing", "8 / 20", 40, PenLine], ["Speaking", "12 / 20", 60, Mic]].map(([label, score, percent, Icon]) => <div key={label} className="flex items-center gap-2.5 rounded-xl border border-[#e9ebf2] bg-white p-2.5 dark:border-[#49313a] dark:bg-[#211b22] sm:p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#EB455F] dark:bg-[#402a32]"><Icon size={18} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2 text-[10px]"><b>{label}</b><span className="text-slate-500 dark:text-[#bcaeb3]">{score}</span></div><div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#f5ecee] dark:bg-[#42353b]"><div className="h-full rounded-full bg-[#EB455F]" style={{ width: `${percent}%` }} /></div></div><ChevronRight size={14} className="text-slate-400" /></div>)}</div>
                        <div className="flex flex-col gap-2"><div className="flex-1 rounded-xl border border-[#e9ebf2] p-3 dark:border-[#49313a]"><div className="flex items-center justify-between gap-2"><b className="text-[11px]">Practice overview</b><span className="text-[9px] text-slate-500">Sample</span></div><div className="mt-4 flex items-center gap-3"><div className="progress-ring"><div className="progress-ring-inner"><b className="text-[19px]">68%</b><span className="text-[9px] text-slate-500">Preview</span></div></div><div className="space-y-2 text-[10px]"><p><b className="block text-sm">12</b><span className="text-slate-500">Tests taken*</span></p><p><b className="block text-sm">48</b><span className="text-slate-500">Questions*</span></p></div></div><p className="mt-3 text-[9px] text-slate-400">*Illustrative values</p></div><a href="#practice" className="flex items-center gap-2.5 rounded-xl bg-white p-3 text-[#2B3467] transition hover:bg-[#eaf4fa]/50 dark:bg-[#402a32] dark:text-white dark:hover:bg-[#513540]"><span className="rounded-lg bg-white p-2 text-[#EB455F] dark:bg-[#2d2228]"><Target size={17} /></span><span className="min-w-0 flex-1"><span className="block text-[9px] text-[#EB455F] dark:text-[#ffb5c3]">NEXT STEP</span><b className="mt-1 block text-[10px]">Continue your practice</b></span><ArrowRight size={15} className="text-[#EB455F]" /></a></div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 border-t border-[#e9ebf2] pt-3 text-[10px] text-slate-500 dark:border-[#49313a] dark:text-[#bcaeb3]"><ShieldCheck size={15} className="text-[#EB455F]" />Your preparation, organised in one place.</div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-[10px] text-slate-400">Illustrative dashboard preview · Not live student data</p>
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-[1320px] gap-5 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-0 lg:py-9 xl:px-10">
            {[["For every learner", "Resources for self-study and classroom learning.", Users, "rose"], ["Focus on progress", "Identify weaker areas and practise with purpose.", Target, "violet"], ["Exam-style practice", "Build confidence with realistic tests and questions.", ChartNoAxesColumnIncreasing, "blue"], ["A reliable platform", "A clean, organised space for your IELTS journey.", ShieldCheck, "mint"]].map(([title, desc, Icon, tint], i) => <div key={title} className={`flex items-center gap-4 lg:px-5 ${i ? "lg:border-l lg:border-[#e6e9f1] dark:lg:border-[#49313a]" : ""}`}><span className={`feature-icon tint-${tint}`}><Icon size={25} /></span><div><h3 className="text-[13px] font-bold">{title}</h3><p className="mt-1 max-w-[210px] text-[11px] leading-[1.6] text-slate-500 dark:text-[#bcaeb3]">{desc}</p></div></div>)}
          </section>

          <section id="practice" className="skill-section">
            <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:py-[62px] xl:px-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="section-kicker">YOUR FOUR IELTS SKILLS</p><h2 className="section-title">Practise with purpose.</h2></div><div className="flex items-end justify-between gap-5 sm:max-w-[550px]"><p className="max-w-md text-[13px] leading-6 text-slate-600 dark:text-[#d7cbd0]">Build confidence step by step with focused practice, detailed feedback and resources for every part of the test.</p><a href="#get-started" className="hidden shrink-0 items-center gap-2 text-[12px] font-semibold text-[#EB455F] hover:underline md:inline-flex">Explore all skills <ArrowRight size={15} /></a></div></div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{skills.map(({ title, desc, meta, image, Icon, tint }) => <a key={title} href="#get-started" className="skill-card group"><div className="relative h-[112px] overflow-hidden rounded-[12px] bg-slate-100"><img src={image} alt={`${title} practice`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent" /><span className={`skill-icon tint-${tint}`}><Icon size={23} /></span></div><div className="px-3 pb-3 pt-2"><h3 className="text-[15px] font-bold">{title}</h3><p className="mt-1 min-h-[42px] text-[12px] leading-[1.55] text-slate-600 dark:text-[#d7cbd0]">{desc}</p><div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e9ebf2] pt-3 text-[11px] text-slate-500 dark:border-[#49313a] dark:text-[#bcaeb3]"><span>{meta}</span><span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee5e8] bg-white text-[#2B3467] transition group-hover:border-[#EB455F] group-hover:bg-[#EB455F] group-hover:text-white dark:border-[#49313a] dark:bg-[#2b2329] dark:text-white"><ArrowRight size={16} /></span></div></div></a>)}</div>
            </div>
          </section>

          <section id="how-it-works" className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:py-20 xl:px-10">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="section-kicker">A SIMPLE ROUTINE</p><h2 className="section-title max-w-lg">Know what to do next.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-[#d7cbd0]">A clear path from learning to practice helps you spend more time improving and less time deciding where to start.</p><a href="#resources" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#EB455F]">Explore study resources <ArrowRight size={16} /></a></div><div className="space-y-3">{[["01", "Choose your focus", "Start with the skill or question type you want to improve."], ["02", "Practise consistently", "Use focused exercises to build familiarity with the exam."], ["03", "Review and improve", "Use your results to decide what to practise next."]].map(([n, title, desc]) => <article key={n} className="flex gap-4 rounded-2xl border border-[#e6e9f1] bg-white p-5 dark:border-[#49313a] dark:bg-[#211b22] sm:p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#EB455F] dark:bg-[#402a32]">{n}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-[#d7cbd0]">{desc}</p></div></article>)}</div></div>
          </section>

          <section id="resources" className="border-y border-[#f3e9ed] bg-[#fffafb] dark:border-[#3a2930] dark:bg-[#1c171d]"><div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-20 xl:px-10"><div><p className="section-kicker">LEARN BEYOND THE TEST</p><h2 className="section-title max-w-lg">Build your English foundation.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-[#d7cbd0] sm:text-base">Explore organised learning materials to strengthen the skills you use throughout your IELTS preparation.</p><p className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-[#d7cbd0]"><Check size={17} className="text-[#EB455F]" />Study at your own pace.</p></div><div className="rounded-2xl border border-[#e6e9f1] bg-white p-3 dark:border-[#49313a] dark:bg-[#211b22] sm:p-4">{resources.map(({ title, desc, Icon }) => <a key={title} href="#get-started" className="flex items-center gap-4 rounded-xl p-4 transition hover:bg-white dark:hover:bg-[#33252c] sm:p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#EB455F] dark:bg-[#402a32]"><Icon size={20} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-[#bcaeb3]">{desc}</span></span><ChevronRight size={18} className="text-slate-400" /></a>)}</div></div></section>

          <section id="pricing" className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:py-20 xl:px-10"><div className="mx-auto max-w-2xl text-center"><p className="section-kicker">SIMPLE, CLEAR PLANS</p><h2 className="section-title">Choose your preparation plan.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0] sm:text-base">Choose an option that fits your learning or teaching needs.</p></div><div className="mx-auto mt-9 grid max-w-5xl gap-5 md:grid-cols-3">{[{ name: "Individual", price: "₹1,500", period: "2 months", desc: "For independent learners.", items: ["IELTS skill practice", "Mock test access", "Feedback features", "Personal practice space"] }, { name: "Institute", price: "₹10,000", period: "6 months", desc: "For coaching institutes.", items: ["Trainer and batch workflows", "Practice assignments", "Student progress review", "Institute workspace"], featured: true }, { name: "Institute", price: "₹17,000", period: "12 months", desc: "Longer-term institute access.", items: ["Trainer and batch workflows", "Practice assignments", "Student progress review", "12-month access period"] }].map(plan => <article key={`${plan.name}-${plan.period}`} className={`flex flex-col rounded-2xl border bg-white p-6 dark:bg-[#211b22] sm:p-7 ${plan.featured ? "border-[#e8a0b1] shadow-[0_12px_36px_rgba(209,77,114,.09)] dark:border-[#80505e]" : "border-[#e6e9f1] dark:border-[#49313a]"}`}>{plan.featured && <span className="mb-3 self-start rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#EB455F] dark:bg-[#402a32] dark:text-[#ffb5c3]">INSTITUTE FAVOURITE</span>}<h3 className="text-sm font-bold">{plan.name}</h3><p className="mt-4 text-3xl font-bold">{plan.price}</p><p className="mt-1 text-xs text-slate-500 dark:text-[#bcaeb3]">Access for {plan.period}</p><p className="mt-3 text-sm text-slate-600 dark:text-[#d7cbd0]">{plan.desc}</p><div className="my-6 border-t border-[#e6e9f1] dark:border-[#49313a]" /><ul className="flex-1 space-y-3 text-sm text-slate-600 dark:text-[#d7cbd0]">{plan.items.map(item => <li key={item} className="flex gap-2"><Check size={17} className="shrink-0 text-[#EB455F]" />{item}</li>)}</ul><a href="#get-started" className={`mt-7 rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${plan.featured ? "bg-[#EB455F] text-white hover:bg-[#cf334d]" : "border border-[#e7d5db] hover:bg-white dark:border-[#49313a] dark:hover:bg-[#33252c]"}`}>Enquire about plan</a></article>)}</div><p className="mt-5 text-center text-xs text-slate-500 dark:text-[#bcaeb3]">Confirm final features and institute seat limits before accepting payments.</p></section>

          <section id="get-started" className="px-5 pb-14 sm:px-8 lg:pb-20"><div className="cta-panel mx-auto flex max-w-[1320px] flex-col gap-7 rounded-[25px] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14"><div className="max-w-2xl"><p className="section-kicker">YOUR NEXT STEP STARTS HERE</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-[39px]">Make your preparation count.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#d7cbd0] sm:text-base">Build a preparation routine that works for your goals.</p></div><a href="#practice" className="primary-btn shrink-0 justify-center">Explore practice <ArrowRight size={17} /></a></div></section>
        </main>

        <footer className="border-t border-[#e6e9f1] dark:border-[#3a2930]"><div className="mx-auto flex max-w-[1320px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between xl:px-10"><a href="#home" className="flex items-center gap-3"><span className="brand-mark !h-9 !w-9 !rounded-xl !text-base">e</span><span><span className="block text-sm font-bold">Equilx <span className="text-[#EB455F]">IELTS</span></span><span className="mt-1 block text-xs text-slate-500 dark:text-[#bcaeb3]">Prepare with purpose.</span></span></a><div className="flex flex-wrap gap-5 text-xs text-slate-500 dark:text-[#bcaeb3]"><a href="#practice" className="hover:text-[#EB455F]">Practice</a><a href="#resources" className="hover:text-[#EB455F]">Resources</a><a href="#pricing" className="hover:text-[#EB455F]">Pricing</a><a href="#get-started" className="hover:text-[#EB455F]">Contact</a></div><p className="text-xs text-slate-400">© {new Date().getFullYear()} Equilx Corporation</p></div></footer>
      </div>
    </div>
  );
}
export default LandingPage;
