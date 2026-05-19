/**
 * MealCraftView.tsx — Kira Meal Planner
 * Converted from mealcraft.html → fully adapted to Kira app design system
 * Matches SocialMediaView / App.tsx UI tokens, gradients, buttons, sidebar patterns
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  Printer,
  Paperclip,
  Award,
  Eye,
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  LayoutGrid,
  Heart,
  MessageCircle,
  Upload,
  PenTool,
  Bookmark,
  BookOpen,
  Archive,
  Sparkles,
  ChefHat,
  Search,
  Send,
  Mic,
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  Users,
  Flame,
  Dumbbell,
  ArrowRight,
  Trash2,
  Camera,
  Link,
  FileText,
  Filter,
  Target,
  RotateCcw,
  Share2,
} from 'lucide-react'
const FOOD_IMG_1 =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=128&h=128&fit=crop'
const FOOD_IMG_2 =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=128&h=128&fit=crop'

// ─── Kira Design Tokens (matching SocialMediaView) ───────────────────────────
const K = {
  bgSoft: 'rgba(248,250,252,0.8)' as const,

  mainBg: 'url("/MainBG.png") center right / cover no-repeat',
  sidebarBg: 'rgba(238,241,246,0.95)',
  cardBg: 'rgba(255,255,255,0.82)',
  cardBgStrong: 'rgba(255,255,255,0.95)',
  border: 'rgba(17,24,39,0.07)',
  borderMid: 'rgba(17,24,39,0.12)',
  text: '#111827',
  textSub: '#374151',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  btnBlue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  btnBlueShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
  btnViolet: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  btnVioletShadow: 'inset 0 0 0 1px #c4b5fd, inset 0 1px 4px 2px #ede9fe',
  btnGreen: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  gradBrand: 'linear-gradient(135deg, #6c5ce7 0%, #a78bfa 40%, #f582ae 100%)',
  gradSoft:
    'linear-gradient(95deg, rgba(168,185,255,0.35), rgba(200,168,255,0.35) 50%, rgba(245,184,224,0.35) 100%)',
  gradSun: 'linear-gradient(135deg, #ffd29a 0%, #f5a07a 50%, #e87298 100%)',
  gradPrimary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  activeNavBg:
    'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
  primary: '#6c5ce7',
  primarySoft: 'rgba(108,92,231,0.10)',
  accent: '#f582ae',
  accentSoft: 'rgba(245,130,174,0.12)',
  gold: '#f6b352',
  goldSoft: 'rgba(246,179,82,0.16)',
  leaf: '#5bbf85',
  leafSoft: 'rgba(91,191,133,0.15)',
  sky: '#5dade2',
  skySoft: 'rgba(93,173,226,0.15)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const

// ─── GlowBlobs (same as SocialMediaView) ──────────────────────────────────────
const GlowBlobs: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        width: 75,
        height: 75,
        borderRadius: '50%',
        left: 194,
        top: -6,
        background: '#22D3EE',
        opacity: 0.8,
        filter: 'blur(24px)',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: '50%',
        left: 151,
        top: -29,
        background: '#60A5FA',
        opacity: 0.6,
        filter: 'blur(24px)',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: '50%',
        left: 105,
        top: -35,
        background: '#A855F7',
        opacity: 1,
        filter: 'blur(15px)',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 146,
        height: 47,
        borderRadius: '50%',
        left: -87,
        top: 39,
        background: '#A855F7',
        opacity: 1,
        filter: 'blur(15px)',
        pointerEvents: 'none',
      }}
    />
  </>
)

// ─── Shared Primitives ────────────────────────────────────────────────────────
const KCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({ children, style, className, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    className={className}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      background: K.cardBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 20,
      border: `1px solid ${K.border}`,
      ...style,
    }}
  >
    {children}
  </div>
)

const KBtn: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  variant?: 'blue' | 'violet' | 'green' | 'brand' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}> = ({
  children,
  onClick,
  style,
  variant = 'blue',
  size = 'md',
  disabled,
}) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: size === 'lg' ? 14 : 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 14 : 13,
    padding:
      size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 24px' : '10px 20px',
    border: 'none',
    transition: 'opacity 0.15s, transform 0.1s',
    opacity: disabled ? 0.45 : 1,
    fontFamily: "'Outfit', system-ui, sans-serif",
    ...style,
  }
  const variantStyles: Record<string, React.CSSProperties> = {
    blue: { background: K.btnBlue, boxShadow: K.btnBlueShadow, color: '#fff' },
    violet: {
      background: K.btnViolet,
      boxShadow: K.btnVioletShadow,
      color: '#fff',
    },
    green: {
      background: K.btnGreen,
      color: '#fff',
      boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
    },
    brand: {
      background: K.gradBrand,
      color: '#fff',
      boxShadow: '0 6px 18px rgba(108,92,231,0.35)',
    },
    ghost: {
      background: 'rgba(255,255,255,0.7)',
      border: `1px solid ${K.borderMid}`,
      color: K.textSub,
      backdropFilter: 'blur(8px)',
    },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.opacity = disabled
          ? '0.45'
          : '1'
      }}
    >
      {children}
    </button>
  )
}

const KBadge: React.FC<{
  label: string | number
  color?: string
  bg?: string
}> = ({ label, color = K.success, bg }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: bg || `${color}18`,
      border: `1px solid ${color}30`,
    }}
  >
    {label}
  </span>
)

const KProgress: React.FC<{
  value: number
  color?: string
  style?: React.CSSProperties
}> = ({ value, color = K.primary, style }) => (
  <div
    style={{
      background: 'rgba(17,24,39,0.08)',
      borderRadius: 4,
      height: 5,
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        width: `${Math.min(100, value)}%`,
        height: '100%',
        background: color,
        borderRadius: 4,
        transition: 'width 0.4s',
      }}
    />
  </div>
)

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast: React.FC<{ message: string; visible: boolean }> = ({
  message,
  visible,
}) => (
  <div
    style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '100px'})`,
      background: '#0e0a2e',
      color: 'white',
      padding: '12px 22px',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 600,
      boxShadow: '0 16px 40px rgba(34,18,64,0.25)',
      zIndex: 300,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      opacity: visible ? 1 : 0,
      transition:
        'transform 0.3s cubic-bezier(0.18,0.89,0.43,1.19), opacity 0.2s',
      pointerEvents: 'none',
    }}
  >
    <Check size={14} color={K.leaf} strokeWidth={2.5} />
    {message}
  </div>
)

// ─── Modal ────────────────────────────────────────────────────────────────────
const KModal: React.FC<{
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  wide?: boolean
  children: React.ReactNode
}> = ({ open, onClose, title, subtitle, wide, children }) => {
  if (!open) return null
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14,10,46,0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 28,
          maxWidth: wide ? 760 : 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(34,18,64,0.18)',
          animation: 'none',
        }}
      >
        <div
          style={{
            padding: '24px 28px 0',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                margin: 0,
                color: K.text,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: 13,
                  color: K.textMuted,
                  margin: '4px 0 0',
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              width: 32,
              height: 32,
              background: 'rgba(17,24,39,0.06)',
              border: 'none',
              borderRadius: 10,
              color: K.textSub,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: '22px 28px 28px' }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const RECIPES = [
  {
    id: 'r1',
    name: 'Mediterranean Quinoa & Chicken Power Bowl',
    type: 'lunch',
    cal: 540,
    pro: 42,
    crb: 48,
    fat: 18,
    time: 35,
    servings: 2,
    fav: true,
    img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
    ingredients: [
      '1 cup quinoa, rinsed',
      '2 chicken breasts',
      '1 cup cherry tomatoes, halved',
      '1 cucumber, diced',
      '½ cup kalamata olives',
      '100g feta cheese, crumbled',
      '3 tbsp olive oil',
      '2 tbsp lemon juice',
      'Salt and pepper',
      'Fresh parsley',
    ],
    steps: [
      'Cook quinoa in 2 cups salted water until fluffy, about 15 min.',
      'Season chicken with olive oil, salt, pepper. Grill 6 min each side.',
      'Slice chicken. Assemble bowls with quinoa, veggies, olives and feta.',
      'Drizzle with lemon juice and extra olive oil. Garnish with parsley.',
    ],
    rating: 4.9,
    author: 'Marco',
    updated: 'May 10, 2026',
    reviewCount: 248,
  },
  {
    id: 'r2',
    name: 'Avocado Toast with Poached Eggs',
    type: 'breakfast',
    cal: 380,
    pro: 18,
    crb: 32,
    fat: 22,
    time: 15,
    servings: 1,
    fav: false,
    img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80',
    ingredients: [
      '2 slices sourdough',
      '1 ripe avocado',
      '2 eggs',
      '1 tbsp white vinegar',
      'Chili flakes',
      'Lemon juice',
      'Salt and pepper',
    ],
    steps: [
      'Toast sourdough until golden.',
      'Mash avocado with lemon juice, salt and pepper.',
      'Poach eggs in simmering water with vinegar for 3 min.',
      'Spread avocado on toast, top with poached eggs and chili flakes.',
    ],
    rating: 4.7,
    author: 'Sofia',
    updated: 'May 8, 2026',
    reviewCount: 182,
  },
  {
    id: 'r3',
    name: 'Thai Basil Beef Stir-Fry',
    type: 'dinner',
    cal: 620,
    pro: 38,
    crb: 52,
    fat: 24,
    time: 20,
    servings: 3,
    fav: true,
    img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80',
    ingredients: [
      '500g ground beef',
      '3 cloves garlic, minced',
      '2 thai chilies',
      '1 cup thai basil leaves',
      '2 tbsp oyster sauce',
      '1 tbsp fish sauce',
      '1 tbsp soy sauce',
      '1 tsp sugar',
      '2 tbsp vegetable oil',
      'Jasmine rice to serve',
    ],
    steps: [
      'Heat oil in wok over high heat. Add garlic and chilies, cook 30s.',
      'Add beef, break apart and cook until browned.',
      'Add sauces and sugar. Toss to coat.',
      'Remove from heat, stir in thai basil. Serve over jasmine rice.',
    ],
    rating: 4.8,
    author: 'Kenji',
    updated: 'May 12, 2026',
    reviewCount: 310,
  },
  {
    id: 'r4',
    name: 'Greek Yogurt Protein Parfait',
    type: 'snack',
    cal: 280,
    pro: 24,
    crb: 30,
    fat: 8,
    time: 5,
    servings: 1,
    fav: false,
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    ingredients: [
      '200g Greek yogurt',
      '½ cup granola',
      '½ cup mixed berries',
      '1 tbsp honey',
      'Chia seeds',
    ],
    steps: [
      'Layer yogurt at the bottom of a glass.',
      'Add granola, then berries.',
      'Drizzle with honey and sprinkle chia seeds.',
    ],
    rating: 4.5,
    author: 'Priya',
    updated: 'May 5, 2026',
    reviewCount: 94,
  },
  {
    id: 'r5',
    name: 'Lemon Herb Salmon with Roasted Asparagus',
    type: 'dinner',
    cal: 480,
    pro: 44,
    crb: 12,
    fat: 28,
    time: 25,
    servings: 2,
    fav: true,
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
    ingredients: [
      '2 salmon fillets',
      '1 bunch asparagus',
      '3 tbsp olive oil',
      '2 lemons',
      '4 cloves garlic',
      'Fresh dill',
      'Salt and pepper',
    ],
    steps: [
      'Preheat oven to 200°C (400°F).',
      'Toss asparagus with olive oil, salt. Roast 12 min.',
      'Season salmon with lemon, garlic, dill, salt and pepper.',
      'Pan-sear salmon skin-side up 4 min, flip and cook 3 more min. Serve together.',
    ],
    rating: 4.9,
    author: 'Alina',
    updated: 'May 14, 2026',
    reviewCount: 201,
  },
  {
    id: 'r6',
    name: 'Overnight Oats with Banana & Almond Butter',
    type: 'breakfast',
    cal: 420,
    pro: 16,
    crb: 62,
    fat: 14,
    time: 5,
    servings: 1,
    fav: false,
    img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80',
    ingredients: [
      '½ cup rolled oats',
      '½ cup milk',
      '2 tbsp almond butter',
      '1 banana, sliced',
      '1 tbsp maple syrup',
      'Pinch of cinnamon',
      'Chia seeds',
    ],
    steps: [
      'Combine oats, milk and chia seeds in a jar. Stir well.',
      'Refrigerate overnight (at least 6 hours).',
      'In the morning, top with banana, almond butter, and maple syrup.',
    ],
    rating: 4.6,
    author: 'Yara',
    updated: 'May 3, 2026',
    reviewCount: 137,
  },
]

const PANTRY_ITEMS = [
  {
    id: 'p1',
    name: 'Chicken Breast',
    cat: 'Protein',
    qty: '500g',
    exp: 'May 18',
    expiring: true,
  },
  {
    id: 'p2',
    name: 'Greek Yogurt',
    cat: 'Dairy',
    qty: '400g',
    exp: 'May 20',
    expiring: true,
  },
  {
    id: 'p3',
    name: 'Quinoa',
    cat: 'Pantry',
    qty: '1 kg',
    exp: 'Dec 2026',
    expiring: false,
  },
  {
    id: 'p4',
    name: 'Salmon Fillet',
    cat: 'Protein',
    qty: '300g',
    exp: 'May 17',
    expiring: true,
  },
  {
    id: 'p5',
    name: 'Cherry Tomatoes',
    cat: 'Produce',
    qty: '250g',
    exp: 'May 22',
    expiring: false,
  },
  {
    id: 'p6',
    name: 'Eggs (12)',
    cat: 'Dairy',
    qty: '12 pcs',
    exp: 'May 28',
    expiring: false,
  },
  {
    id: 'p7',
    name: 'Olive Oil',
    cat: 'Pantry',
    qty: '750ml',
    exp: 'Jan 2027',
    expiring: false,
  },
  {
    id: 'p8',
    name: 'Feta Cheese',
    cat: 'Dairy',
    qty: '200g',
    exp: 'Jun 2026',
    expiring: false,
  },
  {
    id: 'p9',
    name: 'Avocado',
    cat: 'Produce',
    qty: '2 pcs',
    exp: 'May 19',
    expiring: false,
  },
  {
    id: 'p10',
    name: 'Sourdough Bread',
    cat: 'Pantry',
    qty: '1 loaf',
    exp: 'May 18',
    expiring: true,
  },
  {
    id: 'p11',
    name: 'Almonds',
    cat: 'Pantry',
    qty: '300g',
    exp: 'Sep 2026',
    expiring: false,
  },
  {
    id: 'p12',
    name: 'Oat Milk',
    cat: 'Dairy',
    qty: '1L',
    exp: 'Jun 2026',
    expiring: false,
  },
  {
    id: 'p13',
    name: 'Broccoli',
    cat: 'Produce',
    qty: '1 head',
    exp: 'May 21',
    expiring: false,
  },
  {
    id: 'p14',
    name: 'Brown Rice',
    cat: 'Pantry',
    qty: '2 kg',
    exp: 'Feb 2027',
    expiring: false,
  },
]

const SHOPPING_ITEMS = [
  {
    id: 's1',
    name: 'Ground Beef 500g',
    qty: '1 pack',
    cat: 'Protein',
    done: false,
  },
  { id: 's2', name: 'Thai Basil', qty: '1 bunch', cat: 'Produce', done: false },
  {
    id: 's3',
    name: 'Jasmine Rice 2kg',
    qty: '1 bag',
    cat: 'Pantry',
    done: true,
  },
  { id: 's4', name: 'Asparagus', qty: '1 bunch', cat: 'Produce', done: false },
  { id: 's5', name: 'Granola', qty: '500g', cat: 'Pantry', done: false },
  {
    id: 's6',
    name: 'Mixed Berries (frozen)',
    qty: '400g',
    cat: 'Frozen',
    done: false,
  },
  { id: 's7', name: 'Almond Butter', qty: '1 jar', cat: 'Pantry', done: true },
  { id: 's8', name: 'Rolled Oats', qty: '1 kg', cat: 'Pantry', done: false },
  {
    id: 's9',
    name: 'Maple Syrup',
    qty: '1 bottle',
    cat: 'Pantry',
    done: false,
  },
  { id: 's10', name: 'Lemons', qty: '6 pcs', cat: 'Produce', done: false },
  { id: 's11', name: 'Cucumber', qty: '2 pcs', cat: 'Produce', done: true },
  {
    id: 's12',
    name: 'Kalamata Olives',
    qty: '200g',
    cat: 'Pantry',
    done: false,
  },
]

const COOKBOOKS = [
  {
    id: 'cb1',
    name: 'High-Protein Week',
    desc: '8 recipes, 40g+ protein each',
    count: 8,
    color: K.btnBlue,
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
  {
    id: 'cb2',
    name: 'Sunday Dinners',
    desc: 'Family-style recipes for slow weekends',
    count: 5,
    color: K.gradBrand,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  },
  {
    id: 'cb3',
    name: 'Quick Breakfasts',
    desc: 'Under 15 minutes, all delicious',
    count: 6,
    color: 'linear-gradient(135deg,#f6b352 0%,#f582ae 100%)',
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
  },
]

const TEMPLATES = [
  {
    id: 't1',
    name: 'Pescatarian Week',
    desc: '21 meals, fish-forward',
    count: 21,
    color: K.gradPrimary,
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',
    tags: ['High Protein', 'Omega-3', 'Auto List'],
  },
  {
    id: 't2',
    name: 'Keto Kickstart',
    desc: '14 meals, low carb',
    count: 14,
    color: 'linear-gradient(135deg,#5bbf85 0%,#059669 100%)',
    img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
    tags: ['Low Carb', 'High Fat', 'Ketogenic'],
  },
  {
    id: 't3',
    name: 'Veggie Bliss',
    desc: '21 plant-based meals',
    count: 21,
    color: 'linear-gradient(135deg,#f582ae 0%,#a78bfa 100%)',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    tags: ['Plant-Based', 'Fiber Rich', 'Anti-inflammatory'],
  },
  {
    id: 't4',
    name: 'High Protein Gains',
    desc: '21 muscle-building meals',
    count: 21,
    color: 'linear-gradient(135deg,#6c5ce7 0%,#a78bfa 100%)',
    img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
    tags: ['40g+ Protein', 'Muscle Building', 'Macro Balanced'],
  },
  {
    id: 't5',
    name: 'Mediterranean Glow',
    desc: '21 heart-healthy meals',
    count: 21,
    color: 'linear-gradient(135deg,#5dade2 0%,#5bbf85 100%)',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    tags: ['Heart Healthy', 'Olive Oil', 'Fresh Herbs'],
  },
  {
    id: 't6',
    name: 'Quick & Clean',
    desc: '21 meals under 20 minutes',
    count: 21,
    color: 'linear-gradient(135deg,#f6b352 0%,#e87298 100%)',
    img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
    tags: ['Under 20 min', 'Balanced', 'Meal Prep'],
  },
]

const PLANNER_DAYS = [
  {
    day: 'MON',
    date: '12',
    meals: {
      breakfast: {
        name: 'Overnight Oats',
        cal: 420,
        pro: 18,
        crb: 58,
        fat: 12,
        time: 10,
        img: FOOD_IMG_1,
      },
      lunch: {
        name: 'Quinoa Bowl',
        cal: 540,
        pro: 32,
        crb: 62,
        fat: 18,
        time: 25,
        img: FOOD_IMG_2,
      },
      dinner: {
        name: 'Salmon & Asparagus',
        cal: 480,
        pro: 42,
        crb: 18,
        fat: 22,
        time: 35,
        img: FOOD_IMG_1,
      },
    },
  },
  {
    day: 'TUE',
    date: '13',
    meals: {
      breakfast: {
        name: 'Avocado Toast',
        cal: 380,
        pro: 14,
        crb: 42,
        fat: 20,
        time: 10,
        img: FOOD_IMG_2,
      },
      lunch: null,
      dinner: {
        name: 'Thai Basil Beef',
        cal: 620,
        pro: 48,
        crb: 38,
        fat: 28,
        time: 40,
        img: FOOD_IMG_1,
      },
    },
  },
  {
    day: 'WED',
    date: '14',
    meals: {
      breakfast: null,
      lunch: {
        name: 'Greek Salad',
        cal: 350,
        pro: 12,
        crb: 28,
        fat: 22,
        time: 15,
        img: FOOD_IMG_2,
      },
      dinner: null,
    },
  },
  {
    day: 'THU',
    date: '15',
    meals: {
      breakfast: {
        name: 'Protein Parfait',
        cal: 280,
        pro: 24,
        crb: 32,
        fat: 8,
        time: 5,
        img: FOOD_IMG_1,
      },
      lunch: {
        name: 'Chicken Wrap',
        cal: 490,
        pro: 38,
        crb: 48,
        fat: 14,
        time: 20,
        img: FOOD_IMG_2,
      },
      dinner: {
        name: 'Salmon Pasta',
        cal: 560,
        pro: 44,
        crb: 62,
        fat: 18,
        time: 35,
        img: FOOD_IMG_1,
      },
    },
  },
  {
    day: 'FRI',
    date: '16',
    meals: {
      breakfast: {
        name: 'Overnight Oats',
        cal: 420,
        pro: 18,
        crb: 58,
        fat: 12,
        time: 10,
        img: FOOD_IMG_2,
      },
      lunch: null,
      dinner: {
        name: 'Stir-Fry',
        cal: 580,
        pro: 46,
        crb: 42,
        fat: 24,
        time: 30,
        img: FOOD_IMG_1,
      },
    },
  },
  {
    day: 'SAT',
    date: '17',
    meals: {
      breakfast: {
        name: 'Eggs Benedict',
        cal: 450,
        pro: 26,
        crb: 32,
        fat: 26,
        time: 20,
        img: FOOD_IMG_1,
      },
      lunch: {
        name: 'Quinoa Bowl',
        cal: 540,
        pro: 32,
        crb: 62,
        fat: 18,
        time: 25,
        img: FOOD_IMG_2,
      },
      dinner: {
        name: 'Grilled Chicken',
        cal: 510,
        pro: 52,
        crb: 22,
        fat: 20,
        time: 35,
        img: FOOD_IMG_1,
      },
    },
  },
  {
    day: 'SUN',
    date: '18',
    meals: {
      breakfast: null,
      lunch: null,
      dinner: {
        name: 'Roast Vegetables',
        cal: 380,
        pro: 14,
        crb: 52,
        fat: 16,
        time: 45,
        img: FOOD_IMG_2,
      },
    },
  },
]

// ─── Views ────────────────────────────────────────────────────────────────────
type MealTab =
  | 'home'
  | 'planner'
  | 'shopping'
  | 'templates'
  | 'diet-plans'
  | 'ai-nutritionist'
  | 'chef'
  | 'import'
  | 'manual'
  | 'recipes'
  | 'books'
  | 'pantry'
  | 'recipe-detail'
  | 'diet-detail'

const NAV_SECTIONS = [
  {
    label: 'Plan',
    items: [
      {
        id: 'planner' as MealTab,
        label: 'Meal Planner',
        icon: <Calendar size={15} />,
        badge: '★',
        badgeColor: K.gradBrand,
        badgeText: '#fff',
      },
      {
        id: 'shopping' as MealTab,
        label: 'Shopping List',
        icon: <ShoppingCart size={15} />,
        badge: 12,
      },
      {
        id: 'templates' as MealTab,
        label: 'Templates',
        icon: <LayoutGrid size={15} />,
      },
      {
        id: 'diet-plans' as MealTab,
        label: 'Diet Plans',
        icon: <Target size={15} />,
        badge: '30+',
      },
    ],
  },
  {
    label: 'Create',
    items: [
      {
        id: 'ai-nutritionist' as MealTab,
        label: 'AI Nutritionist',
        icon: <Heart size={15} />,
        badge: '★',
        badgeColor: K.gradBrand,
        badgeText: '#fff',
      },
      {
        id: 'chef' as MealTab,
        label: 'Chef AI',
        icon: <MessageCircle size={15} />,
        badge: 'NEW',
        badgeColor: K.btnGreen,
        badgeText: '#fff',
      },
      {
        id: 'import' as MealTab,
        label: 'Import Recipe',
        icon: <Upload size={15} />,
      },
      {
        id: 'manual' as MealTab,
        label: 'Add Recipe Manually',
        icon: <PenTool size={15} />,
      },
    ],
  },
  {
    label: 'Manage',
    items: [
      {
        id: 'recipes' as MealTab,
        label: 'Saved Recipes',
        icon: <Bookmark size={15} />,
        badge: 16,
      },
      {
        id: 'books' as MealTab,
        label: 'Cookbooks',
        icon: <BookOpen size={15} />,
      },
      {
        id: 'pantry' as MealTab,
        label: 'Pantry',
        icon: <Archive size={15} />,
        badge: 14,
      },
    ],
  },
]

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView({ setTab }: { setTab: (t: MealTab) => void }) {
  const stats = [
    {
      key: 'recipes',
      label: 'Saved recipes',
      val: 16,
      trend: '+3 new',
      up: true,
      icon: <Bookmark size={18} />,
      iconBg: K.goldSoft,
      iconColor: '#b87a1c',
    },
    {
      key: 'books',
      label: 'Cookbooks',
      val: 3,
      trend: null,
      icon: <BookOpen size={18} />,
      iconBg: K.accentSoft,
      iconColor: '#d2528a',
    },
    {
      key: 'pantry',
      label: 'Pantry items',
      val: 14,
      trend: '3 expiring',
      up: false,
      icon: <Archive size={18} />,
      iconBg: K.leafSoft,
      iconColor: '#3e9863',
    },
    {
      key: 'shopping',
      label: 'Shopping items',
      val: 12,
      trend: null,
      icon: <ShoppingCart size={18} />,
      iconBg: K.skySoft,
      iconColor: '#2b80c2',
    },
  ]
  const meals = [
    {
      name: 'Mediterranean Quinoa & Chicken Bowl',
      type: 'lunch' as const,
      cal: 540,
      pro: 42,
      time: 35,
      img: RECIPES[0].img,
    },
    {
      name: 'Avocado Toast with Poached Eggs',
      type: 'breakfast' as const,
      cal: 380,
      pro: 18,
      time: 15,
      img: RECIPES[1].img,
    },
    {
      name: 'Thai Basil Beef Stir-Fry',
      type: 'dinner' as const,
      cal: 620,
      pro: 38,
      time: 20,
      img: RECIPES[2].img,
    },
  ]
  const quickActions = [
    {
      label: 'Plan my week',
      sub: 'Weekly meal planner',
      color: 'purple',
      icon: <Calendar size={16} />,
      onClick: () => setTab('planner'),
    },
    {
      label: 'Generate recipe',
      sub: 'Let AI create for you',
      color: 'pink',
      icon: <Sparkles size={16} />,
      onClick: () => setTab('chef'),
    },
    {
      label: "What's in my pantry?",
      sub: 'Use what you have',
      color: 'green',
      icon: <Archive size={16} />,
      onClick: () => setTab('pantry'),
    },
    {
      label: 'Import a recipe',
      sub: 'From URL or photo',
      color: 'amber',
      icon: <Upload size={16} />,
      onClick: () => setTab('import'),
    },
    {
      label: 'Create cookbook',
      sub: 'Organize your recipes',
      color: 'cyan',
      icon: <BookOpen size={16} />,
      onClick: () => setTab('books'),
    },
    {
      label: 'Shopping list',
      sub: '12 items pending',
      color: 'slate',
      icon: <ShoppingCart size={16} />,
      onClick: () => setTab('shopping'),
    },
  ]
  const colorMap: Record<string, { bg: string; color: string }> = {
    purple: { bg: K.primarySoft, color: K.primary },
    pink: { bg: K.accentSoft, color: '#d2528a' },
    green: { bg: K.leafSoft, color: '#3e9863' },
    amber: { bg: K.goldSoft, color: '#b87a1c' },
    cyan: { bg: K.skySoft, color: '#2b80c2' },
    slate: { bg: 'rgba(110,103,145,0.12)', color: '#4d4570' },
  }
  const mealTypeColor: Record<string, { bg: string; color: string }> = {
    breakfast: { bg: K.goldSoft, color: '#b87a1c' },
    lunch: { bg: K.leafSoft, color: '#3e9863' },
    dinner: { bg: K.accentSoft, color: '#d2528a' },
    snack: { bg: K.skySoft, color: '#2b80c2' },
  }

  return (
    <div style={{ padding: '8px 32px 40px' }}>
      {/* Hero Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 18,
          marginBottom: 24,
        }}
      >
        {/* Greeting */}
        <KCard
          style={{
            padding: '32px 36px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              background:
                'radial-gradient(circle, rgba(245,130,174,0.15), transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -80,
              left: -40,
              width: 280,
              height: 280,
              background:
                'radial-gradient(circle, rgba(108,92,231,0.10), transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11.5,
                fontWeight: 600,
                color: K.primary,
                background: K.primarySoft,
                padding: '4px 12px',
                borderRadius: 999,
                marginBottom: 18,
              }}
            >
              <Sparkles size={11} /> AI-powered meal planning
            </div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                margin: '0 0 10px',
                color: K.text,
              }}
            >
              Good morning,{' '}
              <span
                style={{
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Kobe
              </span>
              .<br />
              What's cooking today?
            </h2>
            <p
              style={{
                color: K.textMuted,
                margin: '0 0 22px',
                fontSize: 14,
                lineHeight: 1.55,
                maxWidth: 460,
              }}
            >
              I planned <b style={{ color: K.text }}>3 meals</b> for today —
              totaling 1,500 calories with balanced macros. Tap any action to
              dive in.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Plan my week', onClick: () => setTab('planner') },
                { label: 'Generate recipe', onClick: () => setTab('chef') },
                {
                  label: "What's in my pantry?",
                  onClick: () => setTab('pantry'),
                },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={c.onClick}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(244,241,251,0.9)',
                    border: `1px solid ${K.border}`,
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: K.textSub,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      K.primary
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.primary
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      K.border
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.textSub
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </KCard>

        {/* Today's Nutrition */}
        <KCard
          style={{
            padding: '24px 26px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 160,
              height: 160,
              background:
                'linear-gradient(95deg, rgba(168,185,255,0.35), rgba(200,168,255,0.35) 50%, rgba(245,184,224,0.35) 100%)',
              opacity: 0.6,
              filter: 'blur(60px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: K.textMuted,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Today's nutrition
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 13,
                  fontWeight: 600,
                  color: K.textSub,
                }}
              >
                Saturday, May 16
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}
            >
              {[
                {
                  val: '1,500',
                  unit: 'cal',
                  lbl: 'Calories',
                  pct: 75,
                  color: K.gold,
                },
                {
                  val: '108',
                  unit: 'g',
                  lbl: 'Protein',
                  pct: 60,
                  color: K.leaf,
                },
                { val: '142', unit: 'g', lbl: 'Carbs', pct: 47, color: K.sky },
                { val: '54', unit: 'g', lbl: 'Fat', pct: 60, color: K.accent },
              ].map((m) => (
                <div key={m.lbl}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: K.text,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {m.val}
                    <small
                      style={{
                        fontSize: 11,
                        color: K.textMuted,
                        fontWeight: 600,
                      }}
                    >
                      {m.unit}
                    </small>
                  </div>
                  <KProgress
                    value={m.pct}
                    color={m.color}
                    style={{ marginTop: 4, marginBottom: 4 }}
                  />
                  <div
                    style={{
                      fontSize: 11,
                      color: K.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                    }}
                  >
                    {m.lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </KCard>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 28,
        }}
      >
        {stats.map((s) => (
          <KCard
            key={s.key}
            onClick={() => setTab(s.key as MealTab)}
            style={{
              padding: '18px 20px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-2px)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 8px 24px rgba(34,18,64,0.1)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform = ''
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                display: 'grid',
                placeItems: 'center',
                marginBottom: 14,
                background: s.iconBg,
                color: s.iconColor,
              }}
            >
              {s.icon}
            </div>
            {s.trend && (
              <span
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: s.up ? K.leafSoft : K.accentSoft,
                  color: s.up ? K.leaf : K.accent,
                }}
              >
                {s.trend}
              </span>
            )}
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '-0.035em',
                color: K.text,
                lineHeight: 1,
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: K.textMuted,
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 18,
          marginBottom: 28,
        }}
      >
        {/* Today's Meals */}
        <KCard style={{ padding: '24px 26px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
                color: K.text,
              }}
            >
              Today's meals
            </h3>
            <button
              onClick={() => setTab('planner')}
              style={{
                marginLeft: 'auto',
                fontSize: 12.5,
                fontWeight: 600,
                color: K.primary,
                background: 'transparent',
                border: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meals.map((m, i) => (
              <div
                key={i}
                onClick={() => setTab('recipes')}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr auto',
                  gap: 14,
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 14,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    'rgba(244,241,251,0.8)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = '')
                }
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: 'rgba(244,241,251,0.8)',
                  }}
                >
                  <img
                    src={m.img}
                    alt={m.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display =
                        'none'
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: K.text,
                      marginBottom: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: K.textMuted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 500,
                    }}
                  >
                    <Flame size={11} /> {m.cal} cal
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: '50%',
                        background: K.textLight,
                        display: 'inline-block',
                      }}
                    />
                    <Dumbbell size={11} /> {m.pro}g protein
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: '50%',
                        background: K.textLight,
                        display: 'inline-block',
                      }}
                    />
                    <Clock size={11} /> {m.time}min
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    background: mealTypeColor[m.type].bg,
                    color: mealTypeColor[m.type].color,
                  }}
                >
                  {m.type}
                </span>
              </div>
            ))}
          </div>
        </KCard>

        {/* Quick Actions */}
        <KCard style={{ padding: '24px 26px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
                color: K.text,
              }}
            >
              Quick actions
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
            }}
          >
            {quickActions.map((qa) => (
              <div
                key={qa.label}
                onClick={qa.onClick}
                style={{
                  background: 'rgba(244,241,251,0.7)',
                  border: `1px solid ${K.border}`,
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = '#fff'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor =
                    K.primary
                  ;(e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background =
                    'rgba(244,241,251,0.7)'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor =
                    K.border
                  ;(e.currentTarget as HTMLDivElement).style.transform = ''
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: 'grid',
                    placeItems: 'center',
                    background: colorMap[qa.color].bg,
                    color: colorMap[qa.color].color,
                    flexShrink: 0,
                  }}
                >
                  {qa.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: K.text }}>
                    {qa.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: K.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    {qa.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </KCard>
      </div>
    </div>
  )
}

// ─── Meal Planner ─────────────────────────────────────────────────────────────
// ─── Meal / Recipe Detail Page ────────────────────────────────────────────────
function RecipeDetailPage({
  meal,
  onBack,
  showToast,
}: {
  meal: NonNullable<(typeof PLANNER_DAYS)[0]['meals']['breakfast']>
  onBack: () => void
  showToast: (m: string) => void
}) {
  const rating = 4.6
  const reviewCount = 126
  const author = 'Priya'
  const updated = 'May 10, 2026'

  const ingredients = [
    `5 large Eggs`,
    `100g Smoked salmon, sliced`,
    `2 tbsp Fresh dill, chopped`,
    `2 tbsp Cream cheese`,
    `1 tbsp Butter`,
  ]
  const steps = [
    {
      title: 'Mix the ingredients',
      body: 'Whisk eggs with cream cheese and dill.',
    },
    {
      title: 'Melt butter in non-stick',
      body: 'Melt butter in non-stick pan over low heat.',
    },
    {
      title: 'Mix the ingredients',
      body: 'Add eggs, stir gently until just set.',
    },
    {
      title: 'Plate and serve',
      body: 'Fold in smoked salmon off-heat. Serve immediately.',
    },
  ]
  const notes = [
    'Use a digital thermometer for perfect doneness every time.',
    'Slightly undercook anything that will be reheated — it keeps softening.',
    'Vary your spice blend weekly to prevent meal-prep fatigue.',
  ]

  const Stars = () => (
    <span style={{ display: 'inline-flex', gap: 2, color: K.gold }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )

  return (
    <div style={{ padding: '8px 32px 60px', maxWidth: 880, margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13.5,
          color: K.textMuted,
          fontWeight: 500,
          marginBottom: 18,
        }}
      >
        <span
          onClick={onBack}
          style={{
            cursor: 'pointer',
            color: K.textMuted,
            transition: 'color .15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = K.primary)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = K.textMuted)
          }
        >
          recipes
        </span>
        <ChevronRight size={12} style={{ opacity: 0.6 }} />
        <span
          onClick={onBack}
          style={{ cursor: 'pointer', color: K.textMuted }}
        >
          {(meal as any).type ?? 'breakfast'}
        </span>
        <ChevronRight size={12} style={{ opacity: 0.6 }} />
        <span style={{ color: K.text, fontWeight: 600 }}>{meal.name}</span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.1,
          margin: '0 0 14px',
          color: K.text,
        }}
      >
        {meal.name}
      </h1>
      <p
        style={{
          fontSize: 17,
          color: K.textMuted,
          lineHeight: 1.5,
          margin: '0 0 18px',
          fontWeight: 500,
        }}
      >
        A protein-packed start to the day that comes together fast — perfect for
        busy mornings or weekend brunches.
      </p>

      {/* Author row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          marginBottom: 8,
          fontSize: 13.5,
          color: K.textSub,
          fontWeight: 500,
        }}
      >
        <span style={{ fontWeight: 700, color: K.text }}>{author}</span>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: K.textLight,
            display: 'inline-block',
          }}
        />
        <span>Updated {updated}</span>
      </div>

      {/* Rating row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <Stars />
        <span style={{ fontSize: 13.5, color: K.textMuted, fontWeight: 500 }}>
          <strong style={{ color: K.text }}>{rating}</strong> from {reviewCount}{' '}
          reviews
        </span>
        <a
          onClick={() => {}}
          style={{
            marginLeft: 'auto',
            color: K.leaf,
            fontWeight: 700,
            fontSize: 13.5,
            cursor: 'pointer',
          }}
        >
          Jump to recipe
        </a>
      </div>

      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/10',
          borderRadius: 24,
          overflow: 'hidden',
          marginBottom: 28,
          boxShadow: '0 4px 16px rgba(34,18,64,0.08)',
        }}
      >
        <img
          src={meal.img ?? FOOD_IMG_1}
          alt={meal.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = FOOD_IMG_1
          }}
        />
        <button
          onClick={() => showToast('Added to meal plan!')}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            border: 0,
            borderRadius: 12,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700,
            color: K.text,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Plus size={14} /> Add to My Meal Plan
        </button>
      </div>

      {/* Recipe card */}
      <KCard style={{ padding: '28px 32px', marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 24,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.025em',
                margin: '0 0 6px',
                color: K.text,
              }}
            >
              {meal.name}
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: K.textMuted,
                margin: '0 0 10px',
                lineHeight: 1.5,
                fontWeight: 500,
                maxWidth: 340,
              }}
            >
              A protein-packed start to the day that comes together fast —
              perfect for busy mornings or weekend brunches.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stars />
              <span
                style={{ fontSize: 12, color: K.textMuted, fontWeight: 500 }}
              >
                <strong style={{ color: K.text }}>{rating}</strong> from{' '}
                {reviewCount} reviews
              </span>
            </div>
          </div>
          <div
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}
          >
            <button
              onClick={() => showToast('Added to plan!')}
              style={{
                padding: '10px 18px',
                background: '#1b5e3f',
                color: '#fff',
                border: 0,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Plus size={14} /> Add to Plan
            </button>
            <button
              onClick={() => showToast('Printing...')}
              style={{
                padding: '10px 14px',
                background: 'transparent',
                border: `1px solid ${K.border}`,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={() => showToast('Sharing...')}
              style={{
                padding: '10px 14px',
                background: 'transparent',
                border: `1px solid ${K.border}`,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            paddingTop: 20,
            borderTop: `1px solid ${K.border}`,
          }}
        >
          {[
            { lbl: 'Author', val: author },
            { lbl: 'Total Time', val: `${meal.time ?? 30} mins` },
            { lbl: 'Yield', val: `${(meal as any).servings ?? 2} servings` },
            { lbl: 'Calories', val: `${meal.cal} kcal` },
          ].map((s) => (
            <div key={s.lbl}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                }}
              >
                {s.lbl}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: K.text }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>
      </KCard>

      {/* Nutrition card */}
      <KCard style={{ padding: '22px 28px', marginBottom: 28 }}>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: '0 0 14px',
            color: K.text,
          }}
        >
          Nutrition per serving
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          {[
            { lbl: 'Calories', val: meal.cal },
            { lbl: 'Protein', val: `${meal.pro ?? 0}g` },
            { lbl: 'Carbs', val: `${meal.crb ?? 0}g` },
            { lbl: 'Fat', val: `${meal.fat ?? 0}g` },
          ].map((n) => (
            <div
              key={n.lbl}
              style={{
                textAlign: 'center',
                padding: '14px 8px',
                background: K.bgSoft,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: K.text,
                  letterSpacing: '-0.03em',
                }}
              >
                {n.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {n.lbl}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 12,
            color: K.textMuted,
            marginTop: 12,
            fontWeight: 500,
          }}
        >
          Need different macros? Use our free{' '}
          <span
            onClick={() => showToast('Macro calculator coming soon!')}
            style={{ color: K.primary, cursor: 'pointer', fontWeight: 600 }}
          >
            Calorie & Macro Calculator
          </span>
        </div>
      </KCard>

      {/* Ingredients */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 18px',
            color: K.text,
          }}
        >
          Ingredients
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {ingredients.map((ing, i) => {
            const parts = ing.split(' ')
            const qty = parts.slice(0, 2).join(' ')
            const name = parts.slice(2).join(' ')
            return (
              <li
                key={i}
                style={{
                  position: 'relative',
                  padding: '6px 0 6px 22px',
                  fontSize: 14.5,
                  color: K.textSub,
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 14,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: K.leaf,
                    display: 'inline-block',
                  }}
                />
                <strong style={{ color: K.text, fontWeight: 800 }}>
                  {qty}
                </strong>{' '}
                {name}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 18px',
            color: K.text,
          }}
        >
          Instructions
        </h2>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '36px 1fr',
              gap: 16,
              marginBottom: 22,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1b5e3f',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  margin: '5px 0 8px',
                  letterSpacing: '-0.015em',
                  color: K.text,
                }}
              >
                {s.title}
              </h4>
              <p
                style={{
                  fontSize: 14.5,
                  color: K.textSub,
                  lineHeight: 1.65,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div
        style={{
          background: '#fdf9eb',
          borderRadius: 18,
          padding: '24px 28px',
          marginBottom: 32,
          border: '1px solid rgba(246,179,82,0.25)',
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 800,
            margin: '0 0 12px',
            color: K.text,
            letterSpacing: '-0.02em',
          }}
        >
          Notes
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {notes.map((n, i) => (
            <li
              key={i}
              style={{
                position: 'relative',
                padding: '4px 0 4px 18px',
                fontSize: 14,
                color: K.textSub,
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 14,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: K.gold,
                  display: 'inline-block',
                }}
              />
              {n}
            </li>
          ))}
        </ul>
      </div>

      {/* Prose section */}
      <div style={{ maxWidth: 760 }}>
        {[
          {
            h: 'Why This Recipe Works',
            body: `This is one of those go-to recipes that hits every box: ${meal.cal} calories per serving, ${meal.pro ?? 0}g of protein, ready in ${meal.time ?? 30} minutes, and built around ingredients most home cooks already have.`,
          },
          {
            h: 'Storage',
            body: 'Refrigerate in airtight containers for 4–5 days. Freeze for up to 3 months. Reheat in microwave 2–3 min at 70% power.',
          },
        ].map((s) => (
          <div key={s.h}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '36px 0 16px',
                color: K.text,
              }}
            >
              {s.h}
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: K.textSub,
                margin: '0 0 16px',
                fontWeight: 500,
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Auto-Plan Modal ──────────────────────────────────────────────────────────
function AutoPlanModal({
  open,
  onClose,
  showToast,
}: {
  open: boolean
  onClose: () => void
  showToast: (m: string) => void
}) {
  const [step, setStep] = React.useState<'config' | 'generating' | 'done'>(
    'config',
  )
  const [goal, setGoal] = React.useState<'lose' | 'maintain' | 'gain'>(
    'maintain',
  )
  const [calories, setCalories] = React.useState(2000)
  const [diet, setDiet] = React.useState('any')
  const [meals, setMeals] = React.useState({
    breakfast: true,
    lunch: true,
    dinner: true,
  })
  const [toggles, setToggles] = React.useState({
    respectExisting: true,
    preferPantry: true,
    maxVariety: false,
  })
  const [genLog, setGenLog] = React.useState<{ text: string; done: boolean }[]>(
    [],
  )

  const dietOptions = [
    'Any',
    'High Protein',
    'Vegetarian',
    'Pescatarian',
    'Low-Carb',
    'Gluten-Free',
    'Quick & Easy',
  ]
  const goalCalMap = { lose: 1600, maintain: 2000, gain: 2400 }

  function handleGenerate() {
    if (!Object.values(meals).some(Boolean)) {
      showToast('Pick at least one meal type')
      return
    }
    setStep('generating')
    setGenLog([])
    const steps = [
      'Analyzing your goals & preferences...',
      'Scanning recipes for your diet preference...',
      'Cross-checking pantry items...',
      'Respecting your existing meals...',
      'Optimizing for variety & balance...',
      'Finalizing your 7-day plan ✨',
    ]
    let i = 0
    function pushStep() {
      if (i >= steps.length) {
        setTimeout(() => setStep('done'), 400)
        return
      }
      setGenLog((prev) => {
        const updated = prev.map((l) => ({ ...l, done: true }))
        return [...updated, { text: steps[i], done: false }]
      })
      i++
      setTimeout(pushStep, 500 + Math.random() * 300)
    }
    pushStep()
  }

  function handleApply() {
    showToast('Plan applied to your week!')
    onClose()
  }

  function reset() {
    setStep('config')
    setGenLog([])
  }

  if (!open) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(14,10,46,0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 28,
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 16px 40px rgba(34,18,64,0.18)',
          animation: 'modalUp .3s cubic-bezier(0.18,0.89,0.43,1.19)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 0',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                margin: 0,
                color: K.text,
              }}
            >
              AI Auto-Plan
            </h2>
            <p
              style={{
                fontSize: 13,
                color: K.textMuted,
                margin: '4px 0 0',
                fontWeight: 500,
              }}
            >
              {step === 'config' &&
                "Tell Kira what you want and she'll build your week."}
              {step === 'generating' && 'Generating your personalized plan...'}
              {step === 'done' && 'Your plan is ready. Review and apply.'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              width: 32,
              height: 32,
              background: K.bgSoft,
              border: 0,
              borderRadius: 10,
              color: K.textSub,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Banner */}
        <div
          style={{
            margin: '16px 28px 0',
            background:
              'linear-gradient(135deg, #6c5ce7 0%, #a78bfa 40%, #f582ae 100%)',
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>
              Powered by Chef Kira
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
              }}
            >
              Personalized meal plans built around your goals, pantry &
              schedule.
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 28px 28px' }}>
          {/* ── STEP 1: CONFIG ── */}
          {step === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* Goal */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  Your Goal
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  {(
                    [
                      {
                        key: 'lose',
                        emoji: '📉',
                        label: 'Lose Weight',
                        sub: '~500 cal deficit',
                      },
                      {
                        key: 'maintain',
                        emoji: '⚖️',
                        label: 'Maintain',
                        sub: 'Current intake',
                      },
                      {
                        key: 'gain',
                        emoji: '💪',
                        label: 'Build Muscle',
                        sub: '~300 cal surplus',
                      },
                    ] as const
                  ).map((g) => (
                    <div
                      key={g.key}
                      onClick={() => {
                        setGoal(g.key)
                        setCalories(goalCalMap[g.key])
                      }}
                      style={{
                        border: `2px solid ${goal === g.key ? K.primary : K.border}`,
                        background: goal === g.key ? K.primarySoft : K.bgSoft,
                        borderRadius: 14,
                        padding: '14px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all .15s',
                      }}
                    >
                      <div
                        style={{ fontSize: 24, lineHeight: 1, marginBottom: 6 }}
                      >
                        {g.emoji}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: K.text,
                          marginBottom: 2,
                        }}
                      >
                        {g.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: K.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        {g.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Calories slider */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  Daily Calories
                </div>
                <div
                  style={{
                    background: K.bgSoft,
                    borderRadius: 14,
                    padding: '16px 18px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: K.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      Target intake per day
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: K.primary,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {calories}
                      <small
                        style={{
                          fontSize: 12,
                          color: K.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        kcal
                      </small>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1200}
                    max={3200}
                    step={50}
                    value={calories}
                    onChange={(e) => setCalories(+e.target.value)}
                    style={{
                      width: '100%',
                      accentColor: K.primary,
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              {/* Diet preference */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  Diet Preference
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {dietOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() =>
                        setDiet(
                          d.toLowerCase().replace(' & ', '-').replace(' ', '-'),
                        )
                      }
                      style={{
                        padding: '7px 14px',
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        border: `1.5px solid ${diet === d.toLowerCase().replace(' & ', '-').replace(' ', '-') ? K.primary : K.border}`,
                        background:
                          diet ===
                          d.toLowerCase().replace(' & ', '-').replace(' ', '-')
                            ? K.primarySoft
                            : '#fff',
                        color:
                          diet ===
                          d.toLowerCase().replace(' & ', '-').replace(' ', '-')
                            ? K.primary
                            : K.textSub,
                        cursor: 'pointer',
                        transition: 'all .15s',
                        fontFamily: 'inherit',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals to plan */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  Meals to Plan
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
                    <div
                      key={m}
                      onClick={() =>
                        setMeals((prev) => ({ ...prev, [m]: !prev[m] }))
                      }
                      style={{
                        border: `2px solid ${meals[m] ? K.primary : K.border}`,
                        background: meals[m] ? K.primarySoft : K.bgSoft,
                        borderRadius: 12,
                        padding: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all .15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          flexShrink: 0,
                          border: `2px solid ${meals[m] ? K.primary : K.border}`,
                          background: meals[m] ? K.primary : '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          transition: 'all .15s',
                        }}
                      >
                        {meals[m] && (
                          <Check size={12} color="#fff" strokeWidth={3.5} />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: K.text,
                          textTransform: 'capitalize',
                        }}
                      >
                        {m}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  Options
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  {(
                    [
                      {
                        key: 'respectExisting',
                        t: 'Keep my existing meals',
                        d: 'Only fill in empty slots in your week.',
                      },
                      {
                        key: 'preferPantry',
                        t: 'Prefer pantry ingredients',
                        d: 'Pick recipes that use what you already have.',
                      },
                      {
                        key: 'maxVariety',
                        t: 'Maximum variety',
                        d: 'No repeated recipes within the week.',
                      },
                    ] as const
                  ).map((tog) => (
                    <div
                      key={tog.key}
                      onClick={() =>
                        setToggles((prev) => ({
                          ...prev,
                          [tog.key]: !prev[tog.key],
                        }))
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '13px 16px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        background: toggles[tog.key] ? K.primarySoft : K.bgSoft,
                        border: `1px solid ${toggles[tog.key] ? K.primarySoft : K.border}`,
                        transition: 'all .15s',
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: K.text,
                          }}
                        >
                          {tog.t}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: K.textMuted,
                            fontWeight: 500,
                            marginTop: 2,
                          }}
                        >
                          {tog.d}
                        </div>
                      </div>
                      {/* Toggle switch */}
                      <div
                        style={{
                          width: 44,
                          height: 24,
                          borderRadius: 12,
                          flexShrink: 0,
                          position: 'relative',
                          background: toggles[tog.key] ? K.primary : K.border,
                          transition: 'background .2s',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: 3,
                            left: toggles[tog.key] ? 23 : 3,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#fff',
                            transition: 'left .2s',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  paddingTop: 4,
                }}
              >
                <KBtn variant="ghost" onClick={onClose}>
                  Cancel
                </KBtn>
                <KBtn variant="brand" onClick={handleGenerate}>
                  <Sparkles size={14} /> Generate Plan
                </KBtn>
              </div>
            </div>
          )}

          {/* ── STEP 2: GENERATING ── */}
          {step === 'generating' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #6c5ce7, #f582ae)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 8px 24px rgba(108,92,231,0.35)',
                  animation: 'spin 2s linear infinite',
                }}
              >
                <Sparkles size={32} color="#fff" />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: '0 0 6px',
                  color: K.text,
                  letterSpacing: '-0.02em',
                }}
              >
                Cooking up your plan...
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: K.textMuted,
                  margin: '0 0 24px',
                  fontWeight: 500,
                }}
              >
                Kira is balancing your macros and matching your taste.
              </p>
              <div
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {genLog.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 13.5,
                      color: l.done ? K.textMuted : K.text,
                      fontWeight: l.done ? 500 : 600,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        background: l.done ? K.leafSoft : K.primarySoft,
                        color: l.done ? K.leaf : K.primary,
                      }}
                    >
                      {l.done ? (
                        <Check size={11} strokeWidth={3} />
                      ) : (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: K.primary,
                            animation: 'pulse 1s infinite',
                          }}
                        />
                      )}
                    </div>
                    {l.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: DONE ── */}
          {step === 'done' && (
            <div>
              {/* Summary stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  marginBottom: 20,
                  padding: '16px',
                  background: K.primarySoft,
                  borderRadius: 16,
                }}
              >
                {[
                  { lbl: 'Days planned', val: '7' },
                  { lbl: 'Avg calories', val: `${calories} kcal` },
                  {
                    lbl: 'Meals added',
                    val: Object.values(meals).filter(Boolean).length * 7 + '',
                  },
                ].map((s) => (
                  <div key={s.lbl} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: K.primary,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: K.textMuted,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginTop: 2,
                      }}
                    >
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 10,
                }}
              >
                Your Week
              </div>

              {/* Preview days */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  marginBottom: 20,
                }}
              >
                {PLANNER_DAYS.slice(0, 4).map((d, _i) => (
                  <div
                    key={d.day}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: K.bgSoft,
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        fontSize: 11,
                        fontWeight: 700,
                        color: K.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        flexShrink: 0,
                      }}
                    >
                      {d.day.slice(0, 3)}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: 12.5,
                        color: K.text,
                        fontWeight: 600,
                      }}
                    >
                      {[
                        d.meals.breakfast?.name,
                        d.meals.lunch?.name,
                        d.meals.dinner?.name,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Rest day'}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: K.textMuted,
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {[
                        d.meals.breakfast?.cal ?? 0,
                        d.meals.lunch?.cal ?? 0,
                        d.meals.dinner?.cal ?? 0,
                      ].reduce((a, b) => a + b, 0)}{' '}
                      kcal
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: K.textMuted,
                    fontWeight: 500,
                    padding: '6px 0',
                  }}
                >
                  + 3 more days
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}
              >
                <KBtn variant="ghost" size="sm" onClick={reset}>
                  <RotateCcw size={13} /> Regenerate
                </KBtn>
                <KBtn variant="ghost" size="sm" onClick={onClose}>
                  Discard
                </KBtn>
                <KBtn variant="brand" onClick={handleApply}>
                  <Check size={14} /> Apply to my Week
                </KBtn>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modalUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}
type SelectedMeal = NonNullable<
  (typeof PLANNER_DAYS)[0]['meals']['breakfast']
> & {
  type?: 'breakfast' | 'lunch' | 'dinner'
  servings?: number
}

function PlannerView({ showToast }: { showToast: (m: string) => void }) {
  const [selectedMeal, setSelectedMeal] = useState<SelectedMeal | null>(null)
  const [autoPlanOpen, setAutoPlanOpen] = useState(false)

  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  const slotColors: Record<string, string> = {
    breakfast: K.gold,
    lunch: K.leaf,
    dinner: K.accent,
  }

  const totalStats = React.useMemo(() => {
    let cal = 0,
      pro = 0,
      crb = 0,
      fat = 0,
      count = 0
    PLANNER_DAYS.forEach((d) => {
      ;[d.meals.breakfast, d.meals.lunch, d.meals.dinner]
        .filter(Boolean)
        .forEach((m) => {
          if (m) {
            cal += m.cal
            pro += m.pro ?? 0
            crb += m.crb ?? 0
            fat += m.fat ?? 0
            count++
          }
        })
    })
    return { cal, pro, crb, fat, count }
  }, [])

  // Show recipe detail when a meal is clicked
  if (selectedMeal) {
    return (
      <div style={{ padding: 0 }}>
        <RecipeDetailPage
          meal={selectedMeal}
          onBack={() => setSelectedMeal(null)}
          showToast={showToast}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '8px 32px 40px' }}>
      <AutoPlanModal
        open={autoPlanOpen}
        onClose={() => setAutoPlanOpen(false)}
        showToast={showToast}
      />

      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: K.cardBg,
            border: `1px solid ${K.border}`,
            borderRadius: 12,
            padding: 4,
          }}
        >
          <button
            style={{
              width: 30,
              height: 30,
              background: 'transparent',
              border: 0,
              borderRadius: 8,
              color: K.textSub,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => showToast('Previous week')}
          >
            <ChevronLeft size={14} />
          </button>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              padding: '0 12px',
              letterSpacing: '-0.01em',
              color: K.text,
            }}
          >
            May 11 – May 17, 2026
          </span>
          <button
            style={{
              width: 30,
              height: 30,
              background: 'transparent',
              border: 0,
              borderRadius: 8,
              color: K.textSub,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => showToast('Next week')}
          >
            <ChevronRight size={14} />
          </button>
          <button
            style={{
              padding: '6px 14px',
              background: K.text,
              color: '#fff',
              border: 0,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onClick={() => showToast('Today')}
          >
            Today
          </button>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <KBtn
            variant="ghost"
            size="sm"
            onClick={() => showToast('Copying week...')}
          >
            <RotateCcw size={13} /> Copy week
          </KBtn>
          <KBtn
            variant="ghost"
            size="sm"
            onClick={() => showToast('Clearing week...')}
            style={{ color: K.accent }}
          >
            <Trash2 size={13} /> Clear week
          </KBtn>
          <KBtn
            variant="ghost"
            size="sm"
            onClick={() => showToast('Sharing plan...')}
          >
            <Share2 size={13} /> Share plan
          </KBtn>
          <KBtn variant="blue" size="sm" onClick={() => setAutoPlanOpen(true)}>
            <Sparkles size={13} /> Auto-plan with AI
          </KBtn>
        </div>
      </div>

      {/* ── Day strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 10,
          marginBottom: 22,
        }}
      >
        {PLANNER_DAYS.map((d) => {
          const isToday = d.date === '16'
          return (
            <div
              key={d.day}
              onClick={() => showToast(d.day)}
              style={{
                background: isToday ? K.text : K.cardBg,
                border: `1px solid ${isToday ? K.text : K.border}`,
                borderRadius: 14,
                padding: '12px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all .15s',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: isToday ? 'rgba(255,255,255,0.7)' : K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {d.day.slice(0, 3)}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: isToday ? '#fff' : K.text,
                  marginTop: 4,
                  letterSpacing: '-0.03em',
                }}
              >
                {d.date}
              </div>
              {Object.values(d.meals).some(Boolean) && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: isToday ? '#fff' : K.primary,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Nutrition summary ── */}
      <KCard
        style={{
          padding: '18px 24px',
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: K.goldSoft,
            color: '#b87a1c',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Award size={18} />
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: K.text }}>
            Weekly nutrition
          </div>
          <div style={{ fontSize: 12, color: K.textMuted, fontWeight: 500 }}>
            {totalStats.count} meals planned
          </div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {[
            { lbl: 'Calories', val: totalStats.cal.toLocaleString() },
            { lbl: 'Protein', val: totalStats.pro + 'g' },
            { lbl: 'Carbs', val: totalStats.crb + 'g' },
            { lbl: 'Fat', val: totalStats.fat + 'g' },
          ].map((s) => (
            <div key={s.lbl}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: K.text,
                  letterSpacing: '-0.02em',
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: K.textMuted,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </KCard>

      {/* ── Day blocks ── */}
      {PLANNER_DAYS.map((d, idx) => {
        const isToday = d.date === '16'
        const isTomorrow = d.date === '17'
        const allMeals = [
          d.meals.breakfast,
          d.meals.lunch,
          d.meals.dinner,
        ].filter(Boolean)
        if (allMeals.length === 0 && !isToday && !isTomorrow) return null
        const dayTotals = allMeals.reduce(
          (acc, m) => ({
            cal: acc.cal + (m?.cal ?? 0),
            pro: acc.pro + (m?.pro ?? 0),
          }),
          { cal: 0, pro: 0 },
        )
        return (
          <KCard key={d.day} style={{ padding: '24px 26px', marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                marginBottom: 18,
                flexWrap: 'wrap',
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '-0.02em',
                  color: K.text,
                }}
              >
                {dayNames[idx]}, May {d.date}
              </h3>
              {isToday && (
                <span
                  style={{
                    padding: '3px 10px',
                    background: K.text,
                    color: '#fff',
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  TODAY
                </span>
              )}
              {isTomorrow && (
                <span
                  style={{
                    padding: '3px 10px',
                    background: K.primarySoft,
                    color: K.primary,
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  TOMORROW
                </span>
              )}
              <div
                style={{
                  marginLeft: 'auto',
                  fontSize: 12,
                  color: K.textMuted,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                🔥 {dayTotals.cal} kcal
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: K.textLight,
                    display: 'inline-block',
                  }}
                />
                {dayTotals.pro}g protein
              </div>
            </div>

            {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => {
              const meal = d.meals[slot]
              return (
                <div
                  key={slot}
                  style={{ marginBottom: slot === 'dinner' ? 0 : 14 }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: K.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: slotColors[slot],
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    {slot}
                    <button
                      onClick={() => showToast('Add ' + slot)}
                      style={{
                        marginLeft: 'auto',
                        background: 'transparent',
                        border: 0,
                        color: K.primary,
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      + Add
                    </button>
                  </div>

                  {meal ? (
                    <div
                      onClick={() => setSelectedMeal({ ...meal, type: slot })}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '64px 1fr auto',
                        gap: 14,
                        alignItems: 'center',
                        padding: 12,
                        background: K.bgSoft,
                        borderRadius: 14,
                        transition: 'all .15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background =
                          K.border)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background =
                          K.bgSoft)
                      }
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 12,
                          overflow: 'hidden',
                          background: K.border,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={
                            meal.img ??
                            (idx % 2 === 0 ? FOOD_IMG_1 : FOOD_IMG_2)
                          }
                          alt={meal.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).src =
                              FOOD_IMG_1
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: K.text,
                            marginBottom: 4,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {meal.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: K.textMuted,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Clock size={11} />
                          {meal.time ?? 30} min
                          <span
                            style={{
                              width: 3,
                              height: 3,
                              borderRadius: '50%',
                              background: K.textLight,
                              display: 'inline-block',
                            }}
                          />
                          {meal.cal} cal
                          <span
                            style={{
                              width: 3,
                              height: 3,
                              borderRadius: '50%',
                              background: K.textLight,
                              display: 'inline-block',
                            }}
                          />
                          {meal.pro ?? 0}g protein
                        </div>
                      </div>
                      <div
                        style={{ display: 'flex', gap: 4 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setSelectedMeal({ ...meal, type: slot })
                          }
                          style={{
                            width: 30,
                            height: 30,
                            background: 'transparent',
                            border: 0,
                            borderRadius: 8,
                            color: K.textMuted,
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) =>
                            ((
                              e.currentTarget as HTMLButtonElement
                            ).style.background = K.cardBg)
                          }
                          onMouseLeave={(e) =>
                            ((
                              e.currentTarget as HTMLButtonElement
                            ).style.background = 'transparent')
                          }
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => showToast('Removed')}
                          style={{
                            width: 30,
                            height: 30,
                            background: 'transparent',
                            border: 0,
                            borderRadius: 8,
                            color: K.textMuted,
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            const b = e.currentTarget as HTMLButtonElement
                            b.style.background = K.accentSoft
                            b.style.color = K.accent
                          }}
                          onMouseLeave={(e) => {
                            const b = e.currentTarget as HTMLButtonElement
                            b.style.background = 'transparent'
                            b.style.color = K.textMuted
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => showToast('Choose a recipe for ' + slot)}
                      style={{
                        width: '100%',
                        padding: 14,
                        background: K.bgSoft,
                        border: `1px dashed ${K.border}`,
                        borderRadius: 14,
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: K.textMuted,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        transition: 'all .15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.background = '#fff'
                        b.style.borderColor = K.primary
                        b.style.color = K.primary
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.background = K.bgSoft
                        b.style.borderColor = K.border
                        b.style.color = K.textMuted
                      }}
                    >
                      <Plus size={13} /> Add {slot}
                    </button>
                  )}
                </div>
              )
            })}
          </KCard>
        )
      })}
    </div>
  )
}
// ─── Chef AI View (complete replacement) ──────────────────────────────────────
// When a popular meal plan card is clicked it opens a full DietDetailPage
// inline (no tab switch needed). The detail page matches the HTML reference
// exactly, using the Kira app K.* design tokens throughout.

// ── Inline diet data (keto / vegan / balanced / paleo) ──────────────────────
const CHEF_DIET_PLANS: Record<string, any> = {
  keto: {
    id: 'keto',
    name: 'Keto Diet',
    italic: 'Fat-Fueled Energy',
    longDesc:
      'Low-carb, high-satiety menu with balanced electrolytes and fiber so Keto is enjoyable and sustainable week after week.',
    benefits: ['High Fat Burning', 'Mental Clarity', 'Appetite Control'],
    whatIs:
      'The ketogenic diet is a high-fat, very-low-carb eating plan that shifts your body into ketosis, burning fat for fuel instead of glucose.',
    keyPoints: [
      {
        h: 'High Fat Intake',
        p: '70-75% of calories from healthy fats like avocado, olive oil, and nuts.',
      },
      {
        h: 'Very Low Carbs',
        p: 'Only 20-50g of carbs per day to maintain ketosis.',
      },
      {
        h: 'Ketosis State',
        p: 'Your body switches to burning fat for energy, improving focus and endurance.',
      },
    ],
    badge: { v: '75%', l: 'Fat Energy' },
    tableTitle: 'What Can You Eat on Keto?',
    tableLead:
      'The keto diet keeps net carbs under 20-50 g per day, shifting your body into fat-burning ketosis. Meals center on healthy fats and moderate protein while avoiding grains, sugar, and starchy vegetables.',
    table: [
      {
        food: 'Butter',
        serving: '1 tbsp (14 g)',
        carbs: '0 g',
        fat: '12 g',
        pro: '0 g',
      },
      {
        food: 'Coconut Oil',
        serving: '1 tbsp (14 g)',
        carbs: '0 g',
        fat: '14 g',
        pro: '0 g',
      },
      {
        food: 'Olive Oil',
        serving: '1 tbsp (14 g)',
        carbs: '0 g',
        fat: '14 g',
        pro: '0 g',
      },
      {
        food: 'Bacon',
        serving: '2 slices (30 g)',
        carbs: '0 g',
        fat: '10 g',
        pro: '9 g',
      },
      {
        food: 'Chicken Thigh',
        serving: '1 thigh (110 g)',
        carbs: '0 g',
        fat: '10 g',
        pro: '28 g',
      },
      {
        food: 'Ground Beef (80/20)',
        serving: '4 oz (113 g)',
        carbs: '0 g',
        fat: '23 g',
        pro: '20 g',
      },
      {
        food: 'Salmon',
        serving: '4 oz (113 g)',
        carbs: '0 g',
        fat: '12 g',
        pro: '23 g',
      },
      {
        food: 'Eggs',
        serving: '2 large',
        carbs: '1 g',
        fat: '10 g',
        pro: '12 g',
      },
      {
        food: 'Cheddar Cheese',
        serving: '1 oz (28 g)',
        carbs: '1 g',
        fat: '9 g',
        pro: '7 g',
      },
      {
        food: 'Avocado',
        serving: '1/2 medium',
        carbs: '2 g',
        fat: '15 g',
        pro: '2 g',
      },
      {
        food: 'Almonds',
        serving: '1 oz (28 g)',
        carbs: '3 g',
        fat: '14 g',
        pro: '6 g',
      },
      {
        food: 'Broccoli',
        serving: '1 cup (91 g)',
        carbs: '4 g',
        fat: '0 g',
        pro: '3 g',
      },
    ],
    bestFor: [
      {
        icon: '🧠',
        h: 'Mental Clarity Seekers',
        p: 'Many report sharper focus and stable energy once adapted — no more afternoon crashes.',
      },
      {
        icon: '⚖️',
        h: 'Rapid Fat Loss',
        p: 'Initial water weight drops fast, then steady fat loss follows. Highly motivating for quick visible results.',
      },
      {
        icon: '🩺',
        h: 'Insulin Resistance',
        p: 'Low carb dramatically lowers blood sugar and insulin levels — often recommended for pre-diabetes.',
      },
      {
        icon: '🥓',
        h: 'Fat-Lovers',
        p: 'Enjoy bacon, butter, cheese, and avocado without guilt. Keto makes high-fat eating the actual goal.',
      },
    ],
    eat: [
      'Fatty meats — ribeye, salmon, bacon, chicken thighs with skin',
      'Healthy fats — avocado, olive oil, coconut oil, butter, ghee',
      'Low-carb vegetables — spinach, kale, broccoli, zucchini, asparagus',
      'Full-fat dairy — cheese, heavy cream, sour cream, cream cheese',
      'Eggs — whole eggs cooked any style, a keto staple',
      'Nuts and seeds — macadamia, pecans, walnuts, chia, flax (in moderation)',
    ],
    avoid: [
      'Grains and starches — bread, pasta, rice, oats, cereal',
      'Sugar in all forms — candy, soda, juice, honey, maple syrup',
      'Most fruits — bananas, apples, oranges, grapes (berries in small amounts OK)',
      'Root vegetables — potatoes, sweet potatoes, carrots, beets',
      'Low-fat diet products — often loaded with sugar to replace fat',
      'Beer and sweet cocktails — high in carbs; dry wine and spirits are better options',
    ],
    howWorks: 'Switch your body from burning carbs to burning fat for fuel.',
    img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80',
  },
  vegan: {
    id: 'vegan',
    name: 'Vegan Diet',
    italic: 'Pure Plant Power',
    longDesc:
      '100% plant-based eating with smart protein combining from legumes, grains, nuts, seeds, and tofu — satisfying, ethical, and nutrient-complete.',
    benefits: ['Plant Power', 'Heart Health', 'High Fiber'],
    whatIs:
      'A vegan diet excludes all animal products — meat, fish, dairy, eggs, and honey. Smart planning ensures complete nutrition from plant sources.',
    keyPoints: [
      {
        h: 'Complete Proteins',
        p: 'Combine legumes + grains (rice & beans, hummus & pita) to cover all essential amino acids.',
      },
      {
        h: 'B12 & Iron',
        p: 'Supplement B12 and focus on fortified foods, legumes, and leafy greens for iron.',
      },
      {
        h: 'Healthy Fats',
        p: 'Get omega-3s from flaxseed, chia, hemp, and walnuts; DHA/EPA from algae oil.',
      },
    ],
    badge: { v: '100%', l: 'Plant-Based' },
    tableTitle: 'What Can You Eat on a Vegan Diet?',
    tableLead:
      'Everything from the plant kingdom is on the table. Focus on these high-protein, nutrient-dense picks.',
    table: [
      {
        food: 'Tofu, firm',
        serving: '1/2 cup',
        carbs: '2 g',
        fat: '5 g',
        pro: '10 g',
      },
      {
        food: 'Tempeh',
        serving: '1/2 cup',
        carbs: '8 g',
        fat: '9 g',
        pro: '16 g',
      },
      {
        food: 'Lentils',
        serving: '1/2 cup',
        carbs: '20 g',
        fat: '0 g',
        pro: '9 g',
      },
      {
        food: 'Chickpeas',
        serving: '1/2 cup',
        carbs: '22 g',
        fat: '2 g',
        pro: '7 g',
      },
      {
        food: 'Edamame',
        serving: '1/2 cup',
        carbs: '10 g',
        fat: '4 g',
        pro: '9 g',
      },
      {
        food: 'Quinoa',
        serving: '1/2 cup',
        carbs: '20 g',
        fat: '2 g',
        pro: '4 g',
      },
      {
        food: 'Hemp Seeds',
        serving: '3 tbsp',
        carbs: '2 g',
        fat: '14 g',
        pro: '10 g',
      },
      {
        food: 'Pumpkin Seeds',
        serving: '1 oz',
        carbs: '4 g',
        fat: '13 g',
        pro: '8 g',
      },
      {
        food: 'Oats',
        serving: '1/2 cup',
        carbs: '27 g',
        fat: '3 g',
        pro: '5 g',
      },
      {
        food: 'Almonds',
        serving: '1 oz',
        carbs: '6 g',
        fat: '14 g',
        pro: '6 g',
      },
      {
        food: 'Nutritional Yeast',
        serving: '2 tbsp',
        carbs: '4 g',
        fat: '0 g',
        pro: '8 g',
      },
      {
        food: 'Black Beans',
        serving: '1/2 cup',
        carbs: '20 g',
        fat: '0 g',
        pro: '8 g',
      },
    ],
    bestFor: [
      {
        icon: '🌱',
        h: 'Animal Welfare',
        p: 'The most impactful dietary choice for reducing animal suffering and factory farming.',
      },
      {
        icon: '🌍',
        h: 'Planet-Conscious',
        p: 'Plant-based diets have the lowest carbon, water, and land footprint of any diet.',
      },
      {
        icon: '❤️',
        h: 'Heart Health',
        p: 'Whole-food vegan diets dramatically lower LDL cholesterol and blood pressure.',
      },
      {
        icon: '🔋',
        h: 'High Energy',
        p: 'Carb-rich plant foods fuel endurance athletes and keep energy steady all day.',
      },
    ],
    eat: [
      'Legumes — lentils, chickpeas, black beans, kidney beans, edamame',
      'Whole grains — quinoa, oats, brown rice, whole wheat, farro',
      'Tofu & tempeh — versatile complete proteins',
      'Vegetables — every color, raw and cooked',
      'Fruits — fresh and frozen, all varieties',
      'Nuts & seeds — almonds, walnuts, hemp, chia, flax, pumpkin',
      'Plant milks — soy, oat, almond, cashew (choose fortified)',
    ],
    avoid: [
      'Meat — all red meat, poultry, game',
      'Fish & seafood — all types',
      'Dairy — milk, cheese, yogurt, butter, ghee, whey',
      'Eggs — in all forms including in baked goods',
      'Honey & bee products — beeswax, royal jelly',
      'Hidden animal products — gelatin, casein, lanolin',
    ],
    howWorks:
      'Replace all animal products with plant-based whole foods, prioritizing protein combining and B12 supplementation.',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
  bal: {
    id: 'bal',
    name: 'Balanced Diet',
    italic: 'Everyday Eating',
    longDesc:
      'No foods off limits. A classic balanced plate — lean protein, complex carbs, healthy fats, and plenty of vegetables — made easy for everyday life.',
    benefits: ['Sustainable Long-Term', 'All Food Groups', 'Easy to Follow'],
    whatIs:
      'A balanced diet provides all essential macronutrients and micronutrients in roughly equal proportions, without eliminating any food group.',
    keyPoints: [
      {
        h: 'The Plate Method',
        p: 'Half your plate vegetables, a quarter protein, a quarter complex carbs — simple and repeatable.',
      },
      {
        h: 'Variety Wins',
        p: 'Rotate proteins, grains, and produce weekly to cover all micronutrients effortlessly.',
      },
      {
        h: 'Moderation, Not Restriction',
        p: 'No foods are banned. Small treats fit within a balanced plan without guilt.',
      },
    ],
    badge: { v: '2000', l: 'kcal avg/day' },
    tableTitle: 'Balanced Diet Building Blocks',
    tableLead:
      'Mix proteins, carbs, and fats at each meal. These are the most versatile, everyday-friendly options.',
    table: [
      {
        food: 'Chicken Breast',
        serving: '4 oz',
        carbs: '0 g',
        fat: '4 g',
        pro: '31 g',
      },
      {
        food: 'Brown Rice',
        serving: '1/2 cup',
        carbs: '22 g',
        fat: '1 g',
        pro: '3 g',
      },
      {
        food: 'Eggs',
        serving: '2 large',
        carbs: '1 g',
        fat: '10 g',
        pro: '12 g',
      },
      {
        food: 'Sweet Potato',
        serving: '1 medium',
        carbs: '24 g',
        fat: '0 g',
        pro: '2 g',
      },
      {
        food: 'Greek Yogurt',
        serving: '1 cup',
        carbs: '9 g',
        fat: '0 g',
        pro: '17 g',
      },
      {
        food: 'Salmon',
        serving: '4 oz',
        carbs: '0 g',
        fat: '12 g',
        pro: '23 g',
      },
      {
        food: 'Broccoli',
        serving: '1 cup',
        carbs: '6 g',
        fat: '0 g',
        pro: '3 g',
      },
      {
        food: 'Avocado',
        serving: '1/2 medium',
        carbs: '4 g',
        fat: '15 g',
        pro: '2 g',
      },
      {
        food: 'Quinoa',
        serving: '1/2 cup',
        carbs: '20 g',
        fat: '2 g',
        pro: '4 g',
      },
      {
        food: 'Almonds',
        serving: '1 oz',
        carbs: '6 g',
        fat: '14 g',
        pro: '6 g',
      },
      {
        food: 'Banana',
        serving: '1 medium',
        carbs: '27 g',
        fat: '0 g',
        pro: '1 g',
      },
      {
        food: 'Olive Oil',
        serving: '1 tbsp',
        carbs: '0 g',
        fat: '14 g',
        pro: '0 g',
      },
    ],
    bestFor: [
      {
        icon: '🏃',
        h: 'Active Lifestyles',
        p: 'Provides energy for exercise without restricting any food group.',
      },
      {
        icon: '👨‍👩‍👧',
        h: 'Families',
        p: 'No special rules — the whole family eats the same meals.',
      },
      {
        icon: '🌍',
        h: 'Beginners',
        p: 'The most sustainable starting point for anyone new to healthy eating.',
      },
      {
        icon: '⚖️',
        h: 'Weight Maintenance',
        p: 'Predictable calories make it easy to maintain a healthy weight long-term.',
      },
    ],
    eat: [
      'Lean proteins — chicken, turkey, fish, eggs, legumes',
      'Complex carbs — brown rice, oats, sweet potato, whole wheat bread',
      'Healthy fats — olive oil, avocado, nuts, seeds',
      'Dairy — Greek yogurt, cheese, milk in moderation',
      'Vegetables — aim for half your plate every meal',
      'Fruit — 1-2 servings daily, any variety',
    ],
    avoid: [
      'Ultra-processed foods — fast food, packaged snacks in excess',
      'Added sugar in excess — sweets, sugary drinks daily',
      'Refined grains as the majority — white bread, pasta every meal',
      'Trans fats — partially hydrogenated oils (mostly in packaged food)',
      'Alcohol in excess — more than 1-2 drinks per day long-term',
    ],
    howWorks:
      'Fill half your plate with vegetables, a quarter with protein, and a quarter with complex carbs — every meal.',
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  },
  paleo: {
    id: 'paleo',
    name: 'Paleo Diet',
    italic: 'Real Foods Only',
    longDesc:
      'Eat like our hunter-gatherer ancestors — meat, fish, vegetables, fruit, nuts, and seeds. No grains, legumes, or processed food.',
    benefits: ['Anti-Inflammatory', 'Stable Energy', 'Gut Health'],
    whatIs:
      'The paleo diet returns to whole, unprocessed foods that pre-date agriculture: meat, fish, eggs, vegetables, fruit, nuts, and seeds.',
    keyPoints: [
      {
        h: 'Real Whole Foods',
        p: 'If it was not alive or growing 10,000 years ago, skip it. No packages, no additives.',
      },
      {
        h: 'No Grains or Legumes',
        p: 'Wheat, rice, beans, and lentils are excluded — they were not part of the ancestral diet.',
      },
      {
        h: 'High-Quality Proteins',
        p: 'Grass-fed beef, wild-caught fish, and pasture-raised eggs are the gold standard.',
      },
    ],
    badge: { v: '0', l: 'Processed Foods' },
    tableTitle: 'Paleo Approved Foods',
    tableLead:
      'Anything our ancestors could have hunted, fished, gathered, or foraged. Whole, unprocessed, nutrient-dense.',
    table: [
      {
        food: 'Grass-Fed Beef',
        serving: '4 oz',
        carbs: '0 g',
        fat: '10 g',
        pro: '26 g',
      },
      {
        food: 'Wild Salmon',
        serving: '4 oz',
        carbs: '0 g',
        fat: '12 g',
        pro: '23 g',
      },
      {
        food: 'Pasture Eggs',
        serving: '2 large',
        carbs: '1 g',
        fat: '10 g',
        pro: '12 g',
      },
      {
        food: 'Sweet Potato',
        serving: '1 medium',
        carbs: '24 g',
        fat: '0 g',
        pro: '2 g',
      },
      {
        food: 'Avocado',
        serving: '1/2 medium',
        carbs: '4 g',
        fat: '15 g',
        pro: '2 g',
      },
      {
        food: 'Almonds',
        serving: '1 oz',
        carbs: '6 g',
        fat: '14 g',
        pro: '6 g',
      },
      {
        food: 'Walnuts',
        serving: '1 oz',
        carbs: '4 g',
        fat: '18 g',
        pro: '4 g',
      },
      {
        food: 'Blueberries',
        serving: '1 cup',
        carbs: '21 g',
        fat: '0 g',
        pro: '1 g',
      },
      {
        food: 'Broccoli',
        serving: '1 cup',
        carbs: '6 g',
        fat: '0 g',
        pro: '3 g',
      },
      {
        food: 'Spinach',
        serving: '2 cups',
        carbs: '2 g',
        fat: '0 g',
        pro: '2 g',
      },
      {
        food: 'Coconut Oil',
        serving: '1 tbsp',
        carbs: '0 g',
        fat: '14 g',
        pro: '0 g',
      },
      { food: 'Bison', serving: '4 oz', carbs: '0 g', fat: '7 g', pro: '28 g' },
    ],
    bestFor: [
      {
        icon: '🔥',
        h: 'Anti-Inflammatory',
        p: 'Removing grains, legumes, and processed foods dramatically reduces systemic inflammation.',
      },
      {
        icon: '💪',
        h: 'Athletes',
        p: 'High-quality proteins and fats support performance and recovery without processed carbs.',
      },
      {
        icon: '🧬',
        h: 'Autoimmune Conditions',
        p: 'Eliminating potential gut irritants often reduces symptoms of autoimmune and digestive disorders.',
      },
      {
        icon: '🍖',
        h: 'Meat Lovers',
        p: 'Unlimited grass-fed beef, lamb, bison, and wild-caught fish — no calorie counting.',
      },
    ],
    eat: [
      'Meats — grass-fed beef, bison, lamb, pork, venison',
      'Poultry — pasture-raised chicken, turkey, duck',
      'Fish & seafood — wild-caught salmon, sardines, shrimp, cod',
      'Eggs — pasture-raised whole eggs',
      'Vegetables — all non-starchy veg; sweet potato and squash in moderation',
      'Fruits — all whole fruits; berries are the best choice',
      'Nuts & seeds — almonds, walnuts, macadamia, pecans, sunflower',
      'Healthy fats — coconut oil, olive oil, avocado, ghee',
    ],
    avoid: [
      'Grains — wheat, rice, oats, corn, barley, rye',
      'Legumes — beans, lentils, peanuts, soy',
      'Dairy — milk, cheese, yogurt, butter (some allow ghee)',
      'Refined sugar — candy, soda, baked goods, agave',
      'Processed foods — anything in a package with additives',
      'Vegetable oils — canola, soybean, corn, sunflower, safflower',
    ],
    howWorks:
      'Eat only whole foods that existed before agriculture: meat, fish, eggs, vegetables, fruit, nuts, and seeds.',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
  },
}

// ── Diet Detail Page (inline, matches HTML reference) ───────────────────────
function ChefDietDetailPage({
  plan,
  onBack,
  showToast,
}: {
  plan: any
  onBack: () => void
  showToast: (m: string) => void
}) {
  const forestGreen = '#1b5e3f'
  const forestSoft = 'rgba(27,94,63,0.08)'

  const renderEatItem = (item: string) => {
    const parts = item.split(' — ')
    if (parts.length === 2)
      return (
        <>
          <strong style={{ color: K.text, fontWeight: 800 }}>{parts[0]}</strong>
          {' — '}
          {parts[1]}
        </>
      )
    return item
  }

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px 80px' }}>
        {/* ── Back button ── */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13.5,
            fontWeight: 600,
            color: K.textMuted,
            background: 'transparent',
            border: 0,
            padding: '16px 0 20px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = forestGreen)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = K.textMuted)
          }
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Back to Chef Kira
        </button>

        {/* ── Hero ── */}
        <div
          style={{
            textAlign: 'center',
            padding: '16px 32px 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* BG glow */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: '8%',
              width: 380,
              height: 380,
              background:
                'radial-gradient(circle, rgba(108,92,231,0.16), transparent 65%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 720,
              margin: '0 auto',
            }}
          >
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                margin: '0 0 8px',
                color: K.text,
              }}
            >
              {plan.name.replace(' Diet', '').replace(' Meal Plan', '')} Meal
              Plan
              <em
                style={{
                  display: 'block',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: 8,
                  letterSpacing: '-0.03em',
                  fontSize: 44,
                }}
              >
                {plan.italic}
              </em>
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                color: K.textMuted,
                maxWidth: 520,
                margin: '22px auto 32px',
                fontWeight: 500,
              }}
            >
              {plan.longDesc}
            </p>
            <div
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() =>
                  showToast(`Creating your ${plan.name.split(' ')[0]} plan...`)
                }
                style={{
                  padding: '16px 28px',
                  background: K.gradBrand,
                  color: 'white',
                  border: 0,
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 18px rgba(108,92,231,0.3)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.transform =
                    'translateY(-1px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 10px 24px rgba(108,92,231,0.4)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 6px 18px rgba(108,92,231,0.3)'
                }}
              >
                Create My {plan.name.split(' ')[0]} Plan
              </button>
              <button
                onClick={() => showToast('Loading sample menu...')}
                style={{
                  padding: '16px 28px',
                  background: 'white',
                  color: K.text,
                  border: `1.5px solid ${K.borderMid}`,
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                    forestGreen
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    forestGreen
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                    K.borderMid
                  ;(e.currentTarget as HTMLButtonElement).style.color = K.text
                }}
              >
                View Sample Menu
              </button>
            </div>
          </div>
        </div>

        {/* ── Benefits strip ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            padding: '22px 32px',
            borderTop: `1px solid ${K.border}`,
            borderBottom: `1px solid ${K.border}`,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            flexWrap: 'wrap',
            marginBottom: 48,
          }}
        >
          {plan.benefits.map((b: string) => (
            <div
              key={b}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14.5,
                fontWeight: 600,
                color: K.textSub,
              }}
            >
              <Check size={18} color={forestGreen} strokeWidth={2.5} />
              {b}
            </div>
          ))}
        </div>

        {/* ── Image + What is ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
            marginBottom: 56,
          }}
        >
          {/* Image with badge */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(34,18,64,0.08)',
            }}
          >
            <img
              src={plan.img}
              alt={plan.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            {/* Badge overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                background: 'white',
                padding: '12px 18px',
                borderRadius: 14,
                boxShadow: '0 4px 16px rgba(34,18,64,0.12)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: forestGreen,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {plan.badge.v}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: 4,
                }}
              >
                {plan.badge.l}
              </div>
            </div>
          </div>

          {/* Text content */}
          <div>
            <h2
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '0 0 14px',
                color: K.text,
                lineHeight: 1.15,
              }}
            >
              What is the {plan.name.split(' ')[0]} Diet?
            </h2>
            <p
              style={{
                fontSize: 15,
                color: K.textMuted,
                lineHeight: 1.65,
                margin: '0 0 20px',
                fontWeight: 500,
              }}
            >
              {plan.whatIs}
            </p>
            {plan.keyPoints.map((kp: any) => (
              <div key={kp.h} style={{ marginBottom: 14 }}>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    margin: '0 0 6px',
                    color: K.text,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {kp.h}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: K.textMuted,
                    margin: 0,
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {kp.p}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Food table ── */}
        <div style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              color: K.text,
            }}
          >
            {plan.tableTitle}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: K.textMuted,
              margin: '0 0 22px',
              lineHeight: 1.6,
              fontWeight: 500,
              maxWidth: 720,
            }}
          >
            {plan.tableLead}
          </p>
          <div
            style={{
              background: 'rgba(247,245,252,0.9)',
              border: `1px solid ${K.border}`,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(244,241,251,0.95)' }}>
                  {['Food', 'Serving', 'Net Carbs', 'Fat', 'Protein'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '14px 22px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: K.textSub,
                          borderBottom: `1px solid ${K.border}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {plan.table.map((row: any, i: number) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < plan.table.length - 1
                          ? `1px solid ${K.border}`
                          : 'none',
                    }}
                  >
                    <td
                      style={{
                        padding: '13px 22px',
                        fontWeight: 600,
                        color: K.text,
                      }}
                    >
                      {row.food}
                    </td>
                    <td
                      style={{
                        padding: '13px 22px',
                        color: K.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      {row.serving}
                    </td>
                    <td
                      style={{
                        padding: '13px 22px',
                        color: forestGreen,
                        fontWeight: 700,
                      }}
                    >
                      {row.carbs}
                    </td>
                    <td
                      style={{
                        padding: '13px 22px',
                        color: K.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      {row.fat}
                    </td>
                    <td
                      style={{
                        padding: '13px 22px',
                        color: K.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Sample 7-Day Menu placeholder ── */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              color: K.text,
            }}
          >
            Sample 7-Day Menu
          </h2>
          <p
            style={{
              fontSize: 15,
              color: K.textMuted,
              fontWeight: 500,
              margin: 0,
            }}
          >
            See how satisfying and varied your week can be on the {plan.name}.
          </p>
          <div
            style={{
              marginTop: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 10,
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div
                key={d}
                onClick={() => showToast(`Loading ${d} meal plan...`)}
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  border: `1px solid ${K.border}`,
                  borderRadius: 14,
                  padding: '14px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background =
                    K.primarySoft
                  ;(e.currentTarget as HTMLDivElement).style.borderColor =
                    K.primary
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background =
                    'rgba(255,255,255,0.82)'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor =
                    K.border
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.textMuted,
                    marginBottom: 6,
                  }}
                >
                  {d}
                </div>
                <div style={{ fontSize: 18 }}>🍽️</div>
                <div
                  style={{
                    fontSize: 10,
                    color: K.textMuted,
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  3 meals
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Who is it for ── */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              color: K.text,
            }}
          >
            Who is the {plan.name.split(' ')[0]} Diet For?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: K.textMuted,
              margin: '0 0 28px',
              fontWeight: 500,
              maxWidth: 560,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {plan.name} works best for people who thrive on structure and the
            specific benefits below.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 18,
              textAlign: 'left',
            }}
          >
            {plan.bestFor.map((b: any) => (
              <div
                key={b.h}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: `1px solid ${K.border}`,
                  borderRadius: 22,
                  padding: '28px 22px 24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: 'white',
                    borderRadius: 16,
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                    fontSize: 28,
                    boxShadow: '0 2px 8px rgba(34,18,64,0.06)',
                  }}
                >
                  {b.icon}
                </div>
                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    margin: '0 0 8px',
                    color: K.text,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {b.h}
                </h4>
                <p
                  style={{
                    fontSize: 13,
                    color: K.textMuted,
                    lineHeight: 1.55,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {b.p}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── What to Eat & Avoid ── */}
        <div style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              color: K.text,
              textAlign: 'center',
            }}
          >
            What to Eat &amp; What to Avoid
          </h2>
          <p
            style={{
              fontSize: 15,
              color: K.textMuted,
              margin: '0 0 28px',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            The simple rules that make this diet work.
          </p>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}
          >
            {/* Eat */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 17,
                  fontWeight: 800,
                  color: K.text,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: forestSoft,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Check size={14} color={forestGreen} strokeWidth={3} />
                </div>
                Approved Foods
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.eat.map((item: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      position: 'relative',
                      padding: '8px 0 8px 18px',
                      fontSize: 14.5,
                      color: K.textSub,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 17,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: forestGreen,
                        display: 'inline-block',
                      }}
                    />
                    {renderEatItem(item)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 17,
                  fontWeight: 800,
                  color: K.text,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#fce4ea',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <X size={14} color="#d2528a" strokeWidth={3} />
                </div>
                Foods to Avoid
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.avoid.map((item: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      position: 'relative',
                      padding: '8px 0 8px 18px',
                      fontSize: 14.5,
                      color: K.textSub,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 17,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#d2528a',
                        display: 'inline-block',
                      }}
                    />
                    {renderEatItem(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── How it works CTA ── */}
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              color: K.text,
            }}
          >
            How the {plan.name.split(' ')[0]} Diet Works
          </h2>
          <p
            style={{
              fontSize: 15,
              color: K.textMuted,
              margin: '0 auto 28px',
              fontWeight: 500,
              maxWidth: 480,
              lineHeight: 1.65,
            }}
          >
            {plan.howWorks}
          </p>
          <button
            onClick={() => showToast(`Starting ${plan.name} plan...`)}
            style={{
              padding: '16px 36px',
              background: K.gradBrand,
              color: 'white',
              border: 0,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 8px 24px rgba(108,92,231,0.35)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                'translateY(-2px)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 14px 32px rgba(108,92,231,0.45)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = ''
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 8px 24px rgba(108,92,231,0.35)'
            }}
          >
            Start {plan.name.split(' ')[0]} Plan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Complete ChefView ────────────────────────────────────────────────────────
function ChefView({ showToast }: { showToast: (m: string) => void }) {
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string; loading?: boolean }[]
  >([])
  const [input, setInput] = useState('')
  const [prefs, setPrefs] = useState({ servings: 2, diet: 'Pescatarian' })
  const [prefOpen, setPrefOpen] = useState(false)
  const [activeDietPlan, setActiveDietPlan] = useState<any>(null)
  const streamRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    'Create a meal plan',
    'Create a recipe',
    'Organise my saved recipes',
    "What's in my pantry?",
    'Help me use up my leftovers',
  ]

  const aiReplies = [
    "Here's a quick high-protein dinner idea: **Lemon Herb Salmon with Roasted Asparagus** — 480 cal, 44g protein, ready in 25 min. I can give you the full recipe!",
    'With chicken and quinoa you can make a **Mediterranean Power Bowl** — 540 cal, 42g protein. Add some cherry tomatoes, feta and olives for the full effect.',
    'For a low-carb breakfast under 400 cal, try **Avocado Toast with Poached Eggs** — 380 cal, 18g protein. Simple, satisfying and ready in 15 minutes.',
    "I'll plan a full week of meal prep for you! Starting with: Sunday batch-cook quinoa, roast chicken thighs and prep overnight oats for Mon–Wed.",
  ]

  function sendMessage(overrideInput?: string) {
    const userMsg = (overrideInput ?? input).trim()
    if (!userMsg) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', loading: true, text: '' }])
      setTimeout(() => {
        const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)]
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { role: 'ai', text: reply } : m,
          ),
        )
      }, 1800)
    }, 300)
  }

  useEffect(() => {
    if (streamRef.current)
      streamRef.current.scrollTop = streamRef.current.scrollHeight
  }, [messages])

  const popularPlans = [
    {
      id: 'keto',
      name: 'Keto',
      desc: 'High fat, low carb',
      cal: '1800 kcal',
      img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80',
    },
    {
      id: 'vegan',
      name: 'Vegan',
      desc: '100% plant based',
      cal: '1900 kcal',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    },
    {
      id: 'bal',
      name: 'Balanced',
      desc: 'Everything in moderation',
      cal: '2000 kcal',
      img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
    },
    {
      id: 'paleo',
      name: 'Paleo',
      desc: 'Whole foods only',
      cal: '2100 kcal',
      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
    },
  ]

  const hasMessages = messages.length > 0

  // ── If a diet detail is open show it full-screen ─────────────────────────
  if (activeDietPlan) {
    return (
      <ChefDietDetailPage
        plan={activeDietPlan}
        onBack={() => setActiveDietPlan(null)}
        showToast={showToast}
      />
    )
  }

  // ── Normal Chef view ─────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Top bar — only when chatting */}
      {hasMessages && (
        <div
          style={{
            padding: '16px 32px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            borderBottom: `1px solid ${K.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: K.gradBrand,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              boxShadow: '0 6px 18px rgba(108,92,231,0.35)',
            }}
          >
            <ChefHat size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: '0 0 2px',
                letterSpacing: '-0.02em',
                color: K.text,
              }}
            >
              Chef Kira
            </h2>
            <p
              style={{
                fontSize: 13,
                color: K.textMuted,
                margin: 0,
                fontWeight: 500,
              }}
            >
              Your personal AI chef · {prefs.diet} · {prefs.servings} servings
            </p>
          </div>
          <button
            onClick={() => setPrefOpen(true)}
            style={{
              width: 38,
              height: 38,
              background: K.cardBg,
              border: `1px solid ${K.border}`,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Filter size={16} color={K.textSub} />
          </button>
        </div>
      )}

      {/* Pref chips — only when chatting */}
      {hasMessages && (
        <div
          style={{
            padding: '14px 32px',
            display: 'flex',
            gap: 8,
            borderBottom: `1px solid ${K.border}`,
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          {[
            prefs.diet,
            `${prefs.servings} servings`,
            'Quick meals',
            'High protein',
          ].map((c) => (
            <span
              key={c}
              style={{
                padding: '6px 14px',
                background: K.leafSoft,
                color: K.leaf,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Scrollable area */}
      <div
        ref={streamRef}
        style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}
      >
        {/* ══ EMPTY STATE ══ */}
        {!hasMessages && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
              paddingBottom: 32,
              paddingTop: 40,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: '#fff',
                border: `1px solid ${K.border}`,
                boxShadow: '0 4px 16px rgba(34,18,64,0.08)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 20,
              }}
            >
              <ChefHat size={36} color={K.primary} />
            </div>

            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                margin: '0 0 10px',
                color: K.text,
                textAlign: 'center',
              }}
            >
              Hey Kobe, I'm{' '}
              <span
                style={{
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Chef Kira!
              </span>
            </h1>
            <p
              style={{
                color: K.textMuted,
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 auto 28px',
                maxWidth: 460,
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              I can help you find recipes, create new ones, plan your meals, and
              manage your pantry, cookbooks and shopping list.
            </p>

            {/* Suggestion chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
                marginBottom: 36,
                maxWidth: 560,
              }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '9px 18px',
                    background: '#fff',
                    border: `1px solid ${K.border}`,
                    borderRadius: 999,
                    fontSize: 13,
                    color: K.textSub,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      K.primary
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.primary
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      K.border
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.textSub
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Composer (empty state) */}
            <div style={{ width: '100%', maxWidth: 580, marginBottom: 48 }}>
              <div
                style={{
                  background: '#fff',
                  border: `1.5px solid ${K.borderMid}`,
                  borderRadius: 20,
                  padding: '14px 14px 14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 4px 20px rgba(34,18,64,0.07)',
                }}
              >
                <button
                  style={{
                    background: 'transparent',
                    border: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    color: K.textMuted,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Paperclip size={17} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !e.shiftKey && sendMessage()
                  }
                  placeholder="Ask Chef Kira about recipes, cooking tips, ingredients..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 0,
                    outline: 0,
                    fontSize: 14,
                    color: K.text,
                    fontFamily: 'inherit',
                    fontWeight: 500,
                  }}
                />
                <button
                  style={{
                    background: 'transparent',
                    border: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    color: K.textMuted,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Mic size={17} />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: 0,
                    background: input.trim()
                      ? K.gradBrand
                      : 'rgba(17,24,39,0.08)',
                    color: input.trim() ? '#fff' : K.textLight,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                    boxShadow: input.trim()
                      ? '0 4px 14px rgba(108,92,231,0.4)'
                      : 'none',
                  }}
                >
                  <Send size={17} />
                </button>
              </div>
            </div>

            {/* Popular plans — cards open the full diet detail page */}
            <div style={{ width: '100%', maxWidth: 720 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: K.text,
                    margin: '0 0 6px',
                  }}
                >
                  Popular AI meal plans
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: K.textMuted,
                    maxWidth: 400,
                    margin: '0 auto',
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  Our AI personalizes every plan to your exact calorie and macro
                  targets. Pick a style to get started.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                }}
              >
                {popularPlans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      const plan = CHEF_DIET_PLANS[p.id]
                      if (plan) setActiveDietPlan(plan)
                      else showToast(`Loading ${p.name} plan...`)
                    }}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/5',
                      borderRadius: 16,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.transform =
                        'translateY(-4px)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.transform = '')
                    }
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.82) 100%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 14,
                        right: 14,
                        bottom: 16,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: '#fff',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.2,
                          marginBottom: 3,
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'rgba(255,255,255,0.75)',
                          marginBottom: 8,
                        }}
                      >
                        {p.desc}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 600,
                          }}
                        >
                          {p.cal}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          View Plan <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <KBtn
                  variant="brand"
                  size="lg"
                  onClick={() =>
                    showToast('Creating your personalized plan...')
                  }
                >
                  <Sparkles size={14} /> Create Your Plan
                </KBtn>
              </div>
            </div>
          </div>
        )}

        {/* ══ CHAT MESSAGES ══ */}
        {hasMessages && (
          <div style={{ paddingTop: 24, paddingBottom: 16 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: 720,
                  margin: '0 auto 18px',
                  display: 'flex',
                  gap: 12,
                  width: '100%',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {m.role === 'ai' && (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: K.gradBrand,
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ChefHat size={16} />
                  </div>
                )}
                <div
                  style={{
                    background: m.role === 'user' ? K.text : '#fff',
                    color: m.role === 'user' ? '#fff' : K.textSub,
                    borderRadius:
                      m.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '4px 16px 16px 16px',
                    padding: '11px 15px',
                    maxWidth: '75%',
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    border: m.role === 'ai' ? `1px solid ${K.border}` : 'none',
                  }}
                >
                  {m.loading ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        gap: 4,
                        alignItems: 'center',
                        height: '1em',
                      }}
                    >
                      {[0, 0.15, 0.3].map((d, j) => (
                        <span
                          key={j}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: K.primary,
                            display: 'inline-block',
                            animation: `bounce 1.2s ${d}s infinite`,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom composer — only when chatting */}
      {hasMessages && (
        <div style={{ padding: '16px 32px 24px', flexShrink: 0 }}>
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              background: '#fff',
              border: `1.5px solid ${K.borderMid}`,
              borderRadius: 24,
              padding: '14px 14px 14px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 20px rgba(34,18,64,0.07)',
            }}
          >
            <button
              style={{
                background: 'transparent',
                border: 0,
                width: 36,
                height: 36,
                borderRadius: 10,
                color: K.textMuted,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Paperclip size={17} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && sendMessage()
              }
              placeholder="Ask Chef Kira anything about food & nutrition..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 0,
                outline: 0,
                fontSize: 14,
                color: K.text,
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
            />
            <button
              style={{
                background: 'transparent',
                border: 0,
                width: 36,
                height: 36,
                borderRadius: 10,
                color: K.textMuted,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Mic size={17} />
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                border: 0,
                background: input.trim() ? K.gradBrand : 'rgba(17,24,39,0.08)',
                color: input.trim() ? '#fff' : K.textLight,
                display: 'grid',
                placeItems: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                flexShrink: 0,
                boxShadow: input.trim()
                  ? '0 4px 14px rgba(108,92,231,0.4)'
                  : 'none',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Prefs modal */}
      <KModal
        open={prefOpen}
        onClose={() => setPrefOpen(false)}
        title="Chef preferences"
        subtitle="Tune Chef to your tastes"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Servings per recipe
            </label>
            <input
              type="number"
              value={prefs.servings}
              min={1}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, servings: +e.target.value }))
              }
              style={{
                width: '100%',
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Diet
            </label>
            <select
              value={prefs.diet}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, diet: e.target.value }))
              }
              style={{
                width: '100%',
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {[
                'None',
                'Vegetarian',
                'Pescatarian',
                'Vegan',
                'Halal',
                'Kosher',
                'Keto',
                'Paleo',
                'Gluten Free',
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <KBtn variant="ghost" onClick={() => setPrefOpen(false)}>
              Cancel
            </KBtn>
            <KBtn
              variant="brand"
              onClick={() => {
                setPrefOpen(false)
                showToast('Preferences saved!')
              }}
            >
              Save
            </KBtn>
          </div>
        </div>
      </KModal>

      <style>{`@keyframes bounce { 0%,60%,100%{transform:scale(0.7);opacity:0.4} 30%{transform:scale(1.1);opacity:1} }`}</style>
    </div>
  )
}
// ─── Recipes View ─────────────────────────────────────────────────────────────
function RecipesView({
  setTab,
  showToast,
}: {
  setTab: (t: MealTab, data?: any) => void
  showToast: (m: string) => void
}) {
  const [filter, setFilter] = useState<
    'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'
  >('all')
  const [search, setSearch] = useState('')
  const filtered = RECIPES.filter(
    (r) =>
      (filter === 'all' || r.type === filter) &&
      (!search || r.name.toLowerCase().includes(search.toLowerCase())),
  )
  const editorsPick = RECIPES[0]

  return (
    <div style={{ padding: '8px 32px 40px' }}>
      {/* Editor's Pick */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.96) 0%, rgba(99,102,241,0.94) 35%, rgba(168,85,247,0.92) 70%, rgba(29,78,216,0.95) 100%)',
          borderRadius: 30,
          padding: '32px 36px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(18px)',
          boxShadow:
            '0 24px 60px rgba(79,70,229,0.22), inset 0 1px 0 rgba(255,255,255,0.16)',
        }}
      >
        {/* Main glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 340,
            height: 340,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.22), transparent 68%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Purple blob */}
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -80,
            width: 260,
            height: 260,
            background:
              'radial-gradient(circle, rgba(168,85,247,0.38), transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }}
        />

        {/* Cyan glow */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: '42%',
            width: 180,
            height: 180,
            background:
              'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: 32,
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255,255,255,0.14)',
                color: '#fff',
                padding: '5px 13px',
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: '0.04em',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
            >
              <Star size={11} fill="currentColor" /> Kira's pick
            </div>

            <h2
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                margin: '0 0 12px',
                textShadow: '0 4px 24px rgba(0,0,0,0.16)',
              }}
            >
              Mediterranean Quinoa
              <br />
              &amp; <span style={{ color: '#BAE6FD' }}>Chicken Power Bowl</span>
            </h2>

            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.78)',
                margin: '0 0 22px',
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              Bright, balanced, ready in 35 minutes. 42g of protein with toasted
              almonds for crunch.
            </p>

            <div style={{ display: 'flex', gap: 24, marginBottom: 22 }}>
              {[
                { v: '35', u: 'min', l: 'Total time' },
                { v: '540', u: '', l: 'Calories' },
                { v: '42', u: 'g', l: 'Protein' },
                { v: '4.9', u: '★', l: 'Rating' },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    style={{
                      fontSize: 23,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {s.v}
                    <small
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 600,
                      }}
                    >
                      {s.u}
                    </small>
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.56)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <KBtn
              variant="ghost"
              onClick={() => setTab('recipe-detail', RECIPES[0])}
              style={{
                color: '#fff',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
            >
              View recipe <ArrowRight size={14} />
            </KBtn>
          </div>

          <div
            style={{
              width: 220,
              height: 180,
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow:
                '0 22px 45px rgba(15,23,42,0.28), 0 0 0 1px rgba(255,255,255,0.12)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.16), transparent 45%)',
                zIndex: 1,
              }}
            />

            <img
              src={editorsPick.img}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>
      {/* Filter & Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === f ? K.text : 'rgba(255,255,255,0.7)',
                  color: filter === f ? '#fff' : K.textMuted,
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ),
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: K.textMuted,
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            style={{
              paddingLeft: 36,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              borderRadius: 12,
              border: `1px solid ${K.border}`,
              background: 'rgba(255,255,255,0.8)',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              color: K.text,
              width: 220,
            }}
          />
        </div>
        <KBtn variant="blue" size="sm" onClick={() => setTab('import')}>
          <Plus size={13} /> Add Recipe
        </KBtn>
      </div>

      {/* Recipe Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {filtered.map((r) => {
          const typeColor: Record<string, { bg: string; color: string }> = {
            breakfast: { bg: K.goldSoft, color: '#b87a1c' },
            lunch: { bg: K.leafSoft, color: '#3e9863' },
            dinner: { bg: K.accentSoft, color: '#d2528a' },
            snack: { bg: K.skySoft, color: '#2b80c2' },
          }
          return (
            <KCard
              key={r.id}
              style={{
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.transform =
                  'translateY(-3px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 12px 32px rgba(34,18,64,0.12)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.transform = ''
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
              }}
              onClick={() => setTab('recipe-detail', r)}
            >
              <div
                style={{
                  height: 180,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={r.img}
                  alt={r.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display =
                      'none'
                  }}
                />
                <button
                  onClick={(ev) => {
                    ev.stopPropagation()
                    showToast(
                      r.fav ? 'Removed from favorites' : 'Added to favorites',
                    )
                  }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    border: 0,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Heart
                    size={14}
                    color={r.fav ? '#f582ae' : K.textMuted}
                    fill={r.fav ? '#f582ae' : 'none'}
                  />
                </button>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: typeColor[r.type]?.bg,
                    color: typeColor[r.type]?.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {r.type}
                </span>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: K.text,
                    margin: '0 0 8px',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {r.name}
                </h4>
                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    fontSize: 12,
                    color: K.textMuted,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Flame size={12} /> {r.cal} cal
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Dumbbell size={12} /> {r.pro}g
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Clock size={12} /> {r.time}min
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Star size={12} fill={K.gold} color={K.gold} /> {r.rating}
                  </span>
                </div>
              </div>
            </KCard>
          )
        })}
      </div>
    </div>
  )
}

// ─── Recipe Detail ────────────────────────────────────────────────────────────
function RecipeDetailView({
  recipe,
  goBack,
  showToast,
}: {
  recipe: any
  goBack: () => void
  showToast: (m: string) => void
}) {
  if (!recipe) return null
  return (
    <div style={{ padding: '8px 32px 60px', maxWidth: 900, margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13.5,
          color: K.textMuted,
          fontWeight: 500,
          marginBottom: 18,
        }}
      >
        <button
          onClick={goBack}
          style={{
            color: K.textMuted,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13.5,
          }}
        >
          recipes
        </button>
        <ChevronRight size={12} style={{ opacity: 0.6 }} />
        <span>{recipe.type}</span>
        <ChevronRight size={12} style={{ opacity: 0.6 }} />
        <span style={{ color: K.text, fontWeight: 600 }}>{recipe.name}</span>
      </div>

      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.1,
          margin: '0 0 14px',
          color: K.text,
        }}
      >
        {recipe.name}
      </h1>
      <p
        style={{
          fontSize: 17,
          color: K.textMuted,
          lineHeight: 1.5,
          margin: '0 0 18px',
          fontWeight: 500,
        }}
      >
        A{' '}
        {recipe.type === 'breakfast'
          ? 'protein-packed start to the day'
          : recipe.type === 'dinner'
            ? 'comforting, deeply flavored dinner'
            : 'satisfying midday meal'}{' '}
        that delivers serious flavor in {recipe.time} minutes.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          marginBottom: 8,
          fontSize: 13.5,
          color: K.textSub,
          fontWeight: 500,
        }}
      >
        <span style={{ fontWeight: 700, color: K.text }}>{recipe.author}</span>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(184,177,207,1)',
            display: 'inline-block',
          }}
        />
        <span>Updated {recipe.updated}</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            color: K.gold,
          }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={18}
              fill={i < Math.round(recipe.rating) ? K.gold : 'none'}
              color={K.gold}
            />
          ))}
        </div>
        <span style={{ fontSize: 13.5, color: K.textMuted, fontWeight: 500 }}>
          <b style={{ color: K.text }}>{recipe.rating}</b> ({recipe.reviewCount}{' '}
          reviews)
        </span>
        <button
          onClick={() => showToast('Jumping to recipe!')}
          style={{
            marginLeft: 'auto',
            color: K.leaf,
            fontWeight: 700,
            fontSize: 13.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Jump to recipe ↓
        </button>
      </div>

      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/10',
          borderRadius: 24,
          overflow: 'hidden',
          marginBottom: 28,
          boxShadow: '0 4px 16px rgba(34,18,64,0.1)',
        }}
      >
        <img
          src={recipe.img}
          alt={recipe.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={() => showToast('Added to this weeks plan!')}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            background: '#fff',
            color: K.text,
            border: 0,
            padding: '11px 18px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 13.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 16px rgba(34,18,64,0.15)',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} color={K.leaf} strokeWidth={2.5} /> Add to plan
        </button>
      </div>

      {/* Stats + Actions */}
      <KCard style={{ padding: '30px 36px', marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            paddingBottom: 22,
            borderBottom: `1px solid ${K.border}`,
            marginBottom: 22,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                margin: '0 0 6px',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: K.text,
              }}
            >
              Recipe overview
            </h2>
            <p
              style={{
                fontSize: 14,
                color: K.textMuted,
                margin: 0,
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              Everything you need to recreate this dish perfectly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <KBtn
              variant="green"
              size="sm"
              onClick={() => showToast('Added to plan!')}
            >
              <Plus size={13} /> Add to plan
            </KBtn>
            <KBtn
              variant="ghost"
              size="sm"
              onClick={() => showToast('Saved to favorites!')}
            >
              <Heart size={13} /> Save
            </KBtn>
            <KBtn
              variant="ghost"
              size="sm"
              onClick={() => showToast('Share link copied!')}
            >
              <Share2 size={13} /> Share
            </KBtn>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {[
            { lbl: 'Time', val: `${recipe.time} min` },
            { lbl: 'Servings', val: recipe.servings },
            { lbl: 'Difficulty', val: 'Easy' },
            {
              lbl: 'Cuisine',
              val: recipe.type === 'lunch' ? 'Mediterranean' : 'World',
            },
          ].map((s) => (
            <div key={s.lbl}>
              <div
                style={{
                  fontSize: 11,
                  color: K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {s.lbl}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: K.text }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>
      </KCard>

      {/* Nutrition */}
      <div
        style={{
          background: 'rgba(244,241,251,0.7)',
          borderRadius: 18,
          padding: '24px 28px',
          marginBottom: 28,
          border: `1px solid ${K.border}`,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: K.textSub,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 18px',
          }}
        >
          Nutrition per serving
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {[
            { v: recipe.cal, l: 'Calories', color: K.gold },
            { v: `${recipe.pro}g`, l: 'Protein', color: K.leaf },
            { v: `${recipe.crb}g`, l: 'Carbs', color: K.sky },
            { v: `${recipe.fat}g`, l: 'Fat', color: K.accent },
          ].map((n) => (
            <div key={n.l}>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: n.color,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {n.v}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: K.textMuted,
                  fontWeight: 500,
                  marginTop: 4,
                }}
              >
                {n.l}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 13,
            color: K.textMuted,
            textAlign: 'center',
            paddingTop: 14,
            borderTop: `1px solid ${K.border}`,
            fontWeight: 500,
          }}
        >
          Values are estimates.{' '}
          <button
            onClick={() => showToast('Opening nutrition details...')}
            style={{
              color: K.leaf,
              fontWeight: 700,
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
            }}
          >
            Adjust serving size
          </button>
        </div>
      </div>

      {/* Ingredients */}
      <KCard style={{ padding: '30px 36px', marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 18px',
            color: K.text,
          }}
        >
          Ingredients
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {recipe.ingredients.map((ing: string, i: number) => {
            const parts = ing.match(
              /^([\d\s\u00BC-\u00BE\/\.xg×kgmlltsp\w]+)\s+(.+)$/,
            )
            return (
              <li
                key={i}
                style={{
                  position: 'relative',
                  padding: '6px 0 6px 22px',
                  fontSize: 14.5,
                  color: K.textSub,
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 16,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: K.leaf,
                    display: 'block',
                  }}
                />
                {parts ? (
                  <>
                    <b style={{ color: K.text, fontWeight: 800 }}>{parts[1]}</b>{' '}
                    {parts[2]}
                  </>
                ) : (
                  ing
                )}
              </li>
            )
          })}
        </ul>
      </KCard>

      {/* Steps */}
      <KCard style={{ padding: '30px 36px', marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 18px',
            color: K.text,
          }}
        >
          Instructions
        </h2>
        {recipe.steps.map((step: string, i: number) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '36px 1fr',
              gap: 16,
              marginBottom: 22,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1b5e3f',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  margin: '4px 0 8px',
                  letterSpacing: '-0.015em',
                  color: K.text,
                }}
              >
                {[
                  'Prep & measure',
                  'Season well',
                  'Cook until done',
                  'Plate and serve',
                ][i] || `Step ${i + 1}`}
              </h4>
              <p
                style={{
                  fontSize: 14.5,
                  color: K.textSub,
                  lineHeight: 1.65,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {step}
              </p>
            </div>
          </div>
        ))}
      </KCard>

      {/* Chef's Notes */}
      <div
        style={{
          background: '#fdf9eb',
          borderRadius: 18,
          padding: '24px 28px',
          marginBottom: 28,
          border: '1px solid rgba(246,179,82,0.25)',
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 800,
            margin: '0 0 12px',
            color: K.text,
            letterSpacing: '-0.02em',
          }}
        >
          Chef's notes
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {[
            'Use a digital thermometer for perfect doneness every time.',
            'Slightly undercook anything that will be reheated — it keeps softening.',
            'Vary your spice blend weekly to prevent meal-prep fatigue.',
          ].map((n, i) => (
            <li
              key={i}
              style={{
                position: 'relative',
                padding: '4px 0 4px 18px',
                fontSize: 14,
                color: K.textSub,
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 14,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: K.gold,
                  display: 'block',
                }}
              />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Pantry View ──────────────────────────────────────────────────────────────
function PantryView({ showToast }: { showToast: (m: string) => void }) {
  const [items, setItems] = useState(PANTRY_ITEMS)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    cat: 'Produce',
    qty: '',
    exp: '',
  })
  const cats = ['All', ...Array.from(new Set(items.map((i) => i.cat)))]
  const [selCat, setSelCat] = useState('All')
  const filtered = items.filter(
    (i) =>
      (selCat === 'All' || i.cat === selCat) &&
      (!search || i.name.toLowerCase().includes(search.toLowerCase())),
  )
  const expiring = items.filter((i) => i.expiring)

  return (
    <div style={{ padding: '8px 32px 40px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: '0 0 4px',
              color: K.text,
            }}
          >
            Pantry
          </h2>
          <p style={{ fontSize: 13, color: K.textMuted, margin: 0 }}>
            {items.length} items tracked · {expiring.length} expiring soon
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: K.textMuted,
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pantry..."
              style={{
                paddingLeft: 34,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 12,
                border: `1px solid ${K.border}`,
                background: 'rgba(255,255,255,0.8)',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                color: K.text,
                width: 200,
              }}
            />
          </div>
          <KBtn variant="blue" size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={13} /> Add item
          </KBtn>
        </div>
      </div>

      {/* Expiring alert */}
      {expiring.length > 0 && (
        <div
          style={{
            background: 'rgba(245,130,174,0.12)',
            border: `1px solid rgba(245,130,174,0.3)`,
            borderRadius: 16,
            padding: '14px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Flame size={18} color={K.accent} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: K.text }}>
              Use these soon:
            </span>
            <span style={{ fontSize: 13, color: K.textMuted, marginLeft: 8 }}>
              {expiring.map((i) => i.name).join(', ')}
            </span>
          </div>
          <KBtn
            variant="brand"
            size="sm"
            onClick={() => showToast('Finding recipes for expiring items...')}
          >
            <ChefHat size={13} /> Get recipes
          </KBtn>
        </div>
      )}

      {/* Category filter */}
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}
      >
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setSelCat(c)}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: selCat === c ? K.text : 'rgba(255,255,255,0.7)',
              color: selCat === c ? '#fff' : K.textMuted,
              backdropFilter: 'blur(8px)',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {filtered.map((item) => (
          <KCard
            key={item.id}
            style={{ padding: '16px 18px', position: 'relative' }}
          >
            {item.expiring && (
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: K.accentSoft,
                  color: K.accent,
                }}
              >
                Expiring
              </span>
            )}
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: K.text,
                marginBottom: 4,
              }}
            >
              {item.name}
            </div>
            <div style={{ fontSize: 12, color: K.textMuted, marginBottom: 8 }}>
              {item.qty}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(17,24,39,0.06)',
                  color: K.textMuted,
                }}
              >
                {item.cat}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: item.expiring ? K.accent : K.textLight,
                  fontWeight: 500,
                }}
              >
                Exp {item.exp}
              </span>
            </div>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((i) => i.id !== item.id))
              }
              style={{
                position: 'absolute',
                bottom: 14,
                right: 14,
                width: 26,
                height: 26,
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: K.textLight,
                opacity: 0,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
                ;(e.currentTarget as HTMLButtonElement).style.color = K.error
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = '0'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  K.textLight
              }}
            >
              <Trash2 size={13} />
            </button>
          </KCard>
        ))}
      </div>

      {/* Add modal */}
      <KModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add to pantry"
        subtitle="Track what's in your kitchen"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Item name', key: 'name', placeholder: 'e.g. Brown rice' },
            { label: 'Quantity', key: 'qty', placeholder: 'e.g. 500g' },
            { label: 'Expiry date', key: 'exp', placeholder: 'e.g. Jun 2026' },
          ].map((f) => (
            <div key={f.key}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: K.textSub,
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {f.label}
              </label>
              <input
                value={(newItem as any)[f.key]}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder}
                style={{
                  width: '100%',
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Category
            </label>
            <select
              value={newItem.cat}
              onChange={(e) =>
                setNewItem((p) => ({ ...p, cat: e.target.value }))
              }
              style={{
                width: '100%',
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {['Produce', 'Protein', 'Dairy', 'Pantry', 'Frozen', 'Other'].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <KBtn variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </KBtn>
            <KBtn
              variant="brand"
              onClick={() => {
                if (!newItem.name) return
                setItems((prev) => [
                  ...prev,
                  {
                    id: `p${Date.now()}`,
                    name: newItem.name,
                    cat: newItem.cat,
                    qty: newItem.qty,
                    exp: newItem.exp,
                    expiring: false,
                  },
                ])
                setNewItem({ name: '', cat: 'Produce', qty: '', exp: '' })
                setAddOpen(false)
                showToast('Item added to pantry!')
              }}
            >
              Add item
            </KBtn>
          </div>
        </div>
      </KModal>
    </div>
  )
}

// ─── Shopping List ────────────────────────────────────────────────────────────
function ShoppingView({ showToast }: { showToast: (m: string) => void }) {
  const [items, setItems] = useState(SHOPPING_ITEMS)
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const done = items.filter((i) => i.done).length
  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    )
  const catMap: Record<string, string[]> = {}
  items.forEach((i) => {
    if (!catMap[i.cat]) catMap[i.cat] = []
    catMap[i.cat].push(i.id)
  })

  const smartSuggestions = [
    'Sparkling water',
    'Sourdough',
    'Bananas',
    'Greek yogurt',
    'Almonds',
  ]
  const estTotal = 47

  return (
    <div
      style={{
        padding: '8px 32px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: 24,
        alignItems: 'start',
      }}
    >
      {/* Main list */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                margin: '0 0 4px',
                color: K.text,
              }}
            >
              Shopping{' '}
              <span
                style={{
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                List
              </span>
            </h2>
            <p style={{ fontSize: 13, color: K.textMuted, margin: 0 }}>
              {done}/{items.length} items checked off
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <KBtn
              variant="ghost"
              size="sm"
              onClick={() => showToast('List cleared!')}
            >
              <X size={13} /> Clear done
            </KBtn>
            <KBtn variant="blue" size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={13} /> Add item
            </KBtn>
          </div>
        </div>

        {/* Grouped items */}
        {Object.keys(catMap).map((cat) => {
          const catItems = items.filter((i) => i.cat === cat)
          return (
            <div key={cat} style={{ marginBottom: 20 }}>
              <h4
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: K.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 10px',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {cat}
                <span
                  style={{
                    fontSize: 10,
                    background: K.primarySoft,
                    color: K.primary,
                    padding: '1px 7px',
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  {catItems.length}
                </span>
              </h4>
              <KCard style={{ overflow: 'hidden' }}>
                {catItems.map((item, idx, arr) => (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '13px 18px',
                      cursor: 'pointer',
                      borderBottom:
                        idx < arr.length - 1 ? `1px solid ${K.border}` : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background =
                        'rgba(244,241,251,0.5)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background =
                        'transparent')
                    }
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 7,
                        border: item.done ? 'none' : `2px solid ${K.borderMid}`,
                        background: item.done ? K.gradBrand : 'transparent',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      {item.done && (
                        <Check size={13} color="#fff" strokeWidth={3} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: item.done ? K.textLight : K.text,
                          textDecoration: item.done ? 'line-through' : 'none',
                          transition: 'all 0.15s',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: K.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        {item.qty}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setItems((prev) => prev.filter((i) => i.id !== item.id))
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: K.textLight,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color =
                          K.error)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color =
                          K.textLight)
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </KCard>
            </div>
          )
        })}
      </div>

      {/* Right sidebar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'sticky',
          top: 16,
        }}
      >
        {/* Weekly progress card */}
        <KCard style={{ padding: '20px 22px' }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: K.text,
              margin: '0 0 14px',
              letterSpacing: '-0.01em',
            }}
          >
            This week's progress
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 20,
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: K.text,
                  lineHeight: 1,
                }}
              >
                {done}/{items.length}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: K.textMuted,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: 3,
                }}
              >
                Items done
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: K.text,
                  lineHeight: 1,
                }}
              >
                ${estTotal}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: K.textMuted,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: 3,
                }}
              >
                Est. total
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(17,24,39,0.06)',
              borderRadius: 4,
              height: 6,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.round((done / items.length) * 100)}%`,
                height: '100%',
                background: K.gradBrand,
                borderRadius: 4,
                transition: 'width 0.4s',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: K.textMuted,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            {Math.round((done / items.length) * 100)}% complete
          </div>
        </KCard>

        {/* Smart suggestions */}
        <KCard style={{ padding: '20px 22px' }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: K.text,
              margin: '0 0 4px',
              letterSpacing: '-0.01em',
            }}
          >
            Smart suggestions
          </h3>
          <p
            style={{
              fontSize: 11.5,
              color: K.textMuted,
              margin: '0 0 14px',
              fontWeight: 500,
            }}
          >
            Tap to add—
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {smartSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setItems((prev) => [
                    ...prev,
                    {
                      id: `s${Date.now()}`,
                      name: s,
                      qty: '1',
                      cat: 'Other',
                      done: false,
                    },
                  ])
                  showToast(`${s} added!`)
                }}
                style={{
                  padding: '6px 12px',
                  background: K.leafSoft,
                  color: K.leaf,
                  border: `1px solid rgba(91,191,133,0.25)`,
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    '#d1fae5'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                    K.leaf
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    K.leafSoft
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(91,191,133,0.25)'
                }}
              >
                <Plus size={11} /> {s}
              </button>
            ))}
          </div>
        </KCard>

        {/* Share button */}
        <KBtn
          variant="ghost"
          onClick={() => showToast('Shopping list shared!')}
          style={{ justifyContent: 'center' }}
        >
          <Share2 size={14} /> Share list
        </KBtn>
      </div>

      <KModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add item"
        subtitle="Add to your shopping list"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Item name
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Avocados"
              style={{
                width: '100%',
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <KBtn variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </KBtn>
            <KBtn
              variant="brand"
              onClick={() => {
                if (!newName) return
                setItems((prev) => [
                  ...prev,
                  {
                    id: `s${Date.now()}`,
                    name: newName,
                    qty: '1',
                    cat: 'Other',
                    done: false,
                  },
                ])
                setNewName('')
                setAddOpen(false)
                showToast('Item added!')
              }}
            >
              Add item
            </KBtn>
          </div>
        </div>
      </KModal>
    </div>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CAL_PLANS = [
  {
    id: '1000',
    cal: 1000,
    name: '1000 Calorie Meal Plan',
    pill: 'Very Low Calorie',
    pillColor: '#e87298',
    desc: 'A very low calorie diet for rapid weight loss under medical supervision.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
  },
  {
    id: '1100',
    cal: 1100,
    name: '1100 Calorie Meal Plan',
    pill: 'Aggressive Deficit',
    pillColor: '#f6b352',
    desc: 'An aggressive but manageable 1100 calorie plan. Protein-prioritized meals that support fat loss while keeping energy up.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  },
  {
    id: '1200',
    cal: 1200,
    name: '1200 Calorie Meal Plan',
    pill: 'Aggressive Deficit',
    pillColor: '#f6b352',
    desc: 'A structured 1200 calorie plan for fast, safe weight loss. High-protein meals that keep you satisfied on fewer calories.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80',
  },
  {
    id: '1300',
    cal: 1300,
    name: '1300 Calorie Meal Plan',
    pill: 'Smart Deficit',
    pillColor: '#5bbf85',
    desc: 'A 1300 calorie plan bridging aggressive and moderate deficits. Satisfying portions with enough protein to protect muscle.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
  },
  {
    id: '1400',
    cal: 1400,
    name: '1400 Calorie Meal Plan',
    pill: 'Controlled Deficit',
    pillColor: '#6c5ce7',
    desc: 'A 1400 calorie plan for steady fat loss with enough food to keep training and feeling good.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
  },
  {
    id: '1500',
    cal: 1500,
    name: '1500 Calorie Meal Plan',
    pill: 'Moderate Deficit',
    pillColor: '#5dade2',
    desc: 'A moderate 1500 calorie plan ideal for sustained weight loss without feeling deprived.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80',
  },
  {
    id: '1800',
    cal: 1800,
    name: '1800 Calorie Meal Plan',
    pill: 'Maintenance',
    pillColor: '#10b981',
    desc: 'A balanced 1800 calorie plan designed for weight maintenance and active lifestyles.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  },
  {
    id: '2000',
    cal: 2000,
    name: '2000 Calorie Meal Plan',
    pill: 'Active Lifestyle',
    pillColor: '#3b82f6',
    desc: 'Full 2000 calorie meal plan for active individuals aiming to maintain or build lean muscle.',
    features: ['Macro-Balanced', 'High Protein', 'Auto Grocery List'],
    img: 'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=400&q=80',
  },
]

const DIET_PLANS_DATA = [
  {
    id: 'keto',
    name: 'Keto Diet',
    italic: 'Fat-Fueled Energy',
    tag: 'Low-carb, high-fat & satiating',
    pill: 'Popular',
    pillColor: '#f582ae',
    cats: ['popular', 'weight-loss', 'lifestyle'],
    subtitle: 'Low-carb, high-fat & satiating',
    desc: 'Low-carb, higher-fat meals for steady energy. Our AI balances electrolytes and fiber so Keto stays sustainable.',
    longDesc:
      'Low-carb, high-satiety menu with balanced electrolytes and fiber so Keto is enjoyable and sustainable week after week.',
    features: [
      '20-50g net carbs/day',
      'Calibrated protein',
      'Simple grocery list',
    ],
    benefits: ['High Fat Burning', 'Mental Clarity', 'Appetite Control'],
    whatIs:
      'The ketogenic diet is a high-fat, very-low-carb eating plan that shifts your body into ketosis, burning fat for fuel instead of glucose.',
    keyPoints: [
      {
        h: 'High Fat Intake',
        p: '70-75% of calories from healthy fats like avocado, olive oil, and nuts.',
      },
      {
        h: 'Very Low Carbs',
        p: 'Only 20-50g of carbs per day to maintain ketosis.',
      },
      {
        h: 'Ketosis State',
        p: 'Your body switches to burning fat for energy, improving focus and endurance.',
      },
    ],
    badge: { v: '75%', l: 'Fat Energy' },
    tableTitle: 'What Can You Eat on Keto?',
    tableLead:
      'The keto diet keeps net carbs under 20-50 g per day, shifting your body into fat-burning ketosis.',
    table: [
      {
        food: 'Butter',
        serving: '1 tbsp (14g)',
        carbs: '0g',
        fat: '12g',
        pro: '0g',
      },
      {
        food: 'Avocado',
        serving: '1/2 medium',
        carbs: '2g',
        fat: '15g',
        pro: '2g',
      },
      {
        food: 'Salmon',
        serving: '4oz (113g)',
        carbs: '0g',
        fat: '12g',
        pro: '23g',
      },
      { food: 'Eggs', serving: '2 large', carbs: '1g', fat: '10g', pro: '12g' },
      {
        food: 'Cheddar Cheese',
        serving: '1oz (28g)',
        carbs: '1g',
        fat: '9g',
        pro: '7g',
      },
      {
        food: 'Almonds',
        serving: '1oz (28g)',
        carbs: '3g',
        fat: '14g',
        pro: '6g',
      },
    ],
    bestFor: [
      {
        icon: '🧠',
        h: 'Mental Clarity Seekers',
        p: 'Many report sharper focus and stable energy once adapted — no more afternoon crashes.',
      },
      {
        icon: '⚖️',
        h: 'Rapid Fat Loss',
        p: 'Initial water weight drops fast, then steady fat loss follows. Highly motivating for quick visible results.',
      },
      {
        icon: '🩺',
        h: 'Insulin Resistance',
        p: 'Low carb dramatically lowers blood sugar and insulin levels — often recommended for pre-diabetes.',
      },
      {
        icon: '🥓',
        h: 'Fat-Lovers',
        p: 'Enjoy bacon, butter, cheese, and avocado without guilt. Keto makes high-fat eating the actual goal.',
      },
    ],
    eat: [
      'Fatty meats — ribeye, salmon, bacon, chicken thighs with skin',
      'Healthy fats — avocado, olive oil, coconut oil, butter, ghee',
      'Low-carb vegetables — spinach, kale, broccoli, zucchini',
      'Full-fat dairy — cheese, heavy cream, sour cream',
      'Eggs — whole eggs cooked any style',
      'Nuts and seeds — macadamia, pecans, walnuts, chia',
    ],
    avoid: [
      'Grains and starches — bread, pasta, rice, oats, cereal',
      'Sugar in all forms — candy, soda, juice, honey',
      'Most fruits — bananas, apples, oranges, grapes',
      'Root vegetables — potatoes, sweet potatoes, carrots',
      'Low-fat diet products — often loaded with sugar',
      'Beer and sweet cocktails — high in carbs',
    ],
    howWorks: 'Switch your body from burning carbs to burning fat for fuel.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
  {
    id: 'med',
    name: 'Mediterranean Diet',
    italic: 'Olive Oil & Sea Breeze',
    tag: 'Olive oil, fish & fresh veg',
    pill: 'Heart Healthy',
    pillColor: '#5dade2',
    cats: ['popular', 'health', 'lifestyle'],
    subtitle: 'Heart-friendly & balanced',
    desc: 'Heart-friendly approach built on olive oil, vegetables, legumes, and fish. Balanced macros and tasty recipes.',
    longDesc:
      'A timeless eating pattern centered on olive oil, vegetables, fish, and whole grains — clinically proven to support heart and brain health.',
    features: [
      'High satiety meals',
      'Healthy fats & flavor',
      'Easy weekly prep',
    ],
    benefits: ['Heart Health', 'Brain Support', 'Anti-Inflammatory'],
    whatIs:
      'The Mediterranean diet is one of the most studied eating patterns in the world, emphasizing whole foods, healthy fats, and lean proteins.',
    keyPoints: [
      {
        h: 'Olive Oil First',
        p: 'Extra virgin olive oil is the primary source of fat, used liberally in cooking and dressings.',
      },
      {
        h: 'Fish & Seafood',
        p: 'Eat fish twice a week, focusing on fatty fish like salmon for omega-3s.',
      },
      {
        h: 'Plenty of Plants',
        p: 'Vegetables, fruits, legumes, and whole grains form the base of every meal.',
      },
    ],
    badge: { v: '30%', l: 'Lower CV Risk' },
    tableTitle: 'What Can You Eat on Mediterranean?',
    tableLead:
      'The Mediterranean diet centers on plant foods, healthy fats from olive oil, fish twice a week, and moderate dairy.',
    table: [
      {
        food: 'Olive Oil (Extra Virgin)',
        serving: '1 tbsp',
        carbs: '0g',
        fat: '14g',
        pro: '0g',
      },
      { food: 'Salmon', serving: '4oz', carbs: '0g', fat: '12g', pro: '23g' },
      {
        food: 'Chickpeas',
        serving: '1/2 cup',
        carbs: '22g',
        fat: '2g',
        pro: '7g',
      },
      {
        food: 'Whole Wheat Pasta',
        serving: '1 cup',
        carbs: '37g',
        fat: '1g',
        pro: '8g',
      },
      {
        food: 'Greek Yogurt',
        serving: '1 cup',
        carbs: '9g',
        fat: '0g',
        pro: '17g',
      },
      { food: 'Walnuts', serving: '1oz', carbs: '4g', fat: '18g', pro: '4g' },
    ],
    bestFor: [
      {
        icon: '❤️',
        h: 'Heart Health',
        p: 'Clinically proven to reduce risk of heart disease, stroke, and high blood pressure.',
      },
      {
        icon: '🧠',
        h: 'Brain Longevity',
        p: "Linked to lower rates of cognitive decline and Alzheimer's in long-term studies.",
      },
      {
        icon: '🌿',
        h: 'Anti-Inflammation',
        p: 'Omega-3s and polyphenols from olive oil reduce systemic inflammation.',
      },
      {
        icon: '🍽️',
        h: 'Sustainable Eaters',
        p: 'Flexible, family-friendly, and built around real food — not a rigid diet.',
      },
    ],
    eat: [
      'Fish & seafood — salmon, sardines, mackerel, shrimp',
      'Olive oil — extra virgin for dressings',
      'Vegetables — leafy greens, tomatoes, peppers, eggplant',
      'Legumes — chickpeas, lentils, beans',
      'Whole grains — whole wheat, bulgur, farro',
      'Nuts & seeds — almonds, walnuts, pistachios',
    ],
    avoid: [
      'Processed meats — bacon, salami, hot dogs',
      'Refined grains — white bread, white rice',
      'Added sugars — soda, candy, baked goods',
      'Refined seed oils — corn, soybean, canola',
      'Sweetened dairy — flavored yogurt, ice cream',
    ],
    howWorks:
      'Replace processed foods with olive oil, fish, and plants to lower inflammation and support whole-body health.',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
  {
    id: 'veg',
    name: 'Vegetarian Diet',
    italic: 'Plants & Proteins',
    tag: 'Plant-forward & complete proteins',
    pill: 'Lifestyle',
    pillColor: '#5bbf85',
    cats: ['popular', 'lifestyle', 'health'],
    subtitle: 'Plant-forward & complete proteins',
    desc: 'Plant-forward menu with complete proteins from eggs, dairy, tofu and legumes. Clear portions and family-friendly.',
    longDesc:
      'A well-designed vegetarian plan that covers all essential amino acids through smart food combining — satisfying, colorful, and budget-friendly.',
    features: ['High-fiber plates', 'Balanced energy', 'Allergy swaps'],
    benefits: ['Gut Health', 'Weight Management', 'Lower Cholesterol'],
    whatIs:
      'A vegetarian diet excludes meat and fish but includes eggs, dairy, and all plant foods — one of the most versatile and sustainable ways to eat.',
    keyPoints: [
      {
        h: 'Complete Proteins',
        p: 'Combine legumes with grains — rice & beans, hummus & pita — to cover all essential amino acids.',
      },
      {
        h: 'Iron & B12',
        p: 'Focus on fortified foods, eggs, dairy, and leafy greens to meet iron and B12 needs.',
      },
      {
        h: 'High Fiber',
        p: 'Plant-heavy meals naturally boost fiber, improving digestion and satiety.',
      },
    ],
    badge: { v: '100%', l: 'Plant Powered' },
    tableTitle: 'What Can You Eat Vegetarian?',
    tableLead:
      'Eggs, dairy, all vegetables, fruits, legumes, whole grains, nuts, and seeds are all on the table.',
    table: [
      { food: 'Eggs', serving: '2 large', carbs: '1g', fat: '10g', pro: '12g' },
      {
        food: 'Greek Yogurt',
        serving: '1 cup',
        carbs: '9g',
        fat: '0g',
        pro: '17g',
      },
      {
        food: 'Lentils',
        serving: '1/2 cup',
        carbs: '20g',
        fat: '0g',
        pro: '9g',
      },
      { food: 'Tofu', serving: '4oz', carbs: '2g', fat: '5g', pro: '10g' },
      {
        food: 'Quinoa',
        serving: '1/2 cup',
        carbs: '20g',
        fat: '2g',
        pro: '4g',
      },
      { food: 'Almonds', serving: '1oz', carbs: '6g', fat: '14g', pro: '6g' },
    ],
    bestFor: [
      {
        icon: '🌱',
        h: 'Eco-Conscious Eaters',
        p: 'Dramatically reduces carbon footprint compared to meat-heavy diets.',
      },
      {
        icon: '❤️',
        h: 'Heart Health',
        p: 'Lower saturated fat intake linked to improved cardiovascular markers.',
      },
      {
        icon: '💰',
        h: 'Budget-Friendly',
        p: 'Legumes, grains, and seasonal vegetables are among the cheapest foods available.',
      },
      {
        icon: '🏋️',
        h: 'Active People',
        p: 'Properly planned vegetarian diets fully support athletic performance and recovery.',
      },
    ],
    eat: [
      'Eggs — scrambled, poached, hard-boiled, omelets',
      'Dairy — milk, yogurt, cheese, cottage cheese',
      'Legumes — lentils, chickpeas, black beans, edamame',
      'Tofu & tempeh — versatile plant proteins',
      'Whole grains — quinoa, oats, brown rice, farro',
      'All vegetables and fruits',
    ],
    avoid: [
      'Meat — beef, pork, chicken, turkey',
      'Fish & seafood — all types',
      'Meat-based broths and stocks',
      'Gelatin — found in many gummies and desserts',
      'Rennet-based cheeses (look for vegetarian-labeled)',
    ],
    howWorks:
      'Eliminate meat and fish. Build meals from plants, eggs, and dairy to meet all nutritional needs.',
    img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
  },
  {
    id: 'hiprotein',
    name: 'High-Protein Diet',
    italic: 'Build & Burn',
    tag: '30-40g protein per meal',
    pill: 'For Muscle',
    pillColor: '#6c5ce7',
    cats: ['popular', 'weight-loss', 'lifestyle'],
    subtitle: '30-40g protein per meal',
    desc: 'Protein-first meal plan engineered for muscle retention and fat loss. Every meal hits 30-40g of quality protein.',
    longDesc:
      'A protein-first strategy that preserves and builds muscle while cutting fat. Each meal is engineered to hit 30-40g of complete protein.',
    features: [
      '30-40g protein/meal',
      'Muscle preservation',
      'Macro tracking ready',
    ],
    benefits: ['Muscle Growth', 'Fat Loss', 'Satiety'],
    whatIs:
      'A high-protein diet prioritizes protein at every meal to support muscle synthesis, reduce appetite, and boost metabolism through the thermic effect of food.',
    keyPoints: [
      {
        h: 'Protein First',
        p: 'Build every meal around a high-quality protein source — chicken, fish, eggs, Greek yogurt, or legumes.',
      },
      {
        h: 'Thermic Effect',
        p: 'Protein burns more calories to digest (25-30%) than carbs (6-8%) or fat (2-3%).',
      },
      {
        h: 'Muscle Protein Synthesis',
        p: 'Regular protein intake every 3-5 hours maximizes muscle-building signals throughout the day.',
      },
    ],
    badge: { v: '40%', l: 'Protein Ratio' },
    tableTitle: 'High-Protein Food Sources',
    tableLead:
      'Prioritize lean meats, fish, eggs, and dairy at every meal to hit your protein targets.',
    table: [
      {
        food: 'Chicken Breast',
        serving: '4oz',
        carbs: '0g',
        fat: '4g',
        pro: '31g',
      },
      {
        food: 'Greek Yogurt (0%)',
        serving: '1 cup',
        carbs: '9g',
        fat: '0g',
        pro: '17g',
      },
      { food: 'Eggs', serving: '3 large', carbs: '1g', fat: '15g', pro: '18g' },
      {
        food: 'Tuna (canned)',
        serving: '4oz',
        carbs: '0g',
        fat: '1g',
        pro: '27g',
      },
      {
        food: 'Cottage Cheese',
        serving: '1 cup',
        carbs: '6g',
        fat: '5g',
        pro: '28g',
      },
      {
        food: 'Edamame',
        serving: '1 cup',
        carbs: '14g',
        fat: '8g',
        pro: '17g',
      },
    ],
    bestFor: [
      {
        icon: '💪',
        h: 'Athletes & Lifters',
        p: 'High protein intake is essential for muscle repair, hypertrophy, and performance.',
      },
      {
        icon: '⚖️',
        h: 'Fat Loss',
        p: 'Protein keeps you full longer and preserves lean mass during a caloric deficit.',
      },
      {
        icon: '🍗',
        h: 'Meat & Dairy Lovers',
        p: 'This plan is built around the foods you already enjoy — just structured more intentionally.',
      },
      {
        icon: '🏃',
        h: 'Active Professionals',
        p: 'Easy to meal prep. Grilled chicken + veggies is simple, fast, and travels well.',
      },
    ],
    eat: [
      'Chicken breast, turkey breast, lean beef',
      'Fish — salmon, tuna, cod, tilapia',
      'Eggs & egg whites',
      'Greek yogurt, cottage cheese, low-fat cheese',
      'Legumes — lentils, black beans, edamame',
      'Protein powder — whey, casein, or plant-based',
    ],
    avoid: [
      'Low-protein processed snacks — chips, crackers, cookies',
      'Sugary beverages — soda, juice, sports drinks',
      'Refined carbs in excess — white bread, pastries',
      'High-fat, low-protein meats — bacon, sausage, ribs',
    ],
    howWorks:
      'Prioritize protein at every meal to build muscle, burn fat, and stay full longer.',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
  },
  {
    id: 'lowcarb',
    name: 'Low-Carb Diet',
    italic: 'Steady Energy',
    tag: 'Flexible carbs, fiber-first',
    pill: 'Steady Energy',
    pillColor: '#f6b352',
    cats: ['popular', 'weight-loss', 'health'],
    subtitle: 'Flexible carbs, fiber-first',
    desc: 'A flexible low-carb approach that cuts refined carbs while keeping fiber-rich vegetables and whole foods center stage.',
    longDesc:
      'Not as strict as keto, a low-carb diet reduces refined carbs and sugar while keeping fiber-rich vegetables, legumes, and some whole grains.',
    features: [
      'Flexible carb targets',
      'Blood sugar friendly',
      'Whole food focus',
    ],
    benefits: ['Blood Sugar Control', 'Steady Energy', 'Weight Loss'],
    whatIs:
      'A low-carb diet reduces total carbohydrate intake, especially refined carbs and sugar, to stabilize blood sugar and promote fat loss without entering ketosis.',
    keyPoints: [
      {
        h: 'Reduce Refined Carbs',
        p: 'Swap white bread, pasta, and sugar for vegetables, legumes, and small amounts of whole grains.',
      },
      {
        h: 'Blood Sugar Stability',
        p: 'Lower carb intake prevents blood sugar spikes and crashes, improving energy and mood.',
      },
      {
        h: 'Flexible Approach',
        p: 'Unlike keto, you can have more vegetables and occasionally whole grains without breaking the diet.',
      },
    ],
    badge: { v: '100g', l: 'Max Carbs/Day' },
    tableTitle: 'Low-Carb Approved Foods',
    tableLead:
      'Focus on non-starchy vegetables, quality protein, healthy fats, and small amounts of fiber-rich whole grains.',
    table: [
      { food: 'Broccoli', serving: '1 cup', carbs: '4g', fat: '0g', pro: '3g' },
      { food: 'Salmon', serving: '4oz', carbs: '0g', fat: '12g', pro: '23g' },
      { food: 'Avocado', serving: '1/2', carbs: '6g', fat: '15g', pro: '2g' },
      { food: 'Eggs', serving: '2 large', carbs: '1g', fat: '10g', pro: '12g' },
      { food: 'Almonds', serving: '1oz', carbs: '6g', fat: '14g', pro: '6g' },
      {
        food: 'Greek Yogurt',
        serving: '3/4 cup',
        carbs: '7g',
        fat: '0g',
        pro: '13g',
      },
    ],
    bestFor: [
      {
        icon: '🩺',
        h: 'Diabetics & Pre-Diabetics',
        p: 'Low carb is one of the most effective dietary interventions for blood sugar management.',
      },
      {
        icon: '⚡',
        h: 'Energy Seekers',
        p: 'Without the sugar spikes and crashes, energy levels stay steady throughout the day.',
      },
      {
        icon: '🧘',
        h: 'Beginners to Dieting',
        p: 'More flexible than keto — easier to maintain at restaurants and social events.',
      },
      {
        icon: '⚖️',
        h: 'Weight Loss',
        p: 'Reducing carbs naturally lowers calorie intake for most people without strict calorie counting.',
      },
    ],
    eat: [
      'Non-starchy vegetables — broccoli, spinach, zucchini, peppers',
      'Quality protein — chicken, fish, eggs, lean beef',
      'Healthy fats — avocado, olive oil, nuts',
      'Berries — strawberries, blueberries, raspberries (in moderation)',
      'Legumes — lentils, black beans (moderate portions)',
      'Full-fat dairy — Greek yogurt, cheese',
    ],
    avoid: [
      'Refined grains — white bread, pasta, rice, pastries',
      'Sugar — candy, soda, juice, baked goods',
      'Starchy veg in excess — potatoes, corn, peas',
      'High-sugar fruits in excess — bananas, mango, grapes',
      'Sweetened beverages — fruit juice, sweet tea',
    ],
    howWorks:
      'Drop refined carbs, eat more vegetables and protein, and watch blood sugar and weight stabilize.',
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  },
  {
    id: 'gf',
    name: 'Gluten-Free Diet',
    italic: 'Whole-Food Foundations',
    tag: 'No wheat, barley or rye',
    pill: 'Health Need',
    pillColor: '#10b981',
    cats: ['health', 'lifestyle'],
    subtitle: 'No wheat, barley or rye',
    desc: 'Practical, tasty recipes using everyday gluten-free staples. No wheat, barley or rye, with full macros and portions.',
    longDesc:
      'Gluten-free eating done right — focused on naturally gluten-free whole foods, not expensive processed substitutes.',
    features: ['Whole-food focus', 'Clear shopping labels', 'Family-friendly'],
    benefits: ['Gut Comfort', 'Less Bloating', 'More Energy'],
    whatIs:
      'A gluten-free diet eliminates the protein gluten, found in wheat, barley, rye, and many processed foods. Essential for celiac disease and helpful for gluten sensitivity.',
    keyPoints: [
      {
        h: 'Naturally Gluten-Free',
        p: 'Build meals around rice, quinoa, potatoes, fruit, veg, meat, fish, dairy, eggs.',
      },
      {
        h: 'Watch Hidden Sources',
        p: 'Soy sauce, oats (cross-contamination), seasoning blends, and beer sneak gluten in.',
      },
      {
        h: 'Read Labels Carefully',
        p: 'Look for certified GF labels, especially on processed foods, oats, and condiments.',
      },
    ],
    badge: { v: '100%', l: 'Gluten-Free' },
    tableTitle: 'Naturally Gluten-Free Foods',
    tableLead:
      'Build meals from naturally gluten-free whole foods. These have no gluten by default.',
    table: [
      {
        food: 'Rice (white or brown)',
        serving: '1/2 cup cooked',
        carbs: '22g',
        fat: '0g',
        pro: '2g',
      },
      {
        food: 'Quinoa',
        serving: '1/2 cup',
        carbs: '20g',
        fat: '2g',
        pro: '4g',
      },
      {
        food: 'Sweet Potato',
        serving: '1 medium',
        carbs: '24g',
        fat: '0g',
        pro: '2g',
      },
      { food: 'Eggs', serving: '2 large', carbs: '1g', fat: '10g', pro: '12g' },
      {
        food: 'Chicken Breast',
        serving: '4oz',
        carbs: '0g',
        fat: '4g',
        pro: '31g',
      },
      { food: 'Salmon', serving: '4oz', carbs: '0g', fat: '12g', pro: '23g' },
    ],
    bestFor: [
      {
        icon: '🩹',
        h: 'Celiac Disease',
        p: 'Strict gluten-free is medically necessary to heal the gut and prevent damage.',
      },
      {
        icon: '😌',
        h: 'Gluten Sensitivity',
        p: 'Reduce bloating, fatigue, and brain fog linked to non-celiac gluten sensitivity.',
      },
      {
        icon: '🌾',
        h: 'IBS Sufferers',
        p: 'Many find symptom relief when removing wheat and barley from their diet.',
      },
      {
        icon: '🛒',
        h: 'Whole-Food Eaters',
        p: 'Naturally GF whole foods are already the heart of any healthy diet.',
      },
    ],
    eat: [
      'Whole grains (GF) — rice, quinoa, buckwheat, millet',
      'Starches — potatoes, sweet potato, plantain, corn',
      'Proteins — meat, fish, eggs, legumes (all naturally GF)',
      'Dairy — milk, yogurt, cheese (check flavorings)',
      'Fruits & vegetables — all fresh and frozen',
      'GF flours — almond, coconut, rice, tapioca',
    ],
    avoid: [
      'Wheat & wheat products — bread, pasta, pastries',
      'Barley — beer, malt, malt vinegar',
      'Rye — rye bread, some crackers',
      'Regular oats — unless certified GF',
      'Soy sauce — most contain wheat (use tamari)',
      'Hidden gluten — many sauces, seasoning blends',
    ],
    howWorks:
      'Remove wheat, barley, and rye. Build meals from naturally gluten-free whole foods.',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
  },
]

// ─── Diet Plans List View ─────────────────────────────────────────────────────

function DietPlansView({
  setTab,
  showToast,
}: {
  setTab: (t: string, d?: any) => void
  showToast: (m: string) => void
}) {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [view, setView] = useState<'list' | 'detail'>('list')

  const openDetail = (plan: any) => {
    setSelectedPlan(plan)
    setView('detail')
    setTab('diet-detail', plan)
  }

  const goBack = () => {
    setView('list')
    setSelectedPlan(null)
    setTab('diet-plans')
  }

  if (view === 'detail' && selectedPlan) {
    return (
      <DietDetailView
        plan={selectedPlan}
        onBack={goBack}
        showToast={showToast}
      />
    )
  }

  const cats = ['all', 'popular', 'weight-loss', 'health', 'lifestyle', 'gut']
  const catLabels: Record<string, string> = {
    all: 'All',
    popular: 'Popular',
    'weight-loss': 'Weight Loss',
    health: 'Health Condition',
    lifestyle: 'Lifestyle',
    gut: 'Gut Health',
  }

  const filtered = DIET_PLANS_DATA.filter((d) => {
    const matchCat = activeCat === 'all' || d.cats.includes(activeCat)
    const q = search.toLowerCase()
    const matchQ =
      !q || d.name.toLowerCase().includes(q) || d.tag.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '52px 32px 56px',
          overflow: 'hidden',
        }}
      >
        {/* BG blobs */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -80,
            width: 500,
            height: 500,
            background:
              'radial-gradient(circle, rgba(108,92,231,0.15), transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -60,
            width: 400,
            height: 400,
            background:
              'radial-gradient(circle, rgba(245,130,174,0.12), transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: K.primarySoft,
              color: K.primary,
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            <Sparkles size={12} /> Discover Your Perfect Plan
          </div>

          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              margin: '0 0 16px',
              color: K.text,
            }}
          >
            Meal Plans by{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 700,
                background: K.gradBrand,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Diet Type
            </em>
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: K.textMuted,
              maxWidth: 520,
              margin: '0 auto 28px',
              fontWeight: 500,
            }}
          >
            Browse 30+ meal plans organized by diet type and calorie goal. Each
            includes recipes, macros, and a grocery list — personalized to your
            taste and goals.
          </p>

          {/* Search */}
          <div
            style={{ position: 'relative', maxWidth: 440, margin: '0 auto' }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: K.textMuted,
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plans (e.g., keto, mediterranean...)"
              style={{
                width: '100%',
                padding: '13px 16px 13px 40px',
                borderRadius: 14,
                border: `1px solid ${K.border}`,
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                fontSize: 14,
                fontFamily: 'inherit',
                color: K.text,
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 4px 16px rgba(34,18,64,0.06)',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 32px 56px' }}>
        {/* ── Calorie-Based Plans ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 56 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: K.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                By Calories
              </div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  margin: '0 0 6px',
                  color: K.text,
                }}
              >
                Calorie-Based Plans
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: K.textMuted,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Choose a calorie target that fits your goals.
              </p>
            </div>
          </div>

          {/* Horizontal scroll grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 14,
            }}
          >
            {CAL_PLANS.slice(0, 5).map((cp) => (
              <CalCard
                key={cp.id}
                cp={cp}
                onClick={() => openDetail({ ...cp, isCalPlan: true })}
              />
            ))}
          </div>
        </div>

        {/* ── Diet & Health Plans ──────────────────────────────────────────── */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: K.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 6,
              }}
            >
              By Diet Type
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '0 0 6px',
                color: K.text,
              }}
            >
              Diet &amp; Health Plans
            </h2>
            <p
              style={{
                fontSize: 14,
                color: K.textMuted,
                margin: '0 0 16px',
                fontWeight: 500,
              }}
            >
              Find the right plan for your lifestyle, health goals, or dietary
              needs.
            </p>
          </div>

          {/* Filter tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background:
                    activeCat === cat ? K.gradBrand : 'rgba(255,255,255,0.85)',
                  color: activeCat === cat ? '#fff' : K.textMuted,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.15s',
                  boxShadow:
                    activeCat === cat
                      ? '0 4px 14px rgba(108,92,231,0.35)'
                      : 'none',
                }}
              >
                {catLabels[cat]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: K.textMuted,
                padding: '60px 20px',
                fontWeight: 500,
              }}
            >
              No plans match those filters.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 20,
              }}
            >
              {filtered.map((dp) => (
                <DietCard
                  key={dp.id}
                  dp={dp}
                  onOpen={() => openDetail(dp)}
                  showToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Calorie Card ─────────────────────────────────────────────────────────────
function CalCard({
  cp,
  onClick,
}: {
  cp: (typeof CAL_PLANS)[0]
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: K.cardBg,
        border: `1px solid ${K.border}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        backdropFilter: 'blur(16px)',
        transform: hovered ? 'translateY(-3px)' : '',
        boxShadow: hovered ? '0 12px 32px rgba(34,18,64,0.12)' : 'none',
      }}
    >
      <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
        <img
          src={cp.img}
          alt={cp.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: cp.pillColor,
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 999,
          }}
        >
          {cp.pill}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h4
          style={{
            fontSize: 14,
            fontWeight: 800,
            margin: '0 0 6px',
            color: K.text,
            letterSpacing: '-0.02em',
          }}
        >
          {cp.cal} Calorie Meal Plan
        </h4>
        <p
          style={{
            fontSize: 11.5,
            color: K.textMuted,
            margin: '0 0 12px',
            lineHeight: 1.5,
            fontWeight: 500,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as any,
          }}
        >
          {cp.desc}
        </p>
        <button
          style={{
            width: '100%',
            background: K.gradBrand,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '9px 0',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          View Plan <ArrowRight size={11} />
        </button>
      </div>
    </div>
  )
}

