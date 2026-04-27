"use client";

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  label?: string;
}

export function QRCodeDisplay({ url, size = 160, label }: QRCodeDisplayProps) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=3F4F36&bgcolor=FFFDF8`;
  return (
    <div className="flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg border border-gray-100"
      />
      {label && <p className="text-xs text-gray-500 text-center max-w-[160px] truncate">{label}</p>}
    </div>
  );
}
