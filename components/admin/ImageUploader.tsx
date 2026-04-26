"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Link, X, ImageOff } from "lucide-react";
import { validateImageFile } from "@/lib/image";
import { isValidUrl } from "@/lib/image";
import { LoadingSpinner } from "./LoadingState";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [urlInput, setUrlInput] = useState(value ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function applyUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) { onChange(""); return; }
    if (!isValidUrl(trimmed)) { setError("URL inválida. Use http:// ou https://"); return; }
    setError("");
    onChange(trimmed);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.ok) { setError(validation.error); return; }
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { error?: string; url?: string };
      if (!res.ok) throw new Error(data.error || "Upload falhou");
      onChange(data.url ?? "");
    } catch (err) {
      setError(String(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {value ? (
          <>
            <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" referrerPolicy="no-referrer" />
            <button
              type="button"
              onClick={() => { onChange(""); setUrlInput(""); }}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
              aria-label="Remover imagem"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
        {(["url", "file"] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors ${
              mode === m ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {m === "url" ? <Link className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
            {m === "url" ? "URL" : "Upload"}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === "url" ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && applyUrl()}
            placeholder="https://exemplo.com/imagem.jpg"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-3 py-2 bg-olive-700 text-white text-sm rounded-lg hover:bg-olive-700/90 transition-colors whitespace-nowrap"
          >
            Aplicar
          </button>
        </div>
      ) : (
        <>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-olive-500 hover:text-olive-700 transition-colors disabled:opacity-50"
          >
            {uploading ? <LoadingSpinner size={16} /> : <Upload className="w-4 h-4" />}
            {uploading ? "Enviando..." : "Selecionar arquivo"}
          </button>
        </>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
