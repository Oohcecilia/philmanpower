import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";
import AnnouncementBanner from "./AnnouncementBanner";


const HERO_NURSE = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/871f86779_generated_683459d7.png";
const HERO_CHEF = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/09e951527_generated_5b96b38c.png";
const HERO_ENGINEER = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/c4d133345_generated_cd86cbdd.png";



export default function HeroSection() {
    const { t } = useTranslation();
    const [isScattered, setIsScattered] = useState(false);


    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-32 pb-16 lg:pt-32 lg:pb-24">
            {/* 1. Base Layer */}
            <div className="absolute inset-0 bg-white pointer-events-none z-0" />

            {/* 2. Premium High-End Office/Recruitment Image Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2069&q=80"
                    alt="Modern corporate office background"
                    className="w-full h-full object-cover opacity-20 blur-[3px] mix-blend-luminosity scale-105"
                />
                {/* Gradient masks to guarantee text readability while revealing the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-slate-50/95" />
            </div>

            {/* 3. Enhanced Ambient Gradients & Glows */}
            <div className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full bg-gold/15 blur-[120px] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-navy/10 blur-[100px] pointer-events-none z-0 mix-blend-multiply" />

            {/* 4. Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, #0A192F 1px, transparent 0)",
                    backgroundSize: "40px 40px"
                }}
            />

            <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-140px)]">
                    {/* Left content - 7 cols */}
                    <div className="lg:col-span-7 z-10">
                        <ScrollReveal>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-mist/50 text-xs font-semibold tracking-wide uppercase text-deep-ochre mb-8 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                                {t("hero.badge")}
                            </span>
                        </ScrollReveal>

                        <ScrollReveal delay={0.1}>
                            <h1 className="font-heading font-semibold text-navy text-4xl sm:text-5xl lg:text-6xl xl:text-[3.75rem] leading-[1.1] tracking-tight text-balance mb-6">
                                {t("hero.title")}{" "}
                                <span className="text-gold relative inline-block">
                                    {t("hero.titleHealthcare")}
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-gold/10 -z-10 rounded-sm" />
                                </span> &{" "}
                                <span className="text-gold relative inline-block">
                                    {t("hero.titleIndustry")}
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-gold/10 -z-10 rounded-sm" />
                                </span>
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <p className="text-lg text-navy/70 max-w-xl leading-relaxed mb-10 font-medium">
                                {t("hero.subtitle")}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.3}>
                            <div className="flex flex-wrap items-center gap-4">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-navy text-white font-semibold text-base hover:bg-navy/90 hover:shadow-[0_8px_30px_rgba(10,25,47,0.3)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_20px_rgba(10,25,47,0.15)]"
                                >
                                    {t("hero.cta")}
                                    <ArrowRight size={18} />
                                </a>
                                <a
                                    href="#about"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-navy/15 text-navy font-semibold text-base hover:border-navy/30 hover:bg-white/80 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                >
                                    {t("hero.learnMore")}
                                </a>
                            </div>
                        </ScrollReveal>

                        {/* Quick stats */}
                        <ScrollReveal delay={0.4}>
                            <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-navy/10">
                                {[
                                    { num: "450+", label: t("hero.stat1") },
                                    { num: "3", label: t("hero.stat2") },
                                    { num: "98%", label: t("hero.stat3") },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <div className="font-heading text-3xl font-bold text-navy">
                                            {s.num}
                                        </div>
                                        <div className="text-sm font-medium text-navy/60 mt-1 uppercase tracking-wider">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>

                
                    <div className="lg:col-span-5 relative">
                        <div
                            className="relative w-full max-w-md mx-auto lg:max-w-none cursor-pointer"
                            onClick={() => setIsScattered(!isScattered)}
                            title="Click to interact"
                        >
                            {/* Background frame */}
                            <motion.div
                                initial={{ opacity: 0, x: 40, y: 20 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute top-8 -right-2 w-[65%] aspect-[3/4] z-0"
                            >
                                <motion.div
                                    animate={{
                                        x: isScattered ? 25 : 0,
                                        y: isScattered ? -125 : 0,
                                        rotate: isScattered ? 6 : 0,
                                        scale: isScattered ? 1.03 : 1,
                                        boxShadow: isScattered
                                            ? "0px 30px 60px rgba(10, 25, 47, 0.25)"
                                            : "0px 20px 50px rgba(10, 25, 47, 0.12)"
                                    }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full rounded-2xl overflow-hidden border border-white/50 bg-white"
                                >
                                    <img src={HERO_ENGINEER} alt={t("hero.altEngineer")} className="w-full h-full object-cover" />
                                </motion.div>
                            </motion.div>

                            {/* Middle frame */}
                            <motion.div
                                initial={{ opacity: 0, x: -20, y: 30 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="relative w-[60%] aspect-[3/4] z-10 mt-12"
                            >
                                <motion.div
                                    animate={{
                                        x: isScattered ? -30 : 0,
                                        y: isScattered ? 15 : 0,
                                        rotate: isScattered ? -5 : 0,
                                        scale: isScattered ? 1.03 : 1,
                                        boxShadow: isScattered
                                            ? "0px 35px 65px rgba(10, 25, 47, 0.25)"
                                            : "0px 25px 60px rgba(10, 25, 47, 0.15)"
                                    }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full rounded-2xl overflow-hidden border border-white/60 bg-white"
                                >
                                    <img src={HERO_NURSE} alt={t("hero.altNurse")} className="w-full h-full object-cover" />
                                </motion.div>
                            </motion.div>

                            {/* Front frame */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="absolute bottom-0 right-4 w-[50%] aspect-[3/4] z-20"
                            >
                                <motion.div
                                    animate={{
                                        x: isScattered ? 20 : 0,
                                        y: isScattered ? 25 : 0,
                                        rotate: isScattered ? 4 : 0,
                                        scale: isScattered ? 1.05 : 1,
                                        boxShadow: isScattered
                                            ? "0px 40px 80px rgba(10, 25, 47, 0.3)"
                                            : "0px 20px 50px rgba(10, 25, 47, 0.18)"
                                    }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full rounded-2xl overflow-hidden border-4 border-white bg-white"
                                >
                                    <img src={HERO_CHEF} alt={t("hero.altChef")} className="w-full h-full object-cover" />
                                </motion.div>
                            </motion.div>

                            {/* Gold accent circle */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gold/20 blur-xl z-0 pointer-events-none" />
                            <div className="absolute -bottom-6 right-12 w-16 h-16 rounded-full bg-gold/20 blur-lg z-0 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Mobile announcement */}
                <div className="lg:hidden mt-10 relative z-30">
                    <AnnouncementBanner overlay />
                </div>
            </div>

            {/* Desktop announcement overlay */}
            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 hidden lg:block max-w-sm">
                <AnnouncementBanner overlay />
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-navy/40 z-20"
            >
                <span className="text-xs font-semibold tracking-widest uppercase">{t("hero.scroll")}</span>
                <ChevronDown size={16} />
            </motion.div>
        </section>
    );
}

