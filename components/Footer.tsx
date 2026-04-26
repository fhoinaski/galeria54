export function Footer() {
  return (
    <footer className="bg-olive-700 text-warm-white/60 py-10 px-4 text-center mt-4 border-t border-olive-500/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <div className="font-serif text-[22px] text-warm-white tracking-[0.14em]">
          <span className="italic">Caffè</span>
          <span className="ml-1.5 font-semibold not-italic">54</span>
        </div>
        <p className="text-[13px] text-warm-white/50 max-w-xs leading-relaxed">
          Alma europeia. Coração praiano.
        </p>
        <div className="w-12 h-px bg-warm-white/20" />
        <div className="text-[11px] space-y-1 text-warm-white/35">
          <p>© {new Date().getFullYear()} Caffè 54. Todos os direitos reservados.</p>
          <p>Florianópolis, Santa Catarina.</p>
        </div>
      </div>
    </footer>
  );
}
