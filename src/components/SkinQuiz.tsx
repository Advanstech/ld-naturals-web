"use client";

import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, Loader2, Check } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description: string }[];
  image: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "skinType",
    question: "How does your skin feel most of the time?",
    image: "/eco_the_source.png",
    options: [
      { value: "dry", label: "Dry & Tight", description: "Flaky, rough patches, or lacks moisture" },
      { value: "oily", label: "Oily & Shiny", description: "Excess sebum, visible pores, prone to breakouts" },
      { value: "combination", label: "Combination", description: "Oily in the T-zone, dry or normal on cheeks" },
      { value: "sensitive", label: "Sensitive", description: "Prone to redness, itching, or irritation" },
    ],
  },
  {
    id: "concern",
    question: "What is your primary skin concern?",
    image: "/eco_sensitive_skin.png",
    options: [
      { value: "acne", label: "Acne & Blemishes", description: "Frequent breakouts, blackheads, or clogged pores" },
      { value: "hyperpigmentation", label: "Hyperpigmentation", description: "Dark spots, uneven skin tone, or acne scars" },
      { value: "dullness", label: "Dullness & Dryness", description: "Lacks a healthy glow, feels dehydrated" },
      { value: "aging", label: "Fine Lines & Aging", description: "Loss of elasticity, fine lines, or wrinkles" },
    ],
  },
  {
    id: "scentPreference",
    question: "Do you prefer scented or fragrance-free products?",
    image: "/eco_botanical_ritual.png",
    options: [
      { value: "scented", label: "Signature Scented", description: "Enriched with therapeutic-grade natural essential oils" },
      { value: "unscented", label: "Fragrance-Free", description: "Perfect for ultra-sensitive skin or eczema" },
    ],
  },
];