// ─── Diet Card ────────────────────────────────────────────────────────────────
function DietCard({
  dp,
  onOpen,
  showToast,
}: {
  dp: (typeof DIET_PLANS_DATA)[0]
  onOpen: () => void
  showToast: (m: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        background: K.cardBg,
        border: `1px solid ${K.border}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        backdropFilter: 'blur(16px)',
        transform: hovered ? 'translateY(-3px)' : '',
        boxShadow: hovered ? '0 12px 32px rgba(34,18,64,0.12)' : 'none',
      }}
    >
      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
        <img
          src={dp.img}
          alt={dp.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            fontSize: 11,
            fontWeight: 700,
            color: K.textSub,
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          {dp.pill}
        </div>
      </div>
      <div style={{ padding: '18px 20px 20px' }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            margin: '0 0 4px',
            color: K.text,
            letterSpacing: '-0.02em',
          }}
        >
          {dp.name}
        </h3>
        <div
          style={{
            fontSize: 12.5,
            color: dp.pillColor,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          {dp.subtitle}
        </div>
        <p
          style={{
            fontSize: 13,
            color: K.textMuted,
            margin: '0 0 14px',
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {dp.desc}
        </p>
        <ul
          style={{
            listStyle: 'none',
            margin: '0 0 16px',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {dp.features.map((f) => (
            <li
              key={f}
              style={{
                fontSize: 12.5,
                color: K.textSub,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Check size={12} color={K.leaf} strokeWidth={3} /> {f}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 10,
              border: `1px solid ${K.border}`,
              background: 'transparent',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              color: K.textSub,
              fontFamily: 'inherit',
            }}
          >
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              showToast(`Starting ${dp.name} plan...`)
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 10,
              border: 'none',
              background: K.gradBrand,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              color: '#fff',
              fontFamily: 'inherit',
            }}
          >
            Start Plan
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Diet Detail View ─────────────────────────────────────────────────────────
function DietDetailView({
  plan,
  onBack,
  showToast,
}: {
  plan: any
  onBack: () => void
  showToast: (m: string) => void
}) {
  const isCalPlan = !!plan?.isCalPlan // ← ADD THIS LINE HERE

  if (!plan) return null
  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        fontFamily: "'Outfit', system-ui, sans-serif",
        background: 'transparent',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '16px 28px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: K.textMuted,
          fontSize: 13.5,
          fontWeight: 600,
          fontFamily: 'inherit',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = K.text)}
        onMouseLeave={(e) => (e.currentTarget.style.color = K.textMuted)}
      >
        <ChevronLeft size={16} /> Back to all plans
      </button>

      {/* Hero */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px 32px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 400,
            background:
              'radial-gradient(ellipse, rgba(108,92,231,0.13), transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              margin: '0 0 16px',
              color: K.text,
            }}
          >
            {isCalPlan ? (
              <>
                {plan.cal} Calorie
                <br />
                <em
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 700,
                    background: K.gradBrand,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Meal Plan
                </em>
              </>
            ) : (
              <>
                {plan.name.replace(' Diet', '').replace(' Meal Plan', '')} Meal
                Plan
                <br />
                <em
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 700,
                    background: K.gradBrand,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {plan.italic}
                </em>
              </>
            )}
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: K.textMuted,
              maxWidth: 580,
              margin: '0 auto 32px',
              fontWeight: 500,
            }}
          >
            {isCalPlan ? plan.desc : plan.longDesc}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() =>
                showToast(
                  `Creating your ${isCalPlan ? plan.cal + ' cal' : plan.name} plan...`,
                )
              }
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                border: 'none',
                background: K.gradBrand,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 6px 24px rgba(108,92,231,0.35)',
              }}
            >
              {isCalPlan
                ? 'Create My Plan'
                : `Create My ${plan.name.split(' ')[0]} Plan`}
            </button>
            <button
              onClick={() => showToast('Loading sample menu...')}
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                border: `1.5px solid ${K.border}`,
                background: 'rgba(255,255,255,0.85)',
                color: K.text,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                backdropFilter: 'blur(8px)',
              }}
            >
              View Sample Menu
            </button>
          </div>
        </div>
      </div>

      {/* Benefits strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '20px 32px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderTop: `1px solid ${K.border}`,
          borderBottom: `1px solid ${K.border}`,
          flexWrap: 'wrap',
        }}
      >
        {(isCalPlan
          ? ['Macro-Balanced', 'High Protein', 'Auto Grocery List']
          : plan.benefits
        ).map((b: string) => (
          <div
            key={b}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: K.textSub,
            }}
          >
            <Check size={14} color={K.leaf} strokeWidth={3} /> {b}
          </div>
        ))}
      </div>

      <div style={{ padding: '0 32px 64px', maxWidth: 900, margin: '0 auto' }}>
        {/* About */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
              color: K.text,
            }}
          >
            About this plan
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: K.textMuted,
              maxWidth: 640,
              margin: '0 auto',
              fontWeight: 500,
            }}
          >
            {isCalPlan
              ? `${plan.desc} This plan is structured to keep you satiated through high-protein meals, fiber-rich produce, and strategic carb timing.`
              : plan.whatIs}
          </p>
        </div>

        {/* Only for non-calorie plans: full detail sections */}
        {!isCalPlan && (
          <>
            {/* Image + What is section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 32,
                alignItems: 'center',
                marginBottom: 48,
              }}
            >
              <div
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/3',
                }}
              >
                <img
                  src={plan.img}
                  alt={plan.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 16,
                    padding: '12px 16px',
                    textAlign: 'center',
                    border: `1px solid ${K.border}`,
                  }}
                >
                  <div
                    style={{ fontSize: 22, fontWeight: 800, color: K.primary }}
                  >
                    {plan.badge.v}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: K.textMuted,
                    }}
                  >
                    {plan.badge.l}
                  </div>
                </div>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    margin: '0 0 12px',
                    color: K.text,
                  }}
                >
                  What is the {plan.name.split(' ')[0]} Diet?
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: K.textMuted,
                    margin: '0 0 20px',
                    fontWeight: 500,
                  }}
                >
                  {plan.whatIs}
                </p>
                {plan.keyPoints.map((kp: any) => (
                  <div key={kp.h} style={{ marginBottom: 16 }}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: K.text,
                        margin: '0 0 4px',
                      }}
                    >
                      {kp.h}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: K.textMuted,
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {kp.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Food table */}
            <div style={{ marginBottom: 48 }}>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px',
                  color: K.text,
                }}
              >
                {plan.tableTitle}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: K.textMuted,
                  margin: '0 0 20px',
                  lineHeight: 1.55,
                }}
              >
                {plan.tableLead}
              </p>
              <div
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: `1px solid ${K.border}`,
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr style={{ background: 'rgba(108,92,231,0.06)' }}>
                      {['Food', 'Serving', 'Net Carbs', 'Fat', 'Protein'].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: '12px 16px',
                              textAlign: 'left',
                              fontWeight: 700,
                              color: K.textSub,
                              fontSize: 12,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {plan.table.map((row: any, i: number) => (
                      <tr
                        key={i}
                        style={{ borderTop: `1px solid ${K.border}` }}
                      >
                        <td
                          style={{
                            padding: '12px 16px',
                            fontWeight: 600,
                            color: K.text,
                          }}
                        >
                          {row.food}
                        </td>
                        <td
                          style={{ padding: '12px 16px', color: K.textMuted }}
                        >
                          {row.serving}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            color: K.primary,
                            fontWeight: 600,
                          }}
                        >
                          {row.carbs}
                        </td>
                        <td
                          style={{ padding: '12px 16px', color: K.textMuted }}
                        >
                          {row.fat}
                        </td>
                        <td
                          style={{ padding: '12px 16px', color: K.textMuted }}
                        >
                          {row.pro}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Who is it for */}
            <div style={{ marginBottom: 48, textAlign: 'center' }}>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px',
                  color: K.text,
                }}
              >
                Who is the {plan.name.split(' ')[0]} Diet For?
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: K.textMuted,
                  margin: '0 0 24px',
                  lineHeight: 1.55,
                }}
              >
                {plan.name} works best for people who thrive on structure and
                the specific benefits below.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  textAlign: 'left',
                }}
              >
                {plan.bestFor.map((b: any) => (
                  <div
                    key={b.h}
                    style={{
                      borderRadius: 20,
                      padding: '20px',
                      background: 'rgba(255,255,255,0.85)',
                      border: `1px solid ${K.border}`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>
                      {b.icon}
                    </div>
                    <h4
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: K.text,
                        margin: '0 0 6px',
                      }}
                    >
                      {b.h}
                    </h4>
                    <p
                      style={{
                        fontSize: 13,
                        color: K.textMuted,
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {b.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eat & Avoid */}
            <div style={{ marginBottom: 48 }}>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px',
                  color: K.text,
                  textAlign: 'center',
                }}
              >
                What to Eat &amp; What to Avoid
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: K.textMuted,
                  margin: '0 0 24px',
                  lineHeight: 1.55,
                  textAlign: 'center',
                }}
              >
                The simple rules that make this diet work.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                {/* Eat */}
                <div
                  style={{
                    borderRadius: 20,
                    padding: '20px',
                    background: 'rgba(91,191,133,0.07)',
                    border: `1px solid rgba(91,191,133,0.2)`,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(91,191,133,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={14} color={K.leaf} strokeWidth={3} />
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#2d7a50',
                      }}
                    >
                      Approved Foods
                    </span>
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {plan.eat.map((item: string, i: number) => {
                      const parts = item.split(' — ')
                      return (
                        <li
                          key={i}
                          style={{
                            fontSize: 13,
                            color: K.textSub,
                            lineHeight: 1.5,
                          }}
                        >
                          {parts.length === 2 ? (
                            <>
                              <strong>{parts[0]}</strong>
                              {' — '}
                              {parts[1]}
                            </>
                          ) : (
                            item
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                {/* Avoid */}
                <div
                  style={{
                    borderRadius: 20,
                    padding: '20px',
                    background: 'rgba(245,130,174,0.07)',
                    border: `1px solid rgba(245,130,174,0.2)`,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(245,130,174,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={14} color={K.accent} strokeWidth={3} />
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#a3234e',
                      }}
                    >
                      Foods to Avoid
                    </span>
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {plan.avoid.map((item: string, i: number) => {
                      const parts = item.split(' — ')
                      return (
                        <li
                          key={i}
                          style={{
                            fontSize: 13,
                            color: K.textSub,
                            lineHeight: 1.5,
                          }}
                        >
                          {parts.length === 2 ? (
                            <>
                              <strong>{parts[0]}</strong>
                              {' — '}
                              {parts[1]}
                            </>
                          ) : (
                            item
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* How it works CTA */}
            <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px',
                  color: K.text,
                }}
              >
                How the {plan.name.split(' ')[0]} Diet Works
              </h2>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: K.textMuted,
                  maxWidth: 500,
                  margin: '0 auto 24px',
                  fontWeight: 500,
                }}
              >
                {plan.howWorks}
              </p>
              <button
                onClick={() => showToast(`Starting ${plan.name} plan...`)}
                style={{
                  padding: '14px 32px',
                  borderRadius: 999,
                  border: 'none',
                  background: K.gradBrand,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 24px rgba(108,92,231,0.35)',
                }}
              >
                Start {plan.name.split(' ')[0]} Plan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
// ─── AI Nutritionist View ─────────────────────────────────────────────────────
// Replace your existing AInutriView function with this one.
// All buttons call setTab('chef') to navigate to Chef AI tab.
// Design matches the HTML reference exactly, using Kira app theme tokens.

function AInutriView({
  setTab,
}: {
  showToast: (m: string) => void
  setTab: (t: MealTab) => void
}) {
  const compareRows = [
    {
      label: 'Availability',
      trad: 'Office hours, book days ahead',
      ai: ['24/7', ' — responds in seconds'],
    },
    {
      label: 'Cost',
      trad: '$500 / month',
      ai: ['$149', ' / month'],
    },
    {
      label: 'Plan changes',
      trad: 'Email, wait 1–2 days for update',
      ai: ['Instant', " — text and it's done"],
    },
    {
      label: 'Meal tracking',
      trad: 'You log everything manually',
      ai: ['Send a photo', ' or text — auto-logged'],
    },
    {
      label: 'Eating out',
      trad: "No guidance — you're on your own",
      ai: ['Send the menu', ' — get the best pick'],
    },
    {
      label: 'Grocery list',
      trad: 'Write your own from recipes',
      ai: ['Auto-generated', ' weekly'],
    },
    {
      label: 'Diet types',
      trad: "Limited to coach's expertise",
      ai: ['30+', ' — keto, vegan, carnivore...'],
    },
    {
      label: 'Accountability',
      trad: "Weekly check-in if you're lucky",
      ai: ['Daily nudges', ' — zero judgment'],
    },
    {
      label: 'Adapts to you',
      trad: 'Same plan for weeks',
      ai: ['Every message', ' makes it smarter'],
    },
  ]

  const testimonials = [
    {
      quote:
        "I've tried MyFitnessPal, Noom, and two human coaches. This is the first thing that actually sticks — because it adapts when my plans change instead of making me feel guilty.",
      name: 'Sarah K.',
      meta: 'Lost 28 lbs in 4 months',
    },
    {
      quote:
        "As a software engineer who works 12-hour days, I never had time to meal plan. Now my AI diet coach handles everything — I just eat what it tells me and I'm in the best shape of my life.",
      name: 'Marcus T.',
      meta: 'Gained 12 lbs lean muscle',
    },
    {
      quote:
        'Managing celiac disease and being vegan used to mean hours of recipe research. My personal AI nutritionist generates compliant meals instantly. It changed my life.',
      name: 'Priya R.',
      meta: 'Celiac + Vegan',
    },
  ]

  const goToChef = () => setTab('chef')

  // ── Shared inline styles ────────────────────────────────────────────────────
  const sectionStyle: React.CSSProperties = {
    padding: '64px 48px',
    position: 'relative',
  }

  const sectionHeadStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: 48,
  }

  const h2Style: React.CSSProperties = {
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: '-0.035em',
    lineHeight: 1.1,
    margin: '0 0 12px',
    color: K.text,
  }

  const subStyle: React.CSSProperties = {
    fontSize: 16,
    color: K.textMuted,
    fontWeight: 500,
    maxWidth: 560,
    margin: '0 auto',
    lineHeight: 1.55,
  }

  const startBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 32px',
    background: K.gradBrand,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 8px 28px rgba(108,92,231,0.4)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* ── Background blobs matching HTML --bg-gradient ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(900px 600px at 90% -10%, rgba(216,197,245,0.4) 0%, transparent 55%), radial-gradient(700px 500px at 5% 5%, rgba(197,213,245,0.4) 0%, transparent 50%), radial-gradient(800px 600px at 50% 110%, rgba(245,197,224,0.35) 0%, transparent 55%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════════ */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
            padding: '72px 56px 64px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* BG glow */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: '30%',
              width: 500,
              height: 400,
              background:
                'radial-gradient(ellipse, rgba(108,92,231,0.12), transparent 65%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          {/* Left: text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                margin: '0 0 18px',
                color: K.text,
              }}
            >
              Your{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AI Nutrition
              </em>
              <br />
              Coach — 24/7
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: K.textMuted,
                maxWidth: 420,
                margin: '0 0 28px',
                fontWeight: 500,
              }}
            >
              A Kira AI agent that learns your taste, tracks your macros, and
              builds your meal plan in real time. No appointments. No guesswork.
            </p>

            {/* CTA button */}
            <button
              onClick={goToChef}
              style={startBtnStyle}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-2px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 16px 40px rgba(108,92,231,0.45)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 28px rgba(108,92,231,0.4)'
              }}
            >
              Start Now
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            {/* Social proof */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 20,
              }}
            >
              {/* Avatar stack */}
              <div style={{ display: 'flex' }}>
                {[
                  {
                    initials: 'SK',
                    bg: 'linear-gradient(135deg,#f582ae,#e85a8a)',
                  },
                  {
                    initials: 'MT',
                    bg: 'linear-gradient(135deg,#6c5ce7,#a78bfa)',
                  },
                  {
                    initials: 'PR',
                    bg: 'linear-gradient(135deg,#a78bfa,#f582ae)',
                  },
                ].map((av, i) => (
                  <div
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: av.bg,
                      border: '2px solid #fff',
                      marginLeft: i === 0 ? 0 : -8,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#fff',
                      boxShadow: '0 2px 6px rgba(34,18,64,0.15)',
                    }}
                  >
                    {av.initials}
                  </div>
                ))}
              </div>
              <div
                style={{ fontSize: 14, color: K.textMuted, fontWeight: 500 }}
              >
                Trusted by{' '}
                <strong style={{ color: K.text, fontWeight: 800 }}>
                  24,000+
                </strong>{' '}
                users
                <span
                  style={{
                    display: 'inline-flex',
                    gap: 2,
                    marginLeft: 8,
                    color: '#f5b800',
                    verticalAlign: 'middle',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="#f5b800" color="#f5b800" />
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Right: illustration card */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Glow behind card */}
            <div
              style={{
                position: 'absolute',
                width: 300,
                height: 300,
                background:
                  'radial-gradient(circle, rgba(108,92,231,0.2), rgba(245,130,174,0.15), transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />

            {/* Main coach card */}
            <div
              style={{
                position: 'relative',
                width: 220,
                height: 220,
                borderRadius: 32,
                background:
                  'linear-gradient(135deg, rgba(108,92,231,0.15) 0%, rgba(245,130,174,0.15) 100%)',
                border: `1px solid rgba(108,92,231,0.2)`,
                backdropFilter: 'blur(20px)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 24px 60px rgba(108,92,231,0.2)',
              }}
            >
              <span style={{ fontSize: 80 }}>🥗</span>

              {/* Top-left badge: response time */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  left: -28,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(34,18,64,0.12)',
                  border: `1px solid ${K.border}`,
                  minWidth: 150,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: K.primarySoft,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: K.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Response time
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: K.text }}>
                    &lt; 2 seconds
                  </div>
                </div>
              </div>

              {/* Bottom-right badge: today's protein */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  right: -28,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(34,18,64,0.12)',
                  border: `1px solid ${K.border}`,
                  minWidth: 150,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: K.leafSoft,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  🎯
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: K.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Today
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: K.text }}>
                    148g protein
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — HOW IT WORKS
        ══════════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={h2Style}>
              How It{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Works
              </em>
            </h2>
            <p style={subStyle}>
              From zero to personalized meal plan in under 2 minutes.
            </p>
          </div>

          {/* Timeline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              maxWidth: 860,
              margin: '0 auto',
              position: 'relative',
            }}
          >
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: 24,
                top: 48,
                bottom: 48,
                width: 2,
                background:
                  'linear-gradient(180deg, rgba(108,92,231,0.3) 0%, rgba(245,130,174,0.3) 100%)',
                borderRadius: 2,
              }}
            />

            {/* Step 1 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr',
                gap: 32,
                alignItems: 'center',
                paddingBottom: 48,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: K.gradBrand,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  boxShadow: '0 6px 18px rgba(108,92,231,0.35)',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.primary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  Quick Chat
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    margin: '0 0 8px',
                    color: K.text,
                  }}
                >
                  Tell it about you
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: K.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Goals, preferences, allergies, schedule — a fast
                  conversational onboarding. No forms.
                </p>
              </div>
              {/* Visual: chat bubbles */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 18,
                  padding: 20,
                  border: `1px solid ${K.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {[
                  { text: "What's your main goal?", isBot: true },
                  { text: 'Lose weight, build muscle', isBot: false },
                  { text: 'Any food allergies?', isBot: true },
                  { text: 'Lactose intolerant', isBot: false },
                ].map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 14px',
                        borderRadius: msg.isBot
                          ? '4px 14px 14px 14px'
                          : '14px 4px 14px 14px',
                        background: msg.isBot
                          ? 'rgba(244,241,251,0.9)'
                          : K.gradBrand,
                        color: msg.isBot ? K.textSub : '#fff',
                        fontSize: 13,
                        fontWeight: 600,
                        maxWidth: '80%',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr',
                gap: 32,
                alignItems: 'center',
                paddingBottom: 48,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: K.gradBrand,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  boxShadow: '0 6px 18px rgba(108,92,231,0.35)',
                }}
              >
                2
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.primary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  Instant Generation
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    margin: '0 0 8px',
                    color: K.text,
                  }}
                >
                  Get your plan
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: K.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  AI builds a full 7-day meal plan with exact macros, recipes,
                  and a grocery list — in under 60 seconds.
                </p>
              </div>
              {/* Visual: kcal bars */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 18,
                  padding: 20,
                  border: `1px solid ${K.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  { day: 'Mon', kcal: '2,080 kcal', pct: 100 },
                  { day: 'Tue', kcal: '1,940 kcal', pct: 92 },
                  { day: 'Wed', kcal: '2,150 kcal', pct: 100 },
                  { day: 'Thu', kcal: '2,020 kcal', pct: 96 },
                ].map((row) => (
                  <div
                    key={row.day}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: K.textMuted,
                        width: 28,
                        flexShrink: 0,
                      }}
                    >
                      {row.day}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 8,
                        background: K.primarySoft,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: `${row.pct}%`,
                          background:
                            'linear-gradient(90deg, rgba(108,92,231,0.25), rgba(167,139,250,0.25))',
                          borderRadius: 8,
                        }}
                      />
                      <span
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          fontSize: 12,
                          fontWeight: 700,
                          color: K.primary,
                          lineHeight: '28px',
                          paddingLeft: 10,
                        }}
                      >
                        {row.kcal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr',
                gap: 32,
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: K.gradBrand,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  boxShadow: '0 6px 18px rgba(108,92,231,0.35)',
                }}
              >
                3
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: K.primary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  Ongoing Adaptation
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    margin: '0 0 8px',
                    color: K.text,
                  }}
                >
                  It adapts with you
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: K.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Ate out? Changed plans? Just message your coach — it
                  rebalances everything in real time.
                </p>
              </div>
              {/* Visual: adapt chat */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 18,
                  padding: 20,
                  border: `1px solid ${K.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderRadius: '14px 4px 14px 14px',
                      background: K.gradBrand,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      maxWidth: '85%',
                    }}
                  >
                    Had pizza for lunch
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderRadius: '4px 14px 14px 14px',
                      background: 'rgba(244,241,251,0.9)',
                      color: K.textSub,
                      fontSize: 13,
                      fontWeight: 500,
                      maxWidth: '85%',
                      lineHeight: 1.5,
                    }}
                  >
                    Got it. Adjusted dinner: grilled chicken salad — you'll
                    still hit 148g protein today.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — WHAT YOUR AI COACH ACTUALLY DOES
        ══════════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={h2Style}>
              What Your AI Coach{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Actually Does
              </em>
            </h2>
            <p style={subStyle}>
              It lives in your chat. It messages you. It thinks for you.
            </p>
          </div>

          {/* Feature grid: 1 large left + 2 small right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr',
              gridTemplateRows: 'auto auto',
              gap: 16,
              maxWidth: 960,
              margin: '0 auto',
            }}
          >
            {/* Large card: Ask anything */}
            <div
              style={{
                gridRow: '1 / 3',
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                borderRadius: 24,
                border: `1px solid ${K.border}`,
                padding: '28px 28px 0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: K.primary,
                  background: K.primarySoft,
                  padding: '4px 12px',
                  borderRadius: 999,
                  marginBottom: 14,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                In-App Chat
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: '0 0 8px',
                  color: K.text,
                  letterSpacing: '-0.025em',
                }}
              >
                Ask anything, anytime
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: K.textMuted,
                  lineHeight: 1.6,
                  margin: '0 0 14px',
                  fontWeight: 500,
                }}
              >
                No forms to fill. Just text your coach like you'd text a friend
                — it responds in seconds with personalized advice.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {[
                  '"What should I eat right now?"',
                  '"I just had pizza — fix my dinner"',
                  '"Give me a high-protein snack under 200 kcal"',
                ].map((q) => (
                  <li
                    key={q}
                    style={{
                      fontSize: 13,
                      color: K.textSub,
                      fontWeight: 500,
                      padding: '7px 12px',
                      background: K.primarySoft,
                      borderRadius: 8,
                      border: `1px solid rgba(108,92,231,0.12)`,
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>

              {/* Chat frame */}
              <div
                style={{
                  background: 'rgba(244,241,251,0.7)',
                  borderRadius: '18px 18px 0 0',
                  overflow: 'hidden',
                  border: `1px solid ${K.border}`,
                  borderBottom: 'none',
                  flex: 1,
                }}
              >
                {/* Chat header */}
                <div
                  style={{
                    background: K.gradBrand,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.25)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    AI
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#fff',
                      }}
                    >
                      AI Nutritionist
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#5bbf85',
                          display: 'inline-block',
                        }}
                      />
                      online
                    </div>
                  </div>
                </div>
                {/* Chat body */}
                <div
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      padding: '10px 13px',
                      background: '#fff',
                      borderRadius: '4px 14px 14px 14px',
                      fontSize: 12.5,
                      color: K.textSub,
                      lineHeight: 1.55,
                      border: `1px solid ${K.border}`,
                      maxWidth: '85%',
                    }}
                  >
                    Good morning! Here's your plan for today:
                    <br />
                    <br />
                    <strong>Breakfast:</strong> Oatmeal + berries + protein
                    shake (420 kcal)
                    <br />
                    <strong>Lunch:</strong> Chicken wrap + avocado (580 kcal)
                    <br />
                    <strong>Dinner:</strong> Salmon + quinoa bowl (640 kcal)
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: K.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    7:02 AM
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        padding: '10px 13px',
                        background: K.gradBrand,
                        borderRadius: '14px 4px 14px 14px',
                        fontSize: 12.5,
                        color: '#fff',
                        maxWidth: '80%',
                      }}
                    >
                      I'm eating out tonight, going to an Italian place
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: K.textMuted,
                      fontWeight: 500,
                      textAlign: 'right',
                    }}
                  >
                    5:14 PM
                  </div>
                  <div
                    style={{
                      padding: '10px 13px',
                      background: '#fff',
                      borderRadius: '4px 14px 14px 14px',
                      fontSize: 12.5,
                      color: K.textSub,
                      lineHeight: 1.55,
                      border: `1px solid ${K.border}`,
                      maxWidth: '85%',
                    }}
                  >
                    No problem! Order the grilled salmon with veggies, skip the
                    bread basket. You'll hit 148g protein today.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Smart notifications */}
            <div
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                borderRadius: 24,
                border: `1px solid ${K.border}`,
                padding: '24px 24px',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#e85a8a',
                  background: K.accentSoft,
                  padding: '4px 12px',
                  borderRadius: 999,
                  marginBottom: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Smart Notifications
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  margin: '0 0 6px',
                  color: K.text,
                  letterSpacing: '-0.02em',
                }}
              >
                It reaches out to you
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: K.textMuted,
                  lineHeight: 1.55,
                  margin: '0 0 16px',
                  fontWeight: 500,
                }}
              >
                Your coach doesn't wait for you to ask. It sends timely nudges
                throughout the day.
              </p>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {[
                  {
                    time: '7:00 AM',
                    msg: 'Your meal plan for today is ready. Tap to view.',
                    iconBg: K.primarySoft,
                    iconColor: K.primary,
                    icon: '🔔',
                  },
                  {
                    time: '12:30 PM',
                    msg: 'Time for lunch! Try the chicken wrap from your plan.',
                    iconBg: K.goldSoft,
                    iconColor: '#b87a1c',
                    icon: '🕐',
                  },
                  {
                    time: '8:00 PM',
                    msg: 'How was your day? Log dinner so I can plan tomorrow.',
                    iconBg: K.primarySoft,
                    iconColor: K.primary,
                    icon: '✨',
                  },
                ].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'rgba(244,241,251,0.6)',
                      borderRadius: 12,
                      border: `1px solid ${K.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: n.iconBg,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {n.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: K.textMuted,
                          marginBottom: 2,
                        }}
                      >
                        {n.time}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: K.textSub,
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {n.msg}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Life changes, plan follows */}
            <div
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(16px)',
                borderRadius: 24,
                border: `1px solid ${K.border}`,
                padding: '24px 24px',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#2db876',
                  background: K.leafSoft,
                  padding: '4px 12px',
                  borderRadius: 999,
                  marginBottom: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Adapts Instantly
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  margin: '0 0 6px',
                  color: K.text,
                  letterSpacing: '-0.02em',
                }}
              >
                Life changes, plan follows
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: K.textMuted,
                  lineHeight: 1.55,
                  margin: '0 0 16px',
                  fontWeight: 500,
                }}
              >
                Ate something off-plan? Changed your schedule? The coach
                rebalances everything automatically.
              </p>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {[
                  {
                    from: 'You say: "Had a big lunch"',
                    to: 'Dinner adjusted to lighter option',
                  },
                  {
                    from: 'You say: "Skipping gym"',
                    to: 'Carbs reduced, protein steady',
                  },
                  {
                    from: 'You say: "Vegetarian for a week"',
                    to: 'All meals swapped instantly',
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        padding: '7px 10px',
                        background: 'rgba(244,241,251,0.8)',
                        borderRadius: 8,
                        fontSize: 12,
                        color: K.textSub,
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {row.from}
                    </div>
                    <ArrowRight size={13} color={K.primary} strokeWidth={2.5} />
                    <div
                      style={{
                        padding: '7px 10px',
                        background: K.primarySoft,
                        borderRadius: 8,
                        fontSize: 12,
                        color: K.primary,
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {row.to}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 4 — COMPARISON TABLE
        ══════════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={h2Style}>
              AI Coach vs.{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Traditional Nutritionist
              </em>
            </h2>
            <p style={subStyle}>
              Same quality guidance. Fraction of the cost. Zero scheduling.
            </p>
          </div>

          <div
            style={{
              maxWidth: 820,
              margin: '0 auto',
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(16px)',
              borderRadius: 24,
              border: `1px solid ${K.border}`,
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                background: K.gradBrand,
              }}
            >
              <div style={{ padding: '16px 20px' }} />
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Users size={14} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Traditional Nutritionist
                </span>
              </div>
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.12)',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Sparkles size={14} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  AI Nutritionist
                </span>
              </div>
            </div>

            {/* Table rows */}
            {compareRows.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  borderTop: `1px solid ${K.border}`,
                  background:
                    i % 2 === 1 ? 'rgba(244,241,251,0.4)' : 'transparent',
                }}
              >
                <div
                  style={{
                    padding: '13px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: K.text,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    padding: '13px 20px',
                    fontSize: 13,
                    color: K.textMuted,
                    fontWeight: 500,
                  }}
                >
                  {row.trad}
                </div>
                <div
                  style={{
                    padding: '13px 20px',
                    fontSize: 13,
                    color: K.textSub,
                    fontWeight: 500,
                    background: K.primarySoft,
                  }}
                >
                  <strong
                    style={{
                      background: K.gradBrand,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                    }}
                  >
                    {row.ai[0]}
                  </strong>
                  {row.ai[1]}
                </div>
              </div>
            ))}
          </div>

          {/* CTA under table */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={goToChef}
              style={startBtnStyle}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-2px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 16px 40px rgba(108,92,231,0.45)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 28px rgba(108,92,231,0.4)'
              }}
            >
              Try It Free
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 5 — TESTIMONIALS
        ══════════════════════════════════════════════════════════ */}
        <section style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={h2Style}>
              What Users Say About{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: K.gradBrand,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Their AI Coach
              </em>
            </h2>
            <p style={subStyle}>
              Thousands of people have already replaced spreadsheets, expensive
              coaches, and guesswork with their 24/7 personal nutrition coach.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 18,
              maxWidth: 960,
              margin: '0 auto',
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 22,
                  border: `1px solid ${K.border}`,
                  padding: '26px 26px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(-4px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 20px 40px rgba(108,92,231,0.12)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = ''
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 2,
                    marginBottom: 14,
                    color: '#f5b800',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="#f5b800" color="#f5b800" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: K.textSub,
                    lineHeight: 1.65,
                    margin: '0 0 18px',
                    fontWeight: 500,
                    fontStyle: 'italic',
                  }}
                >
                  "{t.quote}"
                </p>
                <div style={{ fontSize: 15, fontWeight: 800, color: K.text }}>
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: K.textMuted,
                    marginTop: 3,
                    fontWeight: 500,
                  }}
                >
                  {t.meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 6 — FINAL CTA
        ══════════════════════════════════════════════════════════ */}
        <div style={{ padding: '0 48px 72px' }}>
          <div
            style={{
              background: K.gradBrand,
              borderRadius: 28,
              padding: '56px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative blobs */}
            <div
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 220,
                height: 220,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -60,
                left: -30,
                width: 280,
                height: 280,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  margin: '0 0 16px',
                }}
              >
                Ready to Meet Your AI Nutrition Assistant?
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.82)',
                  maxWidth: 560,
                  margin: '0 auto 32px',
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                The days of stressing over calories, battling rigid diets, and
                paying exorbitant fees for generic meal plans are officially
                over. Join thousands who have already transformed their
                relationship with food.
              </p>
              <button
                onClick={goToChef}
                style={{
                  background: '#fff',
                  color: K.primary,
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.transform =
                    'translateY(-2px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 14px 32px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 8px 24px rgba(0,0,0,0.15)'
                }}
              >
                Start Your Journey <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Import View ──────────────────────────────────────────────────────────────
function ImportView({ showToast }: { showToast: (m: string) => void }) {
  const [importTab, setImportTab] = useState<'url' | 'photo' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const tabs = [
    { id: 'url' as const, label: 'From URL', icon: <Link size={14} /> },
    { id: 'photo' as const, label: 'From photo', icon: <Camera size={14} /> },
    { id: 'text' as const, label: 'From text', icon: <FileText size={14} /> },
  ]

  return (
    <div style={{ padding: '8px 32px 40px', maxWidth: 700, margin: '0 auto' }}>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: '0 0 8px',
          color: K.text,
        }}
      >
        <span
          style={{
            background: K.gradBrand,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Import
        </span>{' '}
        a recipe
      </h2>
      <p
        style={{
          fontSize: 15,
          color: K.textMuted,
          margin: '0 0 28px',
          fontWeight: 500,
          lineHeight: 1.55,
        }}
      >
        Drop a URL, upload a screenshot, or paste raw text — I'll extract the
        title, ingredients, steps, and macros automatically.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          background: 'rgba(244,241,251,0.8)',
          borderRadius: 14,
          padding: 4,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setImportTab(t.id)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 11,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              background: importTab === t.id ? '#fff' : 'transparent',
              color: importTab === t.id ? K.text : K.textMuted,
              boxShadow:
                importTab === t.id ? '0 2px 8px rgba(34,18,64,0.08)' : 'none',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {importTab === 'url' && (
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: K.textSub,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Recipe URL
          </label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.allrecipes.com/..."
              style={{
                flex: 1,
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 12,
                padding: '11px 16px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <KBtn
              variant="brand"
              onClick={() => showToast('Extracting recipe...')}
            >
              <Check size={14} /> Extract
            </KBtn>
          </div>
          <KCard style={{ padding: '20px 24px' }}>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: K.text,
                margin: '0 0 12px',
              }}
            >
              ✨ Works best with
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {[
                'Recipe blogs and major sites (AllRecipes, NYT Cooking, BBC Good Food)',
                'Instagram posts with detailed recipe captions',
                'TikTok videos that include recipe in description',
                'Publicly accessible URLs (not behind paywall)',
              ].map((tip) => (
                <li
                  key={tip}
                  style={{
                    fontSize: 13.5,
                    color: K.textMuted,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontWeight: 500,
                  }}
                >
                  <Check
                    size={14}
                    color={K.leaf}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />{' '}
                  {tip}
                </li>
              ))}
            </ul>
          </KCard>
        </div>
      )}
      {importTab === 'photo' && (
        <div>
          <div
            onClick={() => showToast('Opening file picker...')}
            style={{
              border: `2px dashed ${K.borderMid}`,
              borderRadius: 18,
              padding: '48px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                K.primary)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                K.borderMid)
            }
          >
            <Upload
              size={40}
              color={K.textLight}
              style={{ marginBottom: 12 }}
            />
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: K.textSub,
                marginBottom: 6,
              }}
            >
              Drop a photo or click to upload
            </div>
            <div style={{ fontSize: 13, color: K.textMuted }}>
              JPG, PNG, HEIC — up to 10 MB
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <KBtn
              variant="brand"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => showToast('Extracting from photo...')}
            >
              <Sparkles size={14} /> Extract from photo
            </KBtn>
          </div>
        </div>
      )}
      {importTab === 'text' && (
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: K.textSub,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Paste your recipe
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste the full recipe text..."
            style={{
              width: '100%',
              background: 'rgba(243,244,246,0.8)',
              border: `1px solid ${K.borderMid}`,
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ marginTop: 12 }}>
            <KBtn
              variant="brand"
              onClick={() => showToast('Parsing with AI...')}
            >
              <Sparkles size={14} /> Parse with AI
            </KBtn>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Books View ───────────────────────────────────────────────────────────────
function BooksView({ showToast }: { showToast: (m: string) => void }) {
  const [books, setBooks] = useState(COOKBOOKS)
  const [addOpen, setAddOpen] = useState(false)
  const [newBook, setNewBook] = useState({ name: '', desc: '' })
  return (
    <div style={{ padding: '8px 32px 40px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: 0,
            color: K.text,
          }}
        >
          Cookbooks
        </h2>
        <KBtn
          variant="blue"
          size="sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => setAddOpen(true)}
        >
          <Plus size={13} /> New cookbook
        </KBtn>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {books.map((b) => (
          <KCard
            key={b.id}
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-3px)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 12px 32px rgba(34,18,64,0.12)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform = ''
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
            }}
            onClick={() => showToast(`Opening ${b.name}`)}
          >
            <div
              style={{
                height: 160,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={b.img}
                alt={b.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)',
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setBooks((prev) => prev.filter((cb) => cb.id !== b.id))
                }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Trash2 size={13} />
              </button>
              <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                <BookOpen size={20} color="rgba(255,255,255,0.9)" />
              </div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  margin: '0 0 4px',
                  letterSpacing: '-0.02em',
                  color: K.text,
                }}
              >
                {b.name}
              </h4>
              <p
                style={{
                  fontSize: 12,
                  color: K.textMuted,
                  margin: '0 0 12px',
                  fontWeight: 500,
                }}
              >
                {b.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <KBadge label={`${b.count} recipes`} color={K.primary} />
                <button
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: K.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'inherit',
                  }}
                >
                  Open <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </KCard>
        ))}
        <div
          onClick={() => setAddOpen(true)}
          style={{
            borderRadius: 20,
            border: `2px dashed ${K.border}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            minHeight: 200,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.borderColor = K.primary)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.borderColor = K.border)
          }
        >
          <Plus size={32} color={K.textLight} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: K.textMuted,
              marginTop: 10,
            }}
          >
            New Cookbook
          </span>
        </div>
      </div>
      <KModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New cookbook"
        subtitle="Group recipes by theme or occasion"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Title', key: 'name', ph: 'e.g. Sunday Dinners' },
            {
              label: 'Description',
              key: 'desc',
              ph: 'e.g. Family-style recipes for slow weekends',
            },
          ].map((f) => (
            <div key={f.key}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: K.textSub,
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {f.label}
              </label>
              <input
                value={(newBook as any)[f.key]}
                onChange={(e) =>
                  setNewBook((p) => ({ ...p, [f.key]: e.target.value }))
                }
                placeholder={f.ph}
                style={{
                  width: '100%',
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <KBtn variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </KBtn>
            <KBtn
              variant="brand"
              onClick={() => {
                if (!newBook.name) return
                const colors = [
                  K.btnBlue,
                  K.gradBrand,
                  'linear-gradient(135deg,#f6b352,#f582ae)',
                  K.btnGreen,
                ]
                setBooks((prev) => [
                  ...prev,
                  {
                    id: `cb${Date.now()}`,
                    name: newBook.name,
                    desc: newBook.desc,
                    count: 0,
                    color: colors[prev.length % colors.length],
                    img: '',
                  },
                ])
                setNewBook({ name: '', desc: '' })
                setAddOpen(false)
                showToast('Cookbook created!')
              }}
            >
              Save
            </KBtn>
          </div>
        </div>
      </KModal>
    </div>
  )
}

// ─── Templates View ───────────────────────────────────────────────────────────
function TemplatesView({ showToast }: { showToast: (m: string) => void }) {
  const [templates, setTemplates] = useState(TEMPLATES)
  const [addOpen, setAddOpen] = useState(false)
  const [newTmpl, setNewTmpl] = useState({ name: '', desc: '' })
  return (
    <div style={{ padding: '8px 32px 40px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: 0,
            color: K.text,
          }}
        >
          Plan Templates
        </h2>
        <KBtn
          variant="blue"
          size="sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => setAddOpen(true)}
        >
          <Plus size={13} /> New template
        </KBtn>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {templates.map((t) => (
          <KCard
            key={t.id}
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-3px)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 12px 32px rgba(34,18,64,0.12)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform = ''
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
            }}
            onClick={() => showToast(`Loading ${t.name} template...`)}
          >
            <div
              style={{
                height: 160,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={t.img}
                alt={t.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)',
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setTemplates((prev) => prev.filter((x) => x.id !== t.id))
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Trash2 size={13} />
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 14,
                  right: 14,
                }}
              >
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {t.tags.slice(0, 2).map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#fff',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '3px 8px',
                        borderRadius: 999,
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  margin: '0 0 4px',
                  letterSpacing: '-0.02em',
                  color: K.text,
                }}
              >
                {t.name}
              </h4>
              <p
                style={{
                  fontSize: 12,
                  color: K.textMuted,
                  margin: '0 0 12px',
                  fontWeight: 500,
                }}
              >
                {t.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <KBadge label={`${t.count} meals`} color={K.primary} />
                <button
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: K.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'inherit',
                  }}
                  onClick={() => showToast(`Using ${t.name}...`)}
                >
                  Use template <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </KCard>
        ))}
      </div>
      <KModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New plan template"
        subtitle="Save a meal-planning template"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            {
              label: 'Template name',
              key: 'name',
              ph: 'e.g. Pescatarian Week',
            },
            {
              label: 'Description',
              key: 'desc',
              ph: 'e.g. 21 meals, fish-forward',
            },
          ].map((f) => (
            <div key={f.key}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: K.textSub,
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {f.label}
              </label>
              <input
                value={(newTmpl as any)[f.key]}
                onChange={(e) =>
                  setNewTmpl((p) => ({ ...p, [f.key]: e.target.value }))
                }
                placeholder={f.ph}
                style={{
                  width: '100%',
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <KBtn variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </KBtn>
            <KBtn
              variant="brand"
              onClick={() => {
                if (!newTmpl.name) return
                setTemplates((prev) => [
                  ...prev,
                  {
                    id: `t${Date.now()}`,
                    name: newTmpl.name,
                    desc: newTmpl.desc,
                    count: 0,
                    color: K.gradBrand,
                    img: '',
                    tags: [],
                  },
                ])
                setNewTmpl({ name: '', desc: '' })
                setAddOpen(false)
                showToast('Template saved!')
              }}
            >
              Save
            </KBtn>
          </div>
        </div>
      </KModal>
    </div>
  )
}

// ─── Manual Recipe View ───────────────────────────────────────────────────────
function ManualView({ showToast }: { showToast: (m: string) => void }) {
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState([''])
  return (
    <div style={{ padding: '8px 32px 40px', maxWidth: 700, margin: '0 auto' }}>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: '0 0 8px',
          color: K.text,
        }}
      >
        <span
          style={{
            background: K.gradBrand,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Create
        </span>{' '}
        a recipe
      </h2>
      <p
        style={{
          fontSize: 15,
          color: K.textMuted,
          margin: '0 0 28px',
          fontWeight: 500,
        }}
      >
        Fill in the details below to add a new recipe to your library.
      </p>

      <div
        onClick={() => showToast('Opening file picker...')}
        style={{
          border: `2px dashed ${K.border}`,
          borderRadius: 20,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: 24,
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(6px)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = K.primary
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = K.border
          el.style.transform = 'translateY(0px)'
          el.style.boxShadow = 'none'
        }}
      >
        <Camera
          size={34}
          color={K.textLight}
          style={{
            marginBottom: 6,
          }}
        />

        <div style={{ fontSize: 15, fontWeight: 600, color: K.textSub }}>
          Add a photo
        </div>

        <div style={{ fontSize: 12, color: K.textMuted }}>
          Drag & drop or click to upload
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: K.textSub,
              display: 'block',
              marginBottom: 6,
            }}
          >
            Title
          </label>
          <input
            placeholder="Recipe title"
            style={{
              width: '100%',
              background: 'rgba(243,244,246,0.8)',
              border: `1px solid ${K.borderMid}`,
              borderRadius: 10,
              padding: '11px 14px',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Recipe type
            </label>
            <select
              style={{
                width: '100%',
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 10,
                padding: '11px 14px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <option>Breakfast</option>
              <option selected>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: K.textSub,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Servings
            </label>
            <input
              type="number"
              defaultValue={4}
              min={1}
              style={{
                width: '100%',
                background: 'rgba(243,244,246,0.8)',
                border: `1px solid ${K.borderMid}`,
                borderRadius: 10,
                padding: '11px 14px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          {[
            { label: 'Total time (min)', val: 30 },
            { label: 'Calories per serving', val: 450 },
          ].map((f) => (
            <div key={f.label}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: K.textSub,
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {f.label}
              </label>
              <input
                type="number"
                defaultValue={f.val}
                style={{
                  width: '100%',
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '11px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          {[
            { label: 'Protein (g)', val: 30 },
            { label: 'Carbs (g)', val: 45 },
          ].map((f) => (
            <div key={f.label}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: K.textSub,
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {f.label}
              </label>
              <input
                type="number"
                defaultValue={f.val}
                style={{
                  width: '100%',
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '11px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: K.textSub,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Ingredients
          </label>
          {ingredients.map((ing, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                value={ing}
                onChange={(e) =>
                  setIngredients((prev) =>
                    prev.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
                placeholder={`Ingredient ${i + 1}`}
                style={{
                  flex: 1,
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              {ingredients.length > 1 && (
                <button
                  onClick={() =>
                    setIngredients((prev) => prev.filter((_, j) => j !== i))
                  }
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'transparent',
                    border: `1px solid ${K.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: K.textMuted,
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setIngredients((prev) => [...prev, ''])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: K.primary,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              fontFamily: 'inherit',
            }}
          >
            <Plus size={14} /> Add ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: K.textSub,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Steps
          </label>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#1b5e3f',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 6,
                }}
              >
                {i + 1}
              </div>
              <textarea
                value={step}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
                placeholder={`Step ${i + 1}`}
                rows={2}
                style={{
                  flex: 1,
                  background: 'rgba(243,244,246,0.8)',
                  border: `1px solid ${K.borderMid}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          ))}
          <button
            onClick={() => setSteps((prev) => [...prev, ''])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: K.primary,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              fontFamily: 'inherit',
            }}
          >
            <Plus size={14} /> Add step
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
            marginTop: 8,
            paddingTop: 16,
            borderTop: `1px solid ${K.border}`,
          }}
        >
          <KBtn variant="ghost" onClick={() => showToast('Cancelled')}>
            Cancel
          </KBtn>
          <KBtn variant="brand" onClick={() => showToast('Recipe saved!')}>
            <Check size={13} /> Save recipe
          </KBtn>
        </div>
      </div>
    </div>
  )
}

// // ─── Diet Detail View ─────────────────────────────────────────────────────────
// function DietDetailView({
//   diet,
//   goBack,
//   showToast,
// }: {
//   diet: any
//   goBack: () => void
//   showToast: (m: string) => void
// }) {
//   if (!diet) return null
//   const benefits = [
//     'Macro-Balanced',
//     'High Protein',
//     'Auto Grocery List',
//     'Proven Results',
//     'Kira Optimized',
//   ]
//   return (
//     <div style={{ overflowY: 'auto' }}>
//       {/* Hero */}
//       <div
//         style={{
//           background: diet.color,
//           padding: '48px 80px',
//           position: 'relative',
//           overflow: 'hidden',
//         }}
//       >
//         <div
//           style={{
//             position: 'absolute',
//             top: -40,
//             right: -40,
//             width: 300,
//             height: 300,
//             background: 'rgba(255,255,255,0.1)',
//             borderRadius: '50%',
//             pointerEvents: 'none',
//           }}
//         />
//         <button
//           onClick={goBack}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: 6,
//             color: 'rgba(255,255,255,0.8)',
//             background: 'rgba(255,255,255,0.15)',
//             border: 'none',
//             borderRadius: 10,
//             padding: '8px 14px',
//             cursor: 'pointer',
//             fontSize: 13,
//             fontWeight: 600,
//             marginBottom: 28,
//             fontFamily: 'inherit',
//           }}
//         >
//           <ChevronLeft size={15} /> Back to all plans
//         </button>
//         <div style={{ maxWidth: 700 }}>
//           <h1
//             style={{
//               fontSize: 52,
//               fontWeight: 800,
//               color: '#fff',
//               letterSpacing: '-0.04em',
//               lineHeight: 1.05,
//               margin: '0 0 16px',
//             }}
//           >
//             {diet.name}
//             <br />
//             <em
//               style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}
//             >
//               Meal Plan
//             </em>
//           </h1>
//           <p
//             style={{
//               fontSize: 17,
//               color: 'rgba(255,255,255,0.8)',
//               margin: '0 0 28px',
//               lineHeight: 1.55,
//               fontWeight: 500,
//               maxWidth: 560,
//             }}
//           >
//             {diet.desc}
//           </p>
//           <div style={{ display: 'flex', gap: 12 }}>
//             <button
//               onClick={() => showToast(`Creating your ${diet.name} plan...`)}
//               style={{
//                 background: '#fff',
//                 color: K.primary,
//                 border: 'none',
//                 padding: '12px 24px',
//                 borderRadius: 12,
//                 fontSize: 14,
//                 fontWeight: 700,
//                 cursor: 'pointer',
//                 fontFamily: 'inherit',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 7,
//               }}
//             >
//               <Sparkles size={14} /> Create My Plan
//             </button>
//             <button
//               onClick={() => showToast('Loading sample menu...')}
//               style={{
//                 background: 'rgba(255,255,255,0.2)',
//                 color: '#fff',
//                 border: '1px solid rgba(255,255,255,0.4)',
//                 padding: '12px 24px',
//                 borderRadius: 12,
//                 fontSize: 14,
//                 fontWeight: 700,
//                 cursor: 'pointer',
//                 fontFamily: 'inherit',
//               }}
//             >
//               View Sample Menu
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Benefits */}
//       <div
//         style={{
//           padding: '24px 80px',
//           background: 'rgba(244,241,251,0.5)',
//           display: 'flex',
//           gap: 16,
//           flexWrap: 'wrap',
//         }}
//       >
//         {benefits.map((b) => (
//           <span
//             key={b}
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: 6,
//               fontSize: 13,
//               fontWeight: 600,
//               color: K.primary,
//               background: K.primarySoft,
//               padding: '6px 14px',
//               borderRadius: 999,
//             }}
//           >
//             <Check size={12} strokeWidth={3} /> {b}
//           </span>
//         ))}
//       </div>

//       {/* Content */}
//       <div style={{ padding: '40px 80px 60px' }}>
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: '1fr 1fr',
//             gap: 32,
//             marginBottom: 40,
//           }}
//         >
//           <div>
//             <h2
//               style={{
//                 fontSize: 28,
//                 fontWeight: 800,
//                 letterSpacing: '-0.03em',
//                 margin: '0 0 14px',
//                 color: K.text,
//               }}
//             >
//               What is the {diet.name.split(' ')[0]} Diet?
//             </h2>
//             <p
//               style={{
//                 fontSize: 15,
//                 color: K.textMuted,
//                 lineHeight: 1.7,
//                 fontWeight: 500,
//               }}
//             >
//               {diet.desc} This approach has been studied extensively and shows
//               consistent results for weight management and overall health
//               markers.
//             </p>
//             <p
//               style={{
//                 fontSize: 15,
//                 color: K.textMuted,
//                 lineHeight: 1.7,
//                 fontWeight: 500,
//                 marginTop: 14,
//               }}
//             >
//               The plan is structured to keep you satiated through carefully
//               balanced macros, strategic meal timing, and whole-food ingredients
//               that support your goals.
//             </p>
//           </div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {[
//               {
//                 h: 'Macro Distribution',
//                 p: `Fat: ${diet.macro.fat} · Protein: ${diet.macro.pro} · Carbs: ${diet.macro.crb}`,
//               },
//               { h: 'Daily Target', p: diet.badge },
//               {
//                 h: 'Best For',
//                 p: 'People who thrive on structure and measurable progress.',
//               },
//             ].map((kp) => (
//               <KCard key={kp.h} style={{ padding: '18px 20px' }}>
//                 <h3
//                   style={{
//                     fontSize: 15,
//                     fontWeight: 800,
//                     margin: '0 0 6px',
//                     color: K.text,
//                   }}
//                 >
//                   {kp.h}
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: 14,
//                     color: K.textMuted,
//                     margin: 0,
//                     fontWeight: 500,
//                   }}
//                 >
//                   {kp.p}
//                 </p>
//               </KCard>
//             ))}
//           </div>
//         </div>

//         {/* Who it's for */}
//         <h2
//           style={{
//             fontSize: 28,
//             fontWeight: 800,
//             letterSpacing: '-0.03em',
//             margin: '0 0 20px',
//             textAlign: 'center',
//             color: K.text,
//           }}
//         >
//           Who is the {diet.name.split(' ')[0]} Diet For?
//         </h2>
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: 16,
//             marginBottom: 40,
//           }}
//         >
//           {[
//             {
//               icon: '🎯',
//               h: 'Goal-Oriented People',
//               p: 'Those who want clear targets and measurable outcomes with structured guidelines.',
//             },
//             {
//               icon: '⚡',
//               h: 'Energy Seekers',
//               p: 'Anyone who wants stable, sustained energy throughout the day without crashes.',
//             },
//             {
//               icon: '🔬',
//               h: 'Health-Conscious',
//               p: 'People who want evidence-based nutrition backed by research and real results.',
//             },
//           ].map((bt) => (
//             <KCard
//               key={bt.h}
//               style={{ padding: '24px 22px', textAlign: 'center' }}
//             >
//               <div style={{ fontSize: 36, marginBottom: 12 }}>{bt.icon}</div>
//               <h4
//                 style={{
//                   fontSize: 15,
//                   fontWeight: 800,
//                   margin: '0 0 8px',
//                   color: K.text,
//                 }}
//               >
//                 {bt.h}
//               </h4>
//               <p
//                 style={{
//                   fontSize: 13,
//                   color: K.textMuted,
//                   margin: 0,
//                   fontWeight: 500,
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {bt.p}
//               </p>
//             </KCard>
//           ))}
//         </div>

//         {/* CTA */}
//         <div style={{ textAlign: 'center', padding: '40px 0' }}>
//           <KBtn
//             variant="brand"
//             size="lg"
//             onClick={() => showToast(`Starting ${diet.name} plan...`)}
//           >
//             <Sparkles size={15} /> Start {diet.name.split(' ')[0]} Plan
//           </KBtn>
//         </div>
//       </div>
//     </div>
//   )
// }

// ─── Main Component ───────────────────────────────────────────────────────────
export function MealCraftView() {
  const [tab, setTabState] = useState<MealTab>('home')
  const [tabData, setTabData] = useState<any>(null)
  const [toast, setToast] = useState({ msg: '', visible: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  const setTab = (t: MealTab, data?: any) => {
    setTabState(t)
    if (data !== undefined) setTabData(data)
    else setTabData(null)
  }

  const showToast = (msg: string) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, visible: true })
    toastTimer.current = setTimeout(
      () => setToast((p) => ({ ...p, visible: false })),
      2800,
    )
  }

  const meta: Record<
    MealTab,
    { title: string; subtitle: string; action?: string }
  > = {
    home: { title: 'Dashboard', subtitle: 'Your meal planning hub' },
    planner: {
      title: 'Meal Planner',
      subtitle: 'Plan · MealCraft',
      action: 'Auto-Plan',
    },
    shopping: {
      title: 'Shopping List',
      subtitle: 'Plan · MealCraft',
      action: 'Add item',
    },
    templates: {
      title: 'Templates',
      subtitle: 'Plan · MealCraft',
      action: 'New template',
    },
    'diet-plans': { title: 'Diet Plans', subtitle: 'Plan · MealCraft' },
    'ai-nutritionist': {
      title: 'AI Nutritionist',
      subtitle: 'Create · MealCraft',
    },
    chef: { title: 'Chef AI', subtitle: 'Create · MealCraft' },
    import: { title: 'Import Recipe', subtitle: 'Create · MealCraft' },
    manual: { title: 'Add Recipe', subtitle: 'Create · MealCraft' },
    recipes: {
      title: 'Saved Recipes',
      subtitle: 'Manage · MealCraft',
      action: 'Add Recipe',
    },
    books: {
      title: 'Cookbooks',
      subtitle: 'Manage · MealCraft',
      action: 'New cookbook',
    },
    pantry: {
      title: 'Pantry',
      subtitle: 'Manage · MealCraft',
      action: 'Add item',
    },
    'recipe-detail': {
      title: tabData?.name || 'Recipe',
      subtitle: 'MealCraft',
    },
    'diet-detail': {
      title: tabData?.name || 'Diet Plan',
      subtitle: 'Diet Plans · MealCraft',
    },
  }

  const renderContent = () => {
    switch (tab) {
      case 'home':
        return <DashboardView setTab={setTab} />
      case 'planner':
        return <PlannerView showToast={showToast} />
      case 'chef':
        return <ChefView showToast={showToast} />
      case 'recipes':
        return <RecipesView setTab={setTab} showToast={showToast} />
      case 'recipe-detail':
        return (
          <RecipeDetailView
            recipe={tabData}
            goBack={() => setTab('recipes')}
            showToast={showToast}
          />
        )
      case 'pantry':
        return <PantryView showToast={showToast} />
      case 'shopping':
        return <ShoppingView showToast={showToast} />
      case 'diet-plans':
        ;<DietPlansView
          setTab={setTab as (t: string, d?: any) => void}
          showToast={showToast}
        />
        break

      case 'diet-detail':
        return (
          <DietDetailView
            plan={tabData}
            onBack={() => setTab('diet-plans')}
            showToast={showToast}
          />
        )
      case 'ai-nutritionist':
        return <AInutriView showToast={showToast} setTab={setTab} />
      case 'import':
        return <ImportView showToast={showToast} />
      case 'manual':
        return <ManualView showToast={showToast} />
      case 'books':
        return <BooksView showToast={showToast} />
      case 'templates':
        return <TemplatesView showToast={showToast} />
      default:
        return <DashboardView setTab={setTab} />
    }
  }

  const curMeta = meta[tab]

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        fontFamily: "'Outfit', system-ui, sans-serif",
        background: K.mainBg,
        position: 'relative',
      }}
    >
      {/* Background layers (same as App.tsx) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom right, rgba(192,168,255,0.15), rgba(255,182,193,0.1), rgba(173,216,255,0.15))',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 250,
          background: K.sidebarBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: `1px solid ${K.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '22px 22px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: K.gradBrand,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              boxShadow: '0 6px 18px rgba(108,92,231,0.35)',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <ChefHat size={20} />
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-0.04em',
              color: K.text,
            }}
          >
            <span
              style={{
                background: K.gradBrand,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kira Meal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 16px' }}>
          {/* Home */}
          <button
            onClick={() => setTab('home')}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              color: K.text,
              background: tab === 'home' ? K.activeNavBg : '#fff',
              boxShadow:
                tab === 'home' ? 'none' : '0 1px 4px rgba(34,18,64,0.06)',
              border: `1px solid ${tab === 'home' ? 'rgba(168,185,255,0.6)' : K.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              marginBottom: 16,
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'home' && <GlowBlobs />}
            <LayoutDashboard
              size={16}
              color={tab === 'home' ? K.primary : K.textSub}
              style={{ position: 'relative', zIndex: 1 }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Dashboard</span>
          </button>

          {/* Sections */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: 16 }}>
              <h4
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'rgba(155,147,181,0.9)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: '0 0 8px',
                  padding: '0 6px',
                }}
              >
                {section.label}
              </h4>
              {section.items.map((item) => {
                const active = tab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 11,
                      fontSize: 13.5,
                      fontWeight: active ? 600 : 500,
                      color: active ? K.text : '#4d4570',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      cursor: 'pointer',
                      background: active ? K.activeNavBg : 'transparent',
                      border: 'none',
                      marginBottom: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = 'rgba(244,241,251,0.8)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = 'transparent'
                    }}
                  >
                    {active && <GlowBlobs />}
                    {active && (
                      <div
                        style={{
                          position: 'absolute',
                          left: -8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 18,
                          borderRadius: 2,
                          background: K.gradBrand,
                        }}
                      />
                    )}
                    <span
                      style={{
                        color: active ? K.primary : '#6e6791',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: 999,
                          background:
                            item.badgeColor ||
                            'linear-gradient(135deg,#f582ae,#f6b352)',
                          color: item.badgeText || '#fff',
                          boxShadow: '0 2px 6px rgba(245,130,174,0.3)',
                          position: 'relative',
                          zIndex: 1,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer
        <div
          style={{
            padding: '14px 18px 18px',
            borderTop: `1px solid ${K.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 8,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                'rgba(244,241,251,0.8)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                'transparent')
            }
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: K.gradSun,
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              K
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: K.text }}>
                Kobe
              </div>
              <div style={{ fontSize: 11, color: K.textMuted }}>
                Pro · <b style={{ color: K.primary }}>2 weeks left</b>
              </div>
            </div>
            <MoreVertical size={16} color={K.textMuted} />
          </div>
        </div> */}
      </aside>

      {/* ── Main Area ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top header — matching SocialMediaView exactly */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 14px',
            borderBottom: '1px solid rgba(17,24,39,0.1)',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Left */}
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: K.text,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {curMeta.title}
            </h1>

            <p
              style={{
                fontSize: 14,
                color: '#696D7D',
                margin: '2px 0 0',
                fontWeight: 400,
              }}
            >
              {curMeta.subtitle}
            </p>
          </div>

          {/* Search */}
          <div
            style={{
              flex: 1,
              maxWidth: 420,
              margin: '0 24px',
              position: 'relative',
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: K.textMuted,
              }}
            />

            <input
              placeholder="Search recipes, ingredients, plans..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.75)',
                border: `1px solid ${K.border}`,
                backdropFilter: 'blur(8px)',
                borderRadius: 14,
                padding: '10px 42px 10px 40px',
                fontSize: 13.5,
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                color: K.text,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = K.primary
                e.target.style.boxShadow = `0 0 0 4px ${K.primarySoft}`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = K.border
                e.target.style.boxShadow = 'none'
              }}
            />

            <span
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 10.5,
                color: K.textMuted,
                background: 'rgba(244,241,251,0.9)',
                padding: '3px 7px',
                borderRadius: 6,
                border: `1px solid ${K.border}`,
                fontFamily: 'monospace',
              }}
            >
              ⌘K
            </span>
          </div>

          {/* Right Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Ask Chef CTA */}
            <button
              onClick={() => setTab('chef')}
              style={{
                padding: '0 18px',
                height: 38,
                background: K.gradBrand,
                color: '#fff',
                border: 0,
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 4px 14px rgba(108,92,231,0.35)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-1px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 6px 18px rgba(108,92,231,0.5)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 4px 14px rgba(108,92,231,0.35)'
              }}
            >
              <Sparkles size={13} />
              Ask Chef Kira
            </button>

            {/* Notification Button */}
            <button
              onClick={() => showToast('No new notifications')}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0px 2px 5px rgba(17,24,39,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src="/bell(1).png"
                alt="Notifications"
                style={{
                  width: 24,
                  height: 24,
                  objectFit: 'contain',
                }}
              />

              <span
                style={{
                  position: 'absolute',
                  top: 9,
                  right: 9,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: K.accent,
                  border: '2px solid #fff',
                }}
              />
            </button>

            {/* Settings Button */}
            <button
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0px 2px 5px rgba(17,24,39,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src="/setting.png"
                alt="Settings"
                style={{
                  width: 24,
                  height: 24,
                  objectFit: 'contain',
                }}
              />
            </button>

            {/* Avatar */}
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0px 2px 8px rgba(17,24,39,0.08)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <img
                src="/profile.png"
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {renderContent()}
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  )
}

export default MealCraftView
