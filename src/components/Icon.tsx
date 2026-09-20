
import React from 'react';

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Heart,
  Info,
  PawPrint,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Wifi,
  WifiOff,
  X,
  House,
  RotateCw,
  CircleDot,
} from 'lucide-react-native';

import { theme } from '../theme/theme';

import type { LucideIcon } from 'lucide-react-native';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
};

const iconMap: Record<string, LucideIcon> = {
  paw: PawPrint,
  heart: Heart,
  heartOutline: Heart,
  search: Search,
  filter: SlidersHorizontal,
  back: ChevronLeft,
  wifi: Wifi,
  offline: WifiOff,
  settings: Settings,
  sync: RefreshCw,
  home: House,
  close: X,
  chevron: ChevronRight,
  star: Star,
  info: Info,
  refresh: RotateCw,
  check: Check,
  cloud: Cloud,
};

export function Icon({
  name,
  size = 22,
  color = theme.colors.text,
  strokeWidth = 2,
  filled = false,
}: IconProps) {
  const IconComponent = iconMap[name] ?? CircleDot;

  const shouldFill =
    filled || name === 'heartFilled';

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      fill={shouldFill ? color : 'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