export default function SkinQuiz() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    product: string;
    reason: string;
    routine: string[];
    image: string;
  } | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [step, recommendation]);

  const form = useForm({
    defaultValues: {
      skinType: "",
      concern: "",
      scentPreference: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const isScented = value.scentPreference === "scented";
        let product = "Cocoa Butter Black Soap (Scented)";
        let image = "/scented-box.jpeg";
        let reason = "";
        let routine = [];

        if (!isScented) {
          product = "Cocoa Butter Black Soap (Unscented)";
          image = "/unscented.jpeg";
        }

        if (value.skinType === "dry" || value.skinType === "sensitive") {
          reason = `Since your skin is ${value.skinType} and you are concerned about ${value.concern}, we highly recommend our premium, ultra-moisturizing cocoa butter black soap. It's packed with natural fats from raw Ghanaian cocoa butter to lock in deep hydration without stripping away your natural oils.`;
          routine = [
            "Lather the soap in wet hands or on a washcloth.",
            "Massage gently onto damp skin in circular motions.",
            "Rinse thoroughly with lukewarm water.",
            "Follow up with raw shea butter to lock in moisture."
          ];
        } else {
          reason = `With an ${value.skinType} skin type and a focus on ${value.concern}, our Cocoa Butter Black Soap acts as an excellent clarifier. The traditional African black soap base purifies and deep-cleanses pores, while the high percentage of raw cocoa butter ensures your skin is replenished with essential fatty acids so it doesn't overproduce sebum.`;
          routine = [
            "Cleanse daily (preferably in the evening).",
            "Work into a rich lather.",
            "Leave on skin for 30-60 seconds for a clarifying treatment.",
            "Rinse and follow with a lightweight hydrating serum."
          ];
        }

        setRecommendation({ product, reason, routine, image });
      } catch (error) {
        console.error("Quiz submission failed", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const nextStep = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      form.handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const resetQuiz = () => {
    form.reset();
    setStep(0);
    setRecommendation(null);
  };

  const currentQuestion = QUESTIONS[step];

  return (
    <div className="h-screen bg-ivory text-cocoa pt-28 pb-8 px-4 md:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row bg-white/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-cocoa/10 shadow-[0_30px_80px_rgba(62,40,27,0.08)] h-[calc(100vh-10rem)] max-h-[800px]">
        
        {/* Left Side: Dynamic Image Area */}
        <div className="relative hidden lg:block lg:w-[45%] h-full bg-cocoa overflow-hidden">
          {!recommendation ? (
            <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
              <Image
                key={currentQuestion.image}
                src={currentQuestion.image}
                alt="Quiz visualization"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-90 transition-transform duration-[10000ms] scale-110 ease-linear hover:scale-100"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d06]/80 via-[#3e281b]/30 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute bottom-10 left-10 right-10 text-ivory">
                <p className="text-xs uppercase tracking-[0.3em] font-semibold text-gold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Step {step + 1} of {QUESTIONS.length}
                </p>
                <h3 className="font-cormorant text-4xl italic leading-none">Find Your Ritual</h3>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 transition-opacity duration-700 ease-in-out bg-cocoa">
              <Image
                src={recommendation.image}
                alt={recommendation.product}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-70 transition-transform duration-[10000ms] scale-110 ease-linear"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d06]/95 via-[#3e281b]/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-ivory p-10">
                <div className="inline-flex p-4 bg-gold/20 backdrop-blur-md rounded-full mb-6 border border-gold/30">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-cormorant text-5xl italic">Your Match</h3>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-12 md:py-8 lg:px-16 flex flex-col justify-center bg-white/60 scrollbar-hide">
          <div ref={contentRef} className="w-full max-w-xl mx-auto my-auto">
            {!recommendation ? (
              <div className="w-full">
                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className="flex-1 h-1 bg-cocoa/10 rounded-full overflow-hidden relative">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-terracotta transition-all duration-700 ease-out origin-left ${i <= step ? 'w-full' : 'w-0'}`} 
                      />
                    </div>
                  ))}
                </div>

                <h2 className="font-cormorant text-3xl md:text-4xl mb-6 leading-tight">
                  {currentQuestion.question}
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextStep();
                  }}
                  className="space-y-3"
                >
                  <form.Field name={currentQuestion.id as "skinType" | "concern" | "scentPreference"}>
                    {(field) => (
                      <div className="grid grid-cols-1 gap-3">
                        {currentQuestion.options.map((opt) => {
                          const isSelected = field.state.value === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.handleChange(opt.value)}
                              className={`group relative w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                                isSelected
                                  ? "bg-cocoa text-ivory border-cocoa shadow-lg shadow-cocoa/10 scale-[1.01]"
                                  : "bg-white border-cocoa/10 hover:border-terracotta/40 hover:shadow-sm hover:bg-white/80"
                              }`}
                            >
                              <div className="relative z-10 flex flex-col gap-1">
                                <span className="font-semibold tracking-wide text-base">{opt.label}</span>
                                <span className={`text-[0.75rem] leading-snug ${isSelected ? "text-ivory/80" : "text-cocoa/60"}`}>
                                  {opt.description}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-gold text-cocoa">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </form.Field>

                  <div className="flex justify-between items-center pt-6 mt-4 border-t border-cocoa/10">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 0 || isLoading}
                      className={`flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold transition-all ${
                        step === 0 ? "opacity-0 pointer-events-none" : "opacity-60 hover:opacity-100 hover:-translate-x-1 text-cocoa"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isLoading || !form.getFieldValue(currentQuestion.id as "skinType" | "concern" | "scentPreference")}
                      className="group flex items-center gap-2 px-6 py-3 bg-cocoa text-ivory rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-terracotta disabled:opacity-40 disabled:hover:bg-cocoa transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                        </>
                      ) : step === QUESTIONS.length - 1 ? (
                        <>
                          Reveal Result <Sparkles className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
                        </>
                      ) : (
                        <>
                          Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] font-semibold text-terracotta mb-2">
                  Curated For You
                </p>
                <h2 className="font-cormorant text-3xl md:text-4xl mb-6 leading-tight">
                  {recommendation.product}
                </h2>

                <div className="space-y-6">
                  <div className="bg-[#f0e7d2]/80 rounded-xl p-5 border border-cocoa/5 shadow-inner">
                    <h4 className="text-[0.65rem] uppercase tracking-widest font-semibold mb-2 text-terracotta flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Why it works
                    </h4>
                    <p className="text-sm leading-6 text-cocoa/80">
                      {recommendation.reason}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[0.65rem] uppercase tracking-widest font-semibold mb-3 text-cocoa/70 border-b border-cocoa/10 pb-2">Your Daily Ritual</h4>
                    <ul className="space-y-2">
                      {recommendation.routine.map((step, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cocoa text-gold flex items-center justify-center text-[0.65rem] font-semibold">
                            {i + 1}
                          </span>
                          <span className="text-[0.8rem] leading-snug text-cocoa/80 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cocoa/10">
                    <a href="/checkout" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cocoa text-ivory rounded-full text-[0.65rem] uppercase tracking-widest font-semibold hover:bg-terracotta transition-all shadow-lg shadow-cocoa/20">
                      Get Yours <span className="text-gold">— GH₵ 120</span>
                    </a>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 border border-cocoa/20 rounded-full text-[0.65rem] uppercase tracking-widest font-semibold hover:bg-cocoa hover:text-ivory transition-all text-cocoa flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
