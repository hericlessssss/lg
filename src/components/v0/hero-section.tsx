'use client';

import { Shield, Swords } from 'lucide-react';
import { GlassButton } from './glass-button';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 text-center bg-[url('/wallpaper.jpg')] bg-cover bg-center bg-no-repeat">
      {/* 1. Overlay de Escurecimento: bg-black/60 aplica 60% de opacidade preta */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* 2. Container do conteúdo com z-10 para ficar acima do overlay */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Decorative top ornament */}
        <div className="absolute -top-32 flex items-center gap-3 opacity-60 animate-fade-in-up">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37] sm:w-24" />
          <Shield className="h-5 w-5 text-[#d4af37]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37] sm:w-24" />
        </div>

        {/* Swords icon */}
        <div className="animate-fade-in-up">
          <Swords className="h-12 w-12 text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] sm:h-16 sm:w-16" />
        </div>

        {/* Title */}
        <div className="animate-fade-in-up-delay">
          <h1 className="font-medieval text-5xl tracking-wide text-[#f5e6c8] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] sm:text-7xl md:text-8xl lg:text-9xl">
            A sua{' '}
            <span className="text-[#d4af37] drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]">
              EXIVA
            </span>{' '}
            virtual
          </h1>
          <p className="mt-4 font-sans text-base text-[#c4b08a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-lg md:text-xl">
            Tudo o que você precisa saber sobre aquele determinado char
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 animate-fade-in-up-delay">
          <div className="h-px w-12 bg-[#d4af37]/40 sm:w-20" />
          <div className="h-2 w-2 rotate-45 border border-[#d4af37]/60 bg-[#d4af37]/20" />
          <div className="h-px w-12 bg-[#d4af37]/40 sm:w-20" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 animate-fade-in-up-delay-2 sm:flex-row sm:gap-6">
          <GlassButton variant="primary">Login</GlassButton>
          <GlassButton variant="secondary">Cadastrar</GlassButton>
        </div>
      </div>

      {/* Bottom ornament (também com z-10 para não sumir atrás do overlay) */}
      <div className="absolute bottom-8 z-10 flex items-center gap-3 opacity-40 animate-shimmer">
        <div className="h-px w-10 bg-[#d4af37]/30 sm:w-16" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37]/50" />
        <div className="h-px w-10 bg-[#d4af37]/30 sm:w-16" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37]/50" />
        <div className="h-px w-10 bg-[#d4af37]/30 sm:w-16" />
      </div>
    </section>
  );
}
