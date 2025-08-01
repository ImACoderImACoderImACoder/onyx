# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Onyx is a React web application that interfaces with the Volcano Hybrid vaporizer via Web Bluetooth API. It provides a custom alternative to the official Volcano web application with enhanced workflow management and device control features.

## Development Commands

### Build and Development
- `npm run dev` - Start development server with Vite
- `npm run dev-host` - Start development server with host access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

### Testing
No test commands are currently configured in package.json. Tests would use the @testing-library setup already installed.

## Architecture

### State Management
- **Redux Toolkit** with 4 main slices:
  - `deviceInformation` - BLE firmware versions, serial numbers, hours of operation
  - `deviceInteraction` - Temperature control, fan/heat status, current workflow execution
  - `settings` - User preferences, themes, auto-shutoff, LED brightness
  - `workflow` - Workflow creation, editing, and execution state

### Key Directories
- `src/features/` - Feature-based architecture with each feature containing components, containers, and slice
- `src/services/` - Core BLE communication, characteristic caching, and utilities
- `src/themes/` - Comprehensive theming system with seasonal and custom themes
- `src/constants/` - Bluetooth UUIDs, actions, enums, and device-specific constants

### Bluetooth Integration
- Web Bluetooth API for Volcano Hybrid communication
- Multiple service UUIDs for different device capabilities
- BLE characteristic caching system for performance
- iOS compatibility with WebBLE/Bluefy apps

### UI Framework
- React 18 with React Router for SPA routing
- Bootstrap 5 with styled-components for theming
- React DnD for workflow item drag-and-drop
- Touch and desktop support with different backends

### Workflow System
- Drag-and-drop workflow editor with configurable items
- JSON-based workflow configuration with validation
- Real-time workflow execution with step tracking
- Conditional heat items and loop commands

## Code Conventions

### Component Structure
- Feature-based organization under `src/features/`
- Container components for Redux connections
- Styled components using theme provider
- PropTypes for type checking

### State Management Patterns
- Redux slices with extraReducers for store reinitialization
- Local storage integration for persistent settings
- Action constants in separate files

### Styling
- Styled-components with centralized theme system
- Bootstrap integration for base styling
- Responsive design with mobile touch support
- Custom fonts (digital-7.mono.ttf) for display elements

## Development Considerations
- Always think about how your changes effect the complex themeing structure. Pay special attention to pridetext

## Core Principles
- Everything you do must work for mobile

## Code Best Practices
- Always import the conversion function for changing between c and f instead of creating your own
- Always take the isF flag and the correct temperature conversion into account when dealing with temperature