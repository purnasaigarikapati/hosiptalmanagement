import { ThemeColor, ThemeOption } from '../types/health';

export const THEMES: ThemeOption[] = [
  {
    id: 'cyan',
    name: 'Cyber Turquoise',
    description: 'Futuristic high-tech clinical intelligence (Default)',
    primaryColor: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.45)',
    previewClass: 'from-cyan-400 to-teal-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400'
  },
  {
    id: 'emerald',
    name: 'Emerald Care',
    description: 'Soothing natural mint & restorative cellular wellness',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    previewClass: 'from-emerald-400 to-teal-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400'
  },
  {
    id: 'sapphire',
    name: 'Royal Sapphire',
    description: 'Trusted deep oceanic blue & institutional clinical clarity',
    primaryColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    previewClass: 'from-blue-400 to-indigo-400',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Vitality',
    description: 'Modern violet & cognitive neural intelligence',
    primaryColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    previewClass: 'from-purple-400 to-fuchsia-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-400'
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    description: 'Warm circadian comfort & gentle eye relief for evening review',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    previewClass: 'from-amber-400 to-orange-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400'
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    description: 'Compassionate cardiac rose & human-centric care',
    primaryColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    previewClass: 'from-rose-400 to-pink-400',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400'
  }
];

export const getThemeConfig = (theme: ThemeColor): ThemeOption => {
  return THEMES.find(t => t.id === theme) || THEMES[0];
};
