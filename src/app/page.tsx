import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Smartphone, Leaf, Shield, Zap, Fingerprint, Activity, BarChart4, X, Check, BatteryCharging } from "lucide-react";
import PerleFunnel from "@/components/PerleFunnel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f2f2f2] text-[#202324] selection:bg-[#e8ac15] selection:text-[#202324] pb-0 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">


        {/* Small badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#202324]/5 bg-white/60 backdrop-blur-xl text-xs font-bold tracking-[0.1em] uppercase text-[#202324] mb-10 shadow-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8ac15] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8ac15]"></span>
          </span>
          Die Zukunft der Energie
        </div>

        {/* Huge Headline */}
        <h1 className="relative z-10 text-5xl sm:text-6xl md:text-[6rem] lg:text-[7.5rem] font-extrabold tracking-[-0.04em] text-[#202324] leading-[0.9] max-w-5xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <span className="text-[#e8ac15]">Ökostrom</span>, einfach <br className="hidden md:block" />
          fair geliefert.
        </h1>

        {/* Sub-headline */}
        <p className="relative z-10 text-lg md:text-2xl text-[#202324]/60 font-medium max-w-2xl mx-auto leading-relaxed mb-14 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Dein Partner für saubere Energie. Wir bieten transparente Tarife ohne versteckte Kosten und 100% zertifizierten Ökostrom für dein Zuhause.
        </p>

        <div className="relative z-10 w-full pt-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <PerleFunnel />
        </div>
      </section>

      {/* --- LIVE PROGNOSE (App UI Mockup) --- */}
      <section id="technologie" className="px-4 md:px-12 pb-20 md:pb-32 overflow-hidden relative">
        <div className="max-w-[1000px] mx-auto relative group">
          <div className="relative w-full md:aspect-[21/9] bg-white rounded-3xl md:rounded-[2.5rem] border border-[#202324]/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col min-h-[250px] md:min-h-0">
            <div className="h-12 border-b border-[#202324]/5 flex items-center justify-between px-6 bg-slate-50/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#202324]/10"></div>
                <div className="w-3 h-3 rounded-full bg-[#202324]/10"></div>
                <div className="w-3 h-3 rounded-full bg-[#202324]/10"></div>
              </div>
              <div className="text-[10px] font-bold text-[#202324]/30 tracking-[0.2em] uppercase">Perle Live Dashboard</div>
              <div className="w-8"></div>
            </div>
            <div className="flex-1 bg-white p-4 sm:p-6 md:p-14 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

              <div className="relative z-10 w-full max-w-2xl bg-white border border-[#202324]/5 shadow-2xl rounded-2xl md:rounded-[2rem] p-5 md:p-10 flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between transform group-hover:-translate-y-1 transition duration-700">
                <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-[#e8ac15]">
                      <Activity size={20} strokeWidth={3} className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h3 className="font-bold text-[#202324] text-sm md:text-lg">Verbrauchsanalyse</h3>
                  </div>
                  <div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl md:text-7xl font-black text-[#202324] tracking-tighter">142</span>
                      <span className="text-lg md:text-3xl font-bold text-[#202324]/20 mb-0.5 md:mb-2"> kWh</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">
                      Effizient
                    </span>
                    <span className="text-[10px] font-bold text-[#202324]/40 uppercase tracking-widest whitespace-nowrap">Aktueller Monat</span>
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-20 md:h-32 flex items-end justify-between gap-1 md:gap-1.5 p-3 md:p-4 bg-slate-50/50 rounded-[14px] md:rounded-2xl border border-[#202324]/5 mt-4 md:mt-0">
                  {[30, 50, 40, 70, 45, 80, 25, 60, 40, 55].map((height, i) => (
                    <div key={i} className={`w-full max-w-[8px] md:max-w-[12px] rounded-t-sm transition-all duration-700 ${i === 5 ? 'bg-[#e8ac15]' : 'bg-[#202324]/10'}`} style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- YELLOW VISION BANNER --- */}
      <section className="bg-[#e8ac15] py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="shrink-0">
            <Fingerprint size={80} className="text-[#202324]/10" style={{ color: '#fff' }} strokeWidth={1} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#202324] leading-tight mb-4">
              Schluss mit teurem Grundversorger-Strom.<br />
              Entdecke die <span className="text-white">faire Energie-Revolution.</span>
            </h2>
            <p className="text-lg md:text-xl text-[#202324]/70 font-medium max-w-4xl leading-relaxed">
              Perle Energie liefert dir Strom zu fairen Konditionen, direkt aus nachhaltigen Quellen. 
              Wir verzichten auf teure Verwaltung und geben die Ersparnis an dich weiter.
              Keine Mindestlaufzeit, kein unnötiger Papierkram – einfach nur sauberer Ökostrom für dein Zuhause, verwaltet über eine intuitive App.
              Erlebe die Leichtigkeit der modernen Energieversorgung mit maximaler Flexibilität und voller Transparenz bei jedem verbrauchten Kilowatt.
            </p>
          </div>
        </div>
      </section>

      {/* --- COMPARISON CARD SECTION --- */}
      <section id="vergleich" className="py-16 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em]">Tarifvergleich: <span className="text-[#e8ac15]">Perle</span> vs. Klassik</h2>
            <p className="text-lg text-[#202324]/50 font-medium">Dein Ersparnis-Potenzial auf einen Blick.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
            <div className="bg-[#f2f2f2] border border-[#202324]/10 rounded-[2.5rem] md:rounded-r-none p-8 md:p-16 opacity-60">
              <h3 className="text-2xl font-bold text-[#202324]/40 mb-10 pb-4 border-b border-[#202324]/5">Herkömmliche Versorger</h3>
              <ul className="space-y-6 text-[#202324]/40 font-medium">
                <li className="flex items-center gap-4">
                  <X size={20} /> Starre Vertragslaufzeiten (12-24 Monate)
                </li>
                <li className="flex items-center gap-4">
                  <X size={20} /> Teure Grundgebühren & Bonus-Fallen
                </li>
                <li className="flex items-center gap-4">
                  <X size={20} /> Unpersönlicher Service & lange Wartezeiten
                </li>
                <li className="flex items-center gap-4">
                  <X size={20} /> Mix aus Kohle- & Atomstrom
                </li>
              </ul>
            </div>

            {/* VS Middle Indicator */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#202324] rounded-full border-4 border-[#f2f2f2] items-center justify-center text-white font-bold z-10">VS</div>

            <div className="bg-white border border-[#202324]/10 rounded-[2.5rem] md:rounded-l-none p-8 md:p-16 shadow-2xl relative z-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#e8ac15]/10 blur-[80px] pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-[#202324] mb-10 pb-4 border-b border-[#e8ac15]/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#e8ac15] animate-ping"></div> Perle Energie
              </h3>
              <ul className="space-y-6 text-[#202324] font-bold">
                <li className="flex items-center gap-4">
                  <Check size={20} className="text-green-500" /> Täglich kündbare Tarife möglich
                </li>
                <li className="flex items-center gap-4">
                  <Check size={20} className="text-green-500" /> Faire Preise ohne versteckte Margen
                </li>
                <li className="flex items-center gap-4">
                  <Check size={20} className="text-green-500" /> 100% digitale Verwaltung per App
                </li>
                <li className="flex items-center gap-4">
                  <Check size={20} className="text-green-500" /> 100% reiner Ökostrom-Tarif
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOUR PILLARS (Bento Grid) --- */}
      <section id="vorteile" className="py-16 md:py-24 px-6 md:px-12 bg-[#f2f2f2]">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

            {/* 0. Heading Area */}
            <div className="md:col-span-3 flex flex-col justify-center" style={{ textAlign: "center" }}>
              <p className="text-[10px] font-bold tracking-[0.4em] text-[#202324]/30 uppercase mb-4">DEINE VORTEILE</p>
              <h2 className="text-[2.5rem] md:text-[4rem] font-black tracking-[-0.05em] leading-[0.85] text-[#202324]">
                Warum<br />
                <span className="text-[#202324]/10">Perle?</span>
              </h2>
            </div>

            {/* 1. Digitale Vorherrschaft (Wide) */}
            <div className="md:col-span-6 bg-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group border border-white">
              <div className="relative z-10 space-y-8">
                <div className="w-10 h-10 bg-[#f9fafb] border border-[#202324]/5 rounded-xl flex items-center justify-center text-[#202324] shadow-sm">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Einfach digital.</h3>
                  <p className="text-[#202324]/50 font-medium text-sm leading-relaxed max-w-[280px]">
                    Kein Papierkram mehr. Von der Anmeldung bis zur Monatsabrechnung erledigst du alles bequem per App. Behalte deinen Energieverbrauch immer im Blick.
                  </p>
                </div>
              </div>
              {/* UI Mockup on the right */}
              <div className="hidden sm:flex absolute right-[-2.5rem] top-1/2 -translate-y-1/2 w-48 h-32 bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex-col p-5 gap-3 border border-[#202324]/5 group-hover:translate-x-[-1rem] transition-transform duration-700">
                <div className="h-2 w-1/3 bg-[#f2f2f2] rounded-full"></div>
                <div className="h-8 w-full bg-[#fef0cd] rounded-xl"></div>
                <div className="h-2 w-1/2 bg-[#f2f2f2] rounded-full"></div>
              </div>
            </div>

            {/* 2. 100% Ökostrom (Small) */}
            <div className="md:col-span-3 bg-[#1d1f20] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#e8ac15]">
                  <Leaf size={20} />
                </div>
                <div className="mt-12 space-y-4">
                  <h3 className="text-2xl font-bold leading-tight">100%<br />Grüner Strom.</h3>
                  <p className="text-white/40 font-medium text-xs leading-relaxed">
                    Saubere Energie für eine saubere Zukunft. Wir liefern ausschließlich Strom aus nachhaltigen Quellen.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2, Col 1-3: Echter Einkaufspreis */}
            <div className="md:col-span-3 bg-[#e8ac15] rounded-[2.5rem] p-8 md:p-10 text-[#202324] relative overflow-hidden group min-h-[340px]">
              <div className="absolute top-6 right-6 text-[#202324]/10 opacity-30 transform rotate-12 scale-[3] group-hover:scale-[3.2] transition-transform duration-1000 pointer-events-none">
                <Zap
                  size={100}
                  strokeWidth={1}
                  style={{
                    color: "gray",
                    height: "40px",
                    marginTop: "12px"
                  }}
                />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center border border-[#202324]/10">
                  <BarChart4 size={30} />
                </div>
                <div className="mt-auto space-y-4">
                  <h3 className="text-2xl font-bold">Faire<br />Preise.</h3>
                  <p className="text-[#202324]/70 font-bold text-xs leading-relaxed max-w-[180px]">
                    Wir garantieren faire Konditionen ohne versteckte Kosten oder böse Überraschungen.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Monatlich kündbar (Wide) */}
            <div className="md:col-span-9 bg-white rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden border border-white group flex items-center">
              <div className="relative z-10 space-y-8">
                <div className="w-10 h-10 bg-[#f9fafb] border border-[#202324]/5 rounded-xl flex items-center justify-center text-[#202324] shadow-sm">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">Maximale Freiheit.</h3>
                  <p className="text-[#202324]/40 font-medium text-sm leading-relaxed max-w-sm">
                    Du entscheidest. Mit unseren flexiblen Tarifen bleibst du ungebunden und wechselst ganz nach deinem Bedarf.
                  </p>
                </div>
              </div>
              {/* Mirrored yellow logo element on the right */}
              <div className="hidden sm:flex absolute right-[-2rem] md:right-[-4rem] top-0 bottom-0 w-1/2 items-center justify-end pointer-events-none opacity-100 ">
                <Image
                  src="/assets/p-logo.png"
                  alt="Perle Energie Logo Dekoration"
                  width={200}
                  height={200}
                  className="object-contain object-right"
                  style={{
                    transform: "scaleX(-1)",
                    height: "75%",
                    width: "57%"
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SMART GRID (Dark / Black Design) --- */}
      <section className="bg-[#111111] py-16 md:py-40 px-6 md:px-12 relative overflow-hidden min-h-[400px] md:min-h-[700px] flex items-center border-t border-white/5">
        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 w-full">
          {/* Left Column: Content */}
          <div className="space-y-12 animate-fade-in">
            {/* Roadmap Badge */}
            <div className="inline-flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl group">
              <div className="hidden md:flex w-5 h-5 bg-[#e8ac15] rounded-lg rotate-12 items-center justify-center p-1 shadow-[0_0_15px_rgba(232,172,21,0.3)] group-hover:rotate-0 transition-transform duration-500">
                <Zap size={12} className="text-[#111111] fill-current" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">ROADMAP 2026</span>
            </div>

            <div className="space-y-8">
              <h2 className="text-5xl md:text-[5rem] font-black text-white leading-[1.05] tracking-tight">
                Die Energie <br />
                von morgen.
              </h2>
              <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed">
                Wir nutzen intelligente Technologie, um die Stromversorgung effizienter and nachhaltiger zu gestalten. Bereit für die nächste Generation.
              </p>
            </div>

            {/* Smart Features Stats */}
            <div className="flex flex-wrap gap-5 pt-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 min-w-[190px] hover:bg-white/[0.08] transition-all duration-500 group">
                <div className="w-10 h-10 bg-[#e8ac15]/10 border border-[#e8ac15]/20 rounded-xl flex items-center justify-center text-[#e8ac15] group-hover:scale-110 transition-transform">
                  <BatteryCharging size={20} />
                </div>
                <div>
                  <div className="w-8 h-1 bg-[#e8ac15] rounded-full mb-3 opacity-30"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">E-Mobilität</span>
                  <p className="text-white text-md font-bold leading-none">Smart Charging</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 min-w-[190px] hover:bg-white/[0.08] transition-all duration-500 group">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30 group-hover:text-[#e8ac15] group-hover:scale-110 transition-transform">
                  <Activity size={20} />
                </div>
                <div>
                  <div className="w-8 h-1 bg-white/10 rounded-full mb-3 group-hover:bg-[#e8ac15]/40 transition-colors"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">Netzeffizienz</span>
                  <p className="text-white text-md font-bold leading-none">Smart Grid Ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Radar Visual Element */}
          <div className="hidden lg:flex relative items-center justify-center min-h-[500px] w-full lg:scale-110">
            {/* Target/Radar circles */}
            <div className="absolute w-[600px] h-[600px] rounded-full border border-white/5 animate-pulse-slow" />
            <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5" />
            <div className="absolute w-[150px] h-[150px] rounded-full border border-white/5" />

            {/* Target Axes */}
            <div className="absolute w-[700px] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="absolute h-[700px] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

            {/* Gaps in circles for military target look */}
            <div className="absolute w-[700px] h-[700px] rounded-full border-4 border-transparent border-t-white/5 border-b-white/5 animate-spin-slow opacity-20" />

            {/* Glowing center area */}
            <div className="absolute w-60 h-60 bg-[#e8ac15]/10 blur-[120px] animate-pulse" />

            {/* Main Logo Graphic sitting on radar */}
            <div className="relative z-10 w-[240px] md:w-[350px] transition-transform hover:scale-105 duration-1000 group">
              <Image
                src="/assets/p-logo.png"
                alt="Perle Energie Radar Grafik"
                width={350}
                height={350}
                className="hidden md:block w-full h-full object-contain drop-shadow-[0_0_80px_rgba(232,172,21,0.2)]"
                style={{
                  transform: 'scaleX(-1)'
                }}
              />
              {/* Inner glowing core in the P loop gap if needed */}
              <div className="hidden md:block absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#e8ac15] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" ></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-16 md:py-40 px-6 md:px-12 bg-white relative overflow-hidden">
        {/* Background Decorative element */}
        <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] opacity-[0.03] pointer-events-none transform rotate-45">
          <Image src="/assets/p-logo.png" alt="Dekoratives Perle Logo Hintergrund" width={600} height={600} className="w-full h-full object-contain" />
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
            <div className="space-y-6" style={{ paddingLeft: '4px' }}>
              <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] text-[#202324] leading-[0.9]">
                Häufig gestellte <br />
                <span className="text-[#e8ac15]">Fragen.</span>
              </h2>
              <p className="text-xl text-[#202324]/40 font-medium max-w-xl leading-relaxed">
                Alles, was du über deinen Stromwechsel und unsere fairen Tarife wissen musst.
              </p>
            </div>
            <div className="pb-2">
              <Link href="/faq" className="group inline-flex items-center gap-3 bg-[#202324] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#e8ac15] hover:text-[#202324] transition-all duration-300">
                Alle FAQ anzeigen <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                q: "Wie unkompliziert ist der Wechsel?",
                a: "Extrem. Du meldest dich online an, und wir erledigen alles Weitere, einschließlich der Kündigung bei deinem aktuellen Anbieter. Für dich ändert sich technisch nichts – außer der Preis.",
                icon: <Zap size={24} />
              },
              {
                q: "Gibt es versteckte Kosten?",
                a: "Nein. Wir hassen intransparente Kostenstrukturen genauso wie du. Du zahlst den monatlichen Grundpreis und den tatsächlichen Marktpreis für deinen Verbrauch – ohne Margen-Aufschlag.",
                icon: <BarChart4 size={24} />
              },
              {
                q: "Woher kommt der Strom genau?",
                a: "Wir liefern zu 100% echten Ökostrom aus europäischen Wind- und Wasserkraftanlagen. Dies wird durch offizielle Herkunftsnachweise lückenlos dokumentiert.",
                icon: <Leaf size={24} />
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-[#202324]/5 p-8 md:p-14 rounded-[3.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-700 group flex flex-col min-h-[450px]">
                <div className="w-16 h-16 bg-[#f9fafb] rounded-[2rem] flex items-center justify-center text-[#202324] mb-12 shadow-sm group-hover:bg-[#e8ac15] group-hover:text-white transition-all duration-500">
                  {faq.icon}
                </div>
                <h4 className="text-3xl font-bold mb-8 tracking-tight leading-tight">{faq.q}</h4>
                <p className="text-[#202324]/50 font-medium leading-relaxed text-lg mt-auto">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
