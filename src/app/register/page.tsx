"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) throw signUpError;
      router.push("/checkout");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-cocoa">
      <Navbar />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/eco_botanical_ritual.png"
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/60 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Floating Glass Card */}
      <div className="relative z-10 w-full max-w-[32rem] px-6 mt-24 mb-12">
        <div className="bg-ivory/95 backdrop-blur-2xl p-10 md:p-14 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/20">
          
          <div className="text-center mb-10">
            <h1 className="font-cormorant text-5xl md:text-6xl text-cocoa leading-tight mb-3">
              Join Us
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-terracotta">
              Embrace The Ritual
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/10 border border-red-900/20 text-red-900 text-xs text-center rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label 
                  htmlFor="name"
                  className="block text-[0.65rem] uppercase tracking-widest font-semibold text-cocoa/70 mb-2 ml-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  id="name"
                  className="w-full bg-white/50 border border-cocoa/10 rounded-2xl px-5 py-4 text-cocoa focus:outline-none focus:border-terracotta/60 focus:bg-white/80 focus:ring-4 focus:ring-terracotta/10 transition-all text-sm shadow-inner"
                  placeholder="e.g. Abena Osei"
                  style={{ WebkitBoxShadow: "0 0 0 30px rgba(255,255,255,0.5) inset" }}
                />
              </div>

              <div>
                <label 
                  htmlFor="email"
                  className="block text-[0.65rem] uppercase tracking-widest font-semibold text-cocoa/70 mb-2 ml-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="email"
                  className="w-full bg-white/50 border border-cocoa/10 rounded-2xl px-5 py-4 text-cocoa focus:outline-none focus:border-terracotta/60 focus:bg-white/80 focus:ring-4 focus:ring-terracotta/10 transition-all text-sm shadow-inner"
                  placeholder="Enter your email"
                  style={{ WebkitBoxShadow: "0 0 0 30px rgba(255,255,255,0.5) inset" }}
                />
              </div>

              <div>
                <label 
                  htmlFor="password"
                  className="block text-[0.65rem] uppercase tracking-widest font-semibold text-cocoa/70 mb-2 ml-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  id="password"
                  className="w-full bg-white/50 border border-cocoa/10 rounded-2xl px-5 py-4 text-cocoa focus:outline-none focus:border-terracotta/60 focus:bg-white/80 focus:ring-4 focus:ring-terracotta/10 transition-all text-sm shadow-inner"
                  placeholder="Create a password"
                  style={{ WebkitBoxShadow: "0 0 0 30px rgba(255,255,255,0.5) inset" }}
                />
                <p className="text-[0.6rem] uppercase tracking-widest font-semibold text-cocoa/40 mt-2 ml-1">
                  Min 6 Characters
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-cocoa text-ivory rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-terracotta disabled:opacity-50 transition-all duration-300 mt-10 shadow-xl shadow-cocoa/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-cocoa/10 pt-8">
            <p className="text-[0.7rem] uppercase tracking-widest font-semibold text-cocoa/60">
              Already have an account?{" "}
              <Link href="/login" className="text-terracotta hover:text-cocoa transition-colors underline underline-offset-4 decoration-terracotta/30 ml-1">
                Sign In
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}
