# Inzopay

## Overview

Inzopay is a modern fintech landing page application that showcases an advanced electronic payment platform. The project presents a sophisticated marketing website for digital payment services targeting companies, online stores, and individuals. The application features a bilingual interface (English/Arabic) with full RTL (Right-to-Left) support, advanced CSS animations, scroll-based interactions, and a responsive design optimized for modern web browsers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a component-based vanilla JavaScript architecture with modular CSS organization:

- **Main Application Controller**: A centralized `InzopayApp` class manages the entire application state, language switching, and feature initialization
- **Scroll Animation System**: A dedicated `ScrollAnimations` class handles all scroll-based visual effects using Intersection Observer API for performance optimization
- **Modular CSS Structure**: Styles are organized into separate files (main.css, animations.css, rtl.css) for maintainability and theme management

### Design System
The application implements a comprehensive design system with:

- **CSS Custom Properties**: Centralized color scheme, spacing, typography, and shadow definitions stored in CSS variables
- **Dark Theme**: Modern dark UI with gradient backgrounds and neon accent colors (blue and purple)
- **Responsive Grid System**: Flexible layouts that adapt to different screen sizes and orientations

### Internationalization (i18n)
The application supports bilingual functionality with:

- **Language Toggle System**: Dynamic switching between English and Arabic with data attributes for content translation
- **RTL Support**: Complete right-to-left layout support for Arabic with dedicated CSS rules and directional adjustments
- **Cultural Adaptation**: Interface elements, animations, and layouts adjust appropriately for different text directions

### Performance Optimizations
Several performance-focused architectural decisions:

- **Accessibility-First Animations**: Automatic detection and disabling of animations for users with reduced motion preferences
- **Throttled/Debounced Events**: Scroll and resize event handlers use performance optimization techniques
- **Intersection Observer**: Modern browser API for efficient scroll-based animations instead of traditional scroll event listeners
- **Font Optimization**: Preconnected Google Fonts with display=swap for improved loading performance

### User Experience Features
The application includes several UX enhancements:

- **Smooth Scrolling**: Native CSS smooth scrolling with JavaScript fallbacks
- **Interactive Elements**: Hover effects, tooltips, and micro-interactions throughout the interface
- **Mobile-First Design**: Responsive navigation with mobile menu functionality
- **Process Slider**: Interactive step-by-step process visualization

## External Dependencies

### Typography and Icons
- **Google Fonts**: Inter font family for primary text and JetBrains Mono for monospace elements
- **Lucide Icons**: Modern icon library for consistent iconography throughout the interface

### Third-Party Services
- **Inzopay Authentication**: External signup service integration at `https://inzopay.com/auth/sginup` for user registration

### Browser APIs
- **Intersection Observer API**: For efficient scroll-based animations and navbar state management
- **CSS Custom Properties**: For dynamic theming and design system implementation
- **Prefers-Reduced-Motion**: For accessibility-compliant animation handling

### Development Tools
- **Vanilla JavaScript**: No framework dependencies, pure JavaScript for maximum performance and minimal bundle size
- **Modern CSS**: CSS Grid, Flexbox, and advanced CSS features for layout and styling
- **Web Standards**: HTML5 semantic elements and modern web APIs for optimal browser compatibility