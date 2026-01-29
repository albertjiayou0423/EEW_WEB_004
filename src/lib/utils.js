import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getJMAIntensityColor(intensity) {
  if (!intensity) return '#9ca3af'; // gray-400
  const i = intensity.toString();
  if (i.includes('7')) return '#4c0041'; // Purple
  if (i.includes('6+')) return '#b500fa';
  if (i.includes('6-')) return '#a50021';
  if (i.includes('5+')) return '#ff2800';
  if (i.includes('5-')) return '#ff9900';
  if (i.includes('4')) return '#fae600';
  if (i.includes('3')) return '#0041ff';
  if (i.includes('2')) return '#00aaff';
  if (i.includes('1')) return '#f2f2f2';
  return '#9ca3af';
}

export function getJMAIntensityTailwind(intensity) {
  if (!intensity) return 'bg-gray-400';
  const i = intensity.toString();
  if (i.includes('7')) return 'bg-[#4c0041]';
  if (i.includes('6+')) return 'bg-[#b500fa]';
  if (i.includes('6-')) return 'bg-[#a50021]';
  if (i.includes('5+')) return 'bg-[#ff2800]';
  if (i.includes('5-')) return 'bg-[#ff9900]';
  if (i.includes('4')) return 'bg-[#fae600] text-black';
  if (i.includes('3')) return 'bg-[#0041ff]';
  if (i.includes('2')) return 'bg-[#00aaff]';
  if (i.includes('1')) return 'bg-[#f2f2f2] text-black';
  return 'bg-gray-400';
}
