# Design System ClearBus

Documentation pour reproduire le design sur d'autres projets.

## Stack technologique
- **Framework** : Next.js 15 (App Router)
- **React** : React 19
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Font** : Plus Jakarta Sans (Google Fonts)

## Palette de couleurs

### Couleurs primaires (bleu)
```css
--color-primary: #3b82f6
--color-primary-dark: #1d4ed8
--color-primary-light: #dbeafe
--color-primary-foreground: #ffffff
```

### Couleurs accent (orange)
```css
--color-accent: #f97316
--color-accent-light: #fed7aa
--color-accent-foreground: #ffffff
```

### Couleurs neutres
```css
--color-background: #f8fafc
--color-surface: #ffffff
--color-ink: #0f172a
--color-muted: #64748b
--color-muted-foreground: #94a3b8
--color-border: #e2e8f0
--color-line: #e2e8f0
```

### Couleurs fonctionnelles
```css
--color-destructive: #ef4444
--color-success: #10b981
--color-warning: #f59e0b
```

## Configuration Tailwind

### Border radius
```js
borderRadius: {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
}
```

### Shadows (profondeur)
```js
boxShadow: {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}
```

### Animations keyframes
```js
keyframes: {
  'float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  'wave': {
    '0%': { transform: 'rotate(0deg)' },
    '50%': { transform: 'rotate(15deg)' },
    '100%': { transform: 'rotate(0deg)' }
  },
  'shine': {
    '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(30deg)' },
    '100%': { transform: 'translateX(100%) translateY(100%) rotate(30deg)' }
  },
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  }
}
```

## Classes CSS personnalisées

### Glassmorphism
```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### Cards premium
```css
.card-premium {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card-premium:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
```

### Buttons enhanced
```css
.button-enhanced-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.button-enhanced-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -2px rgb(0 0 0 / 0.1);
}
```

## Composants UI patterns

### Navbar
- Fixed top, h-16
- Glassmorphism effect (bg-background/80 backdrop-blur-sm)
- Border bottom (border-border/20)
- Logo avec gradient text
- User avatar circulaire

### Cards interactives
```tsx
<div className="relative isolation rounded-2xl bg-background/80 backdrop-blur p-8 border border-border/20 hover:bg-background/95 hover:-translate-y-2 transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgb(0,0,0,0.25)]">
  {/* Overlay animé */}
  <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-transparent via-black/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  {/* Contenu */}
</div>
```

### Buttons CTA
```tsx
<button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:shadow-2xl transition-all duration-500 transform-gpu">
  {/* Texte + icône */}
</button>
```

### Inputs
```tsx
<input className="w-full border px-4 py-3 outline-none transition-all duration-200 border-radius: var(--radius-md) background: var(--color-background) border-color: var(--color-border) focus:border-color: var(--color-primary) focus-box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15)" />
```

## Layout structure

### Container principal
```tsx
<main className="relative z-10 min-h-screen bg-transparent">
  <Navbar />
  <div className="relative z-10 pt-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto px-4">
      {children}
    </div>
  </div>
</main>
```

### Background animé (canvas)
- Gradient de fond : #e8ecf0 → #e2e6ea → #d8dce0
- Lignes animées horizontales (8 lignes)
- Couleurs : rgba(29, 78, 216, 0.3), rgba(220, 38, 38, 0.3)
- Vitesse : 1-3px/frame

## Typographie

### Font family
```css
font-family: var(--font-jakarta), system-ui, sans-serif;
```

### Headings
```css
h1: text-6xl font-black tracking-tighter
h2: text-5xl font-bold tracking-tighter
h3: text-4xl font-semibold tracking-tight
```

### Gradient text
```tsx
<h1 className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
  Titre
</h1>
```

## Patterns de design

### Hover effects
- Translation : hover:-translate-y-2
- Shadow : hover:shadow-[0_25px_50px_-12px_rgb(0,0,0,0.25)]
- Duration : transition-all duration-500/700
- Easing : cubic-bezier(0.25, 0.8, 0.25, 1)

### Éléments décoratifs
- Blur circles avec blur-3xl
- Opacity : 5-10%
- Animation : animate-float, animate-float-slow, animate-float-fast
- Couleurs : primary/5, accent/5, success/5, warning/5

### Badges
```tsx
<span className="inline-flex rounded-md px-3 py-1 text-xs font-semibold bg-primary text-white shadow-card">
  Label
</span>
```

## Structure de fichiers recommandée

```
src/
  app/
    globals.css       # Styles globaux + Tailwind v4
    layout.tsx        # Layout racine
    page.tsx          # Page d'accueil
  components/
    layout/
      navbar.tsx
      footer.tsx
      brand-logo.tsx
    ui/
      button.tsx
      card.tsx
      input.tsx
      badge.tsx
    primitives/       # Composants de base réutilisables
```

## Instructions d'implémentation

1. **Installer les dépendances** : Next.js 15, React 19, Tailwind CSS v4, Plus Jakarta Sans
2. **Configurer Tailwind v4** avec les couleurs personnalisées dans globals.css
3. **Créer les composants de base** (Button, Card, Input) avec les variants
4. **Implémenter le layout** avec navbar glassmorphism et background animé
5. **Utiliser les patterns de hover** sur toutes les cartes interactives
6. **Appliquer les gradients** sur les titres et buttons CTA
7. **Ajouter les animations** (float, wave, shine) sur les éléments décoratifs

## Caractéristiques du design

- **Modernité** : Glassmorphism, gradients, animations fluides
- **Profondeur** : Shadows multi-niveaux, hover effects avec translation
- **Cohérence** : Palette de couleurs bleu/orange, typographie Jakarta Sans
- **Interactivité** : Transitions smooth (500-700ms), feedback visuel au hover
