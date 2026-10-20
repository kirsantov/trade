# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Single Window** - Next.js 15 application for government trade facilitation in Kyrgyzstan. The Single Window Information System provides access to official registries and services for foreign economic activities.

## Technology Stack

- **Framework**: Next.js 15 with App Router, TypeScript, Turbopack  
- **UI**: Shadcn/UI components with Tailwind CSS 4
- **Email**: Nodemailer for server-side email sending
- **Styling**: Tailwind CSS v4 with PostCSS
- **Architecture**: SSR with API routes for forms

## Development Commands

```bash
# Development
npm run dev                 # Start dev server with Turbopack (http://localhost:3000)
npm run build              # Build for production
npm run start              # Start production server  
npm run lint               # Run ESLint
```

## Architecture Overview

### Component Structure

- **Layout Components** (`src/components/layout/`):
  - `government-banner.tsx`: Official government site indicator
  - `header.tsx`: Main navigation with Single Window logo
  - `hero-section.tsx`: Main landing section with background image
  - `info-banner.tsx`: Information about Центр "единого окна"
  - `services-grid.tsx`: Official registries grid with external links
  - `footer.tsx`: Site footer with contact info and social links
  
- **UI Components** (`src/components/ui/`):
  - `breadcrumbs.tsx`: Navigation breadcrumbs
  - `scroll-to-top.tsx`: Fixed scroll-to-top button
  - Shadcn/UI primitives

- **Pages**:
  - `/` - Homepage with registries
  - `/about` - About page with official enterprise information
  - `/contact` - Contact page with working email form

### API Routes

- `/api/contact` - Server-side email handling with nodemailer

### Design System

- **Primary Color**: `#1F4E94` (government blue)
- **Typography**: Geist font family  
- **Logo**: Single Window logo (sw-logo.svg, 180x105px)
- **Responsive Design**: Mobile-first approach
- **Social Links**: Facebook, Instagram

## Official Registries

The system provides access to 5 official registries:

1. **Декларации и сертификаты соответствия ТР ТС/ЕАЭС**
   - URL: `http://swis.trade.kg/Registry/CertificateOfConformity`

2. **Декларации и сертификаты соответствия КР**  
   - URL: `http://swis.trade.kg/Registry/DeclarationOfConformity-KGZ-National`

3. **Свидетельства о государственной регистрации**
   - URL: `https://registry.trade.kg/registries/3`

4. **Лицензии на алкогольную продукцию**
   - URL: `https://registry.trade.kg/registries/15`

5. **Свидетельство о безопасности конструкции транспортного средства**
   - URL: `https://inspection.trade.kg/registry`

## Contact Information

- **Phone**: +996 312 902 640, +996 312 902 655
- **Email**: info@trade.kg
- **Address**: Бишкек, пр. Чуй 122
- **Legal Address**: 720002, г. Бишкек, пр. Чуй, 106
- **Facebook**: https://www.facebook.com/singlewindowkg
- **Instagram**: https://www.instagram.com/singlewindow.kg

## Development Patterns

- Use Next.js Image component for optimization
- Server-side rendering for SEO
- External links open in new tabs
- Contact form with server-side email sending
- Responsive footer layout with space-between
- Breadcrumb navigation on internal pages

## Deployment

- Configured for AWS Amplify
- amplify.yml configured for Next.js builds
- All ESLint and TypeScript errors must be resolved for successful builds
