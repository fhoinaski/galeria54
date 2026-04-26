export function Footer() {
  return (
    <footer className="bg-olive-700 text-warm-white/60 py-8 px-4 text-center mt-12 border-t border-olive-500/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-xl text-warm-white font-bold mb-4 tracking-widest">CAFFÈ 54</h2>
        <p className="text-sm mb-6 max-w-xs leading-relaxed">
          Sabor em detalhes, café de verdade.
        </p>
        <div className="text-xs space-y-2">
          <p>© {new Date().getFullYear()} Caffè 54. Todos os direitos reservados.</p>
          <p className="text-warm-white/40">Powered by AI Studio</p>
        </div>
      </div>
    </footer>
  );
}
