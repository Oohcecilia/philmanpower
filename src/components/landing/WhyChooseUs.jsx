import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, Search, Languages, FileCheck, TrendingUp, LifeBuoy, Heart, ChefHat } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const icons = [Users, Search, Languages, FileCheck, TrendingUp, LifeBuoy];

export default function WhyChooseUs() {
    const { t } = useTranslation();

    const advantages = Array.from({ length: 6 }, (_, i) => ({
        icon: icons[i],
        title: t(`whyChooseUs.point${i + 1}Title`),
        desc: t(`whyChooseUs.point${i + 1}Desc`),
    }));

    const trainingCenters = [
        {
            name: t("trainingPartners.center1Name"),
            specialization: t("trainingPartners.center1Specialization"),
            icon: Heart,
            image: "/training_centers/Athena.webp",
            link: "https://anctrainingcenter.com/"
        },
        {
            name: t("trainingPartners.center2Name"),
            specialization: t("trainingPartners.center2Specialization"),
            icon: ChefHat,
            image: "/training_centers/Lechef.webp",
            link: "https://lechef.institute/"
        },
        {
            name: t("trainingPartners.center3Name"),
            specialization: t("trainingPartners.center3Specialization"),
            icon: Languages,
            image: "/training_centers/Intermed.png",
            link: "https://intermed.institute/"
        },
    ];

    return (
        <section id="why-us" className="py-24 lg:py-32 bg-navy relative overflow-hidden">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, #C5A059 1px, transparent 0)",
                    backgroundSize: "48px 48px"
                }}
            />

            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                {/* ─────────────────────────────────────── */}
                {/*  Advantages heading                     */}
                {/* ─────────────────────────────────────── */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <ScrollReveal>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold/90 mb-4">
                            <span className="w-8 h-px bg-gold/50" />
                            {t("whyChooseUs.label")}
                        </span>
                        <h2 className="font-heading font-semibold text-white text-3xl sm:text-4xl leading-tight mb-4">
                            {t("whyChooseUs.title")}
                        </h2>
                        <p className="text-white/50 leading-relaxed">
                            {t("whyChooseUs.subtitle")}
                        </p>
                    </ScrollReveal>
                </div>

                {/* ─────────────────────────────────────── */}
                {/*  Advantages grid                        */}
                {/* ─────────────────────────────────────── */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 lg:mb-28">
                    {advantages.map((a, i) => (
                        <ScrollReveal key={a.title} delay={i * 0.08}>
                            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.07] transition-all duration-500 h-full">
                                <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                                    <a.icon size={20} className="text-gold" strokeWidth={1.8} />
                                </div>
                                <h3 className="font-heading font-semibold text-white text-lg mb-2">
                                    {a.title}
                                </h3>
                                <p className="text-sm text-white/45 leading-relaxed">{a.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* ─────────────────────────────────────── */}
                {/*  Divider                                */}
                {/* ─────────────────────────────────────── */}
                <div className="flex items-center gap-6 mb-16 lg:mb-20 max-w-4xl mx-auto">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    {/* <span className="font-heading text-2xl sm:text-3xl text-gold/30 font-semibold tracking-widest">✦</span> */}
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* ─────────────────────────────────────── */}
                {/*  Key advantage: preparation content     */}
                {/* ─────────────────────────────────────── */}
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <ScrollReveal>
                        <h2 className="font-heading font-semibold text-white text-3xl sm:text-4xl leading-tight mb-6">
                            {t("whyChooseUs.preparationTitle")}
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal delay={0.08}>
                        <p className="text-white/50 leading-relaxed mb-4">
                            {t("whyChooseUs.preparationPara1")} &nbsp;
                            {t("whyChooseUs.preparationPara2")} &nbsp;
                            {t("whyChooseUs.preparationPara3")} &nbsp;
                            {t("whyChooseUs.preparationPara4")}
                        </p>

                    </ScrollReveal>
                </div>



                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-10">
                    {trainingCenters.map((center, i) => (
                        <ScrollReveal key={center.name} delay={i * 0.12}>
                            <a
                                href={center.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${center.name}`}
                                className="block"
                            >
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className="
                group
                relative
                flex
                flex-col
                items-center
                text-center
                p-6
                rounded-3xl

                bg-white/[0.06]
                backdrop-blur-xl
                border
                border-white/10

                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]

                hover:border-gold/20
                cursor-pointer

                overflow-hidden
                transition-all
                duration-500
            "
                                >
                                    {/* Glass highlight */}
                                    <div
                                        className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/10
                    via-white/[0.03]
                    to-transparent
                    pointer-events-none
                "
                                    />

                                    {/* Gold ambient glow */}
                                    <div
                                        className="
                    absolute
                    -top-10
                    left-1/2
                    -translate-x-1/2
                    w-32
                    h-32
                    bg-gold/10
                    blur-3xl
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-700
                "
                                    />

                                    {/* Image */}
                                    <div className="relative mb-5 z-10">
                                        <img
                                            src={center.image}
                                            alt={center.name}
                                            className="
                        h-14
                        w-auto
                        object-contain
                        transition-all
                        duration-500
                        group-hover:scale-105
                        group-hover:opacity-90
                    "
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3 z-10">
                                        <div
                                            className="
                        text-sm
                        font-heading
                        font-semibold
                        text-white
                        whitespace-nowrap
                        overflow-hidden
                        text-ellipsis
                        max-w-[220px]
                    "
                                            title={center.name}
                                        >
                                            {center.name}
                                        </div>

                                        <div
                                            className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full

                        bg-gold/10
                        border
                        border-gold/20

                        text-[10px]
                        font-semibold
                        tracking-[0.18em]
                        uppercase
                        text-gold
                    "
                                        >
                                            <center.icon size={12} strokeWidth={2} />
                                            <span>{center.specialization}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </a>
                        </ScrollReveal>
                    ))}
                </div>



            </div>
        </section>
    );
}
