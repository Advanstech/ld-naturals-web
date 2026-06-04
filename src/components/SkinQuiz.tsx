"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description: string }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "skinType",
    question: "How does your skin feel most of the time?",
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

  const form = useForm({
    defaultValues: {
      skinType: "",
      concern: "",
      scentPreference: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        // AI skin quiz recommendation logic (we'll implement a fallback/Claude-inspired simulation first)
        // In the real system, this will hit our NestJS Claude API endpoint.
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const isScented = value.scentPreference === "scented";
        
        let product = "Cocoa Butter Black Soap - Scented";
        let image = "/product-scented.jpeg";
        let reason = "";
        let routine = [];

        if (!isScented) {
          product = "Cocoa Butter Black Soap (Unscented)";
          image = "/product-unscented.jpeg";
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

        setRecommendation({
          product,
          reason,
          routine,
          image
        });
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
    <div className="min-h-screen bg-ivory text-cocoa py-24 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-6 bg-white/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cocoa/10 shadow-xl">
        {!recommendation ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs uppercase tracking-widest font-semibold opacity-60">
                AI Skin Quiz — Step {step + 1} of {QUESTIONS.length}
              </span>
              <div className="flex gap-1 h-1.5 w-24 bg-cocoa/10 rounded-full overflow-hidden">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-colors duration-300 ${
                      i <= step ? "bg-cocoa" : "bg-cocoa/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h2 className="font-cormorant text-3xl md:text-5xl mb-8 leading-tight">
              {currentQuestion.question}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextStep();
              }}
              className="space-y-4 mb-8"
            >
              <form.Field name={currentQuestion.id as "skinType" | "concern" | "scentPreference"}>
                {(field) => (
                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = field.state.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.handleChange(opt.value)}
                          className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex flex-col gap-1 ${
                            isSelected
                              ? "bg-cocoa text-ivory border-cocoa shadow-md"
                              : "bg-white/50 border-cocoa/10 hover:border-cocoa/30 hover:bg-white/80"
                          }`}
                        >
                          <span className="font-semibold tracking-wider text-base">{opt.label}</span>
                          <span className={`text-xs ${isSelected ? "text-ivory/70" : "text-cocoa/60"}`}>
                            {opt.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </form.Field>

              <div className="flex justify-between items-center pt-8 border-t border-cocoa/10 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 0 || isLoading}
                  className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold opacity-70 hover:opacity-100 disabled:opacity-20 transition-opacity"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || !form.getFieldValue(currentQuestion.id as "skinType" | "concern" | "scentPreference")}
                  className="flex items-center gap-2 px-8 py-3 bg-cocoa text-ivory rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-cocoa transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing
                    </>
                  ) : step === QUESTIONS.length - 1 ? (
                    <>
                      Get Result <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex p-3 bg-cocoa/5 rounded-full mb-6">
              <Sparkles className="w-6 h-6 text-terracotta" />
            </div>
            
            <h2 className="font-cormorant text-4xl md:text-5xl mb-2 italic">
              Your AI Recommendation
            </h2>
            <p className="text-sm uppercase tracking-widest font-semibold opacity-60 mb-8">
              Based on your unique skin profile
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left mb-8 bg-white/30 rounded-xl p-6 border border-cocoa/5">
              <div className="relative h-64 w-full">
                <Image
                  src={recommendation.image}
                  alt={recommendation.product}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-cormorant text-2xl font-bold mb-4">
                  {recommendation.product}
                </h3>
                <p className="text-sm leading-relaxed text-cocoa/80 mb-4">
                  {recommendation.reason}
                </p>
                <div className="text-terracotta font-semibold text-lg">
                  GH₵ 45.00
                </div>
              </div>
            </div>

            <div className="text-left bg-white/50 rounded-xl p-6 border border-cocoa/5 mb-8">
              <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">
                Recommended Routine
              </h4>
              <ol className="space-y-3 text-sm text-cocoa/80 list-decimal list-inside">
                {recommendation.routine.map((step, i) => (
                  <li key={i} className="leading-relaxed pl-1">
                    <span className="font-medium text-cocoa">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center gap-2 px-8 py-3 border border-cocoa rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-cocoa/5 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Retake Quiz
              </button>
              <a href="/checkout" className="px-8 py-3 bg-cocoa text-ivory rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-terracotta transition-all shadow-md text-center flex items-center justify-center">
                Buy Recommended Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
