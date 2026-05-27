# 🎵 Pickmysong

> **La plataforma donde la música, la moda y la cultura urbana se fusionan.** Descubre, vota y comparte las canciones que definen tu estilo de vida.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-Next.js%207C%20Expo%20%7C%20TypeScript-black)

---

## ✨ ¿Qué es Pickmysong?

Pickmysong es una plataforma musical con identidad propia: **dark, premium, aspiracional y cool**. Conecta a usuarios, marcas, locales y artistas a través de la música como hilo conductor del lifestyle.

- 🎧 Usuarios votan y descubren canciones en tiempo real
- 🏪 Locales y marcas gestionan su ambiente sonoro
- 🎤 Artistas ganan visibilidad orgánica
- 📊 Dashboard analytics para partners y anunciantes

## 🏗️ Arquitectura — Monorepo

Este proyecto usa Turborepo como gestor de monorepo con dos apps y paquetes compartidos.

```
pickmysong/
├── apps/
│   ├── web/                    # Next.js 14 (App Router) — versión web responsive
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── discover/       # Descubrir canciones + votación
│   │   │   ├── artists/        # Perfiles de artistas
│   │   │   ├── venues/         # Locales con now-playing
│   │   │   ├── playlists/      # Playlists comunitarias
│   │   │   ├── dashboard/      # Analytics (KPIs, charts)
│   │   │   ├── songs/[id]/     # Detalle de canción ✨ NEW
│   │   │   ├── auth/           # Login / Registro ✨ NEW
│   │   │   ├── profile/        # Perfil de usuario ✨ NEW
│   │   │   ├── pricing/        # Planes Free/Premium/Business ✨ NEW
│   │   │   └── api/            # Route Handlers
│   │   │       ├── songs/      # GET/POST + /[id]/vote
│   │   │       ├── artists/    # GET artistas
│   │   │       ├── venues/     # GET locales
│   │   │       ├── playlists/  # GET/POST playlists
│   │   │       ├── dashboard/  # GET stats
│   │   │       └── auth/       # POST login/register ✨ NEW
│   │   ├── components/
│   │   │   └── Navbar.tsx      # Nav desktop + mobile bar
│   │   └── lib/
│   │       ├── db.ts           # In-memory DB + query helpers
│   │       └── types.ts        # Tipos compartidos TypeScript
│   └── mobile/                 # Expo SDK — app nativa iOS/Android
├── packages/
│   ├── ui/                     # Design system dark-premium
│   └── config/                 # TypeScript, ESLint, Tailwind configs
├── turbo.json
├── package.json
└── README.md
```

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Monorepo | Turborepo |
| Web App | Next.js 14, App Router, TailwindCSS |
| Mobile App | Expo SDK, React Navigation |
| Lenguaje | TypeScript |
| UI/Design | Design System propio (dark, premium) |
| Backend (roadmap) | Node.js / Supabase / Edge Functions |
| Auth (roadmap) | NextAuth / Clerk |
| DB (roadmap) | PostgreSQL + Prisma |

## 📱 Apps

### `apps/web` — Plataforma Web
- Versión desktop y mobile responsive
- Panel de control para locales, marcas y admin
- Landing pública con descubrimiento de canciones
- Dark mode nativo, diseño premium

### `apps/mobile` — App Nativa
- Experiencia usuario final (iOS + Android)
- Votación, descubrimiento, playlists
- Notificaciones push
- Onboarding visual impactante

## 📦 Packages

### `packages/ui`
Design system compartido entre web y mobile:
- Paleta de colores dark-premium
- Tipografía y tokens de diseño
- Componentes base: Button, Card, Avatar, Badge, BottomSheet

### `packages/config`
Configuraciones técnicas compartidas:
- `tsconfig.json` base
- `.eslintrc` con reglas unificadas
- `prettier.config.js`
- `tailwind.config.js` con tema Pickmysong

## 🛠️ Cómo empezar

```bash
# Clonar el repo
git clone https://github.com/fullequip2009-dev/Pickmysong.git
cd Pickmysong

# Instalar dependencias
npm install

# Arrancar todas las apps en desarrollo
npm run dev

# Solo la web
npm run dev --filter=web

# Solo la mobile
npm run dev --filter=mobile
```

## 🗺️ Roadmap

### ✅ Completado
- [x] Estructura monorepo inicial (Turborepo)
- [x] Design system v1 (tokens, componentes base)
- [x] Landing page web (hero, discovery, CTA)
- [x] Página Discover con votación, búsqueda y filtros de género
- [x] Página Artists con perfiles y sistema de follow
- [x] Página Venues con ocupación y now-playing
- [x] Página Playlists comunitarias
- [x] Dashboard con KPIs y top songs table
- [x] Navbar responsive (desktop + mobile bottom bar)
- [x] API mock endpoints (songs, artists, venues, playlists, dashboard)
- [x] In-memory DB con seed data y query helpers
- [x] App mobile básica (Expo) con home screen
- [x] **Página Auth (login/registro) con social login** ✨
- [x] **Perfil de usuario con stats, tabs y configuración** ✨
- [x] **Detalle de canción con reproductor y canciones relacionadas** ✨
- [x] **API endpoints auth (login/register)** ✨
- [x] **Página Pricing con planes Free, Premium y Business** ✨
- [x] **Navbar mejorado con botones auth y link de perfil** ✨

### 🔄 En progreso / Próximo
- [ ] Backend real (Supabase / PostgreSQL + Prisma)
- [ ] Autenticación real (NextAuth / Clerk con JWT)
- [ ] Sistema de sesiones y middleware de auth
- [ ] Integración con Spotify API (player embebido)
- [ ] Página de venue owner dashboard
- [ ] QR codes para locales
- [ ] Notificaciones en tiempo real (Supabase Realtime)

### 📋 Roadmap futuro
- [ ] Sistema de playlists colaborativas
- [ ] Rankings semanales y badges
- [ ] Monetización (planes premium, ads)
- [ ] App mobile completa con onboarding
- [ ] Analytics avanzados para partners
- [ ] PWA (Progressive Web App)

## 👥 Equipo

Desarrollado por **fullequip2009-dev**

## 📄 Licencia

MIT © 2026 Pickmysong
