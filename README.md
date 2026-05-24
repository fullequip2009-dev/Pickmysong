# 🎵 Pickmysong

> **La plataforma donde la música, la moda y la cultura urbana se fusionan.**
> Descubre, vota y comparte las canciones que definen tu estilo de vida.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Expo%20%7C%20TypeScript-black)

---

## ✨ ¿Qué es Pickmysong?

Pickmysong es una plataforma musical con identidad propia: **dark, premium, aspiracional y cool**.
Conecta a usuarios, marcas, locales y artistas a través de la música como hilo conductor del lifestyle.

- 🎧 Usuarios votan y descubren canciones en tiempo real
- 🏪 Locales y marcas gestionan su ambiente sonoro
- 🎤 Artistas ganan visibilidad orgánica
- 📊 Dashboard analytics para partners y anunciantes

---

## 🏗️ Arquitectura — Monorepo

Este proyecto usa **Turborepo** como gestor de monorepo con dos apps y paquetes compartidos.

```
pickmysong/
├── apps/
│   ├── web/          # Next.js 14 (App Router) — versión web responsive
│   └── mobile/       # Expo SDK — app nativa iOS/Android
├── packages/
│   ├── ui/           # Componentes compartidos, design system dark-premium
│   └── config/       # TypeScript, ESLint, Prettier, Tailwind configs
├── turbo.json
├── package.json
└── README.md
```

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Monorepo | Turborepo |
| Web App | Next.js 14, App Router, TailwindCSS |
| Mobile App | Expo SDK, React Navigation |
| Lenguaje | TypeScript |
| UI/Design | Design System propio (dark, premium) |
| Backend (roadmap) | Node.js / Supabase / Edge Functions |
| Auth (roadmap) | NextAuth / Clerk |
| DB (roadmap) | PostgreSQL + Prisma |

---

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

---

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

---

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

---

## 🗺️ Roadmap

- [x] Estructura monorepo inicial
- [ ] Design system v1 (tokens, componentes base)
- [ ] Landing page web (hero, discovery, CTA)
- [ ] App mobile onboarding + votación
- [ ] Backend API (canciones, votos, usuarios)
- [ ] Auth (registro, login social)
- [ ] Dashboard para locales y marcas
- [ ] Sistema de playlists y rankings
- [ ] Monetización (planes premium, ads)

---

## 👥 Equipo

Desarrollado por **fullequip2009-dev**

---

## 📄 Licencia

MIT © 2026 Pickmysong
