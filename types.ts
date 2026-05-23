import { LucideIcon } from 'lucide-react';

export type ViewState = 'home' | 'services' | 'about' | 'why-us' | 'ai-audit' | 'privacy' | 'terms';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  colSpan?: string;
}

export interface PricingTier {
  name: string;
  price?: string;
  description: string;
  features: string[];
  recommended?: boolean;
  ctaLabel: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  options?: { label: string; action: string }[];
}
