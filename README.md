# Spotify Search - Angular Application

A modern Angular 19 application for searching and browsing Spotify music albums with user registration functionality.

## 🚀 Features

- **Album Search**: Search for music albums using the Spotify Web API
- **Virtual Scroll**: Efficient rendering of large album lists using CDK Virtual Scrolling
- **Search History**: Displays the last 5 search queries with quick access
- **Album Details**: View detailed information about selected albums
- **User Registration**: Complete registration form with comprehensive validation
- **Modern Angular**: Built with Angular 19 and latest best practices
- **Signals**: Uses Angular Signals for reactive state management
- **New Control Flow**: Implements @if, @for syntax (no *ngIf/*ngFor)
- **Material Design**: Beautiful UI with Angular Material components
- **Responsive**: Fully responsive design for all screen sizes

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Spotify Developer Account

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shelly-meir/spotify-search-app.git
cd spotify-search-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Copy your Client ID and Client Secret
4. Open `src/environments/environment.ts`
5. Replace the placeholder values:

```typescript
export const environment = {
  production: false,
  spotify: {
    clientId: 'YOUR_CLIENT_ID_HERE',
    clientSecret: 'YOUR_CLIENT_SECRET_HERE',
  },
};
```

### 4. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/                 # Search page
│   │   ├── album-item/           # Album card component
│   │   ├── album-details/        # Album details page
│   │   ├── registration/         # User registration page
│   │   └── header/               # Header navigation
│   ├── services/
│   │   ├── spotify.service.ts    # Spotify API integration
│   │   └── search-history.service.ts  # Search history management
│   ├── models/
│   │   └── spotify.model.ts      # TypeScript interfaces
│   ├── app.component.*           # Root component
│   ├── app.routes.ts             # Application routing
│   └── app.config.ts             # App configuration
└── environments/
    └── environment.ts            # Environment variables
```

## 🎯 Key Technologies & Patterns

### Angular Signals
- All state management uses Angular Signals
- Computed signals for derived state
- Effects for side effects
- No manual subscriptions needed in most cases

### New Control Flow Syntax
- `@if` instead of `*ngIf`
- `@for` instead of `*ngFor`
- `@empty` for empty states
- More readable and performant

### Signal Inputs/Outputs
- `input()` and `input.required()` for component inputs
- `output()` for component events
- Type-safe and reactive

### Unsubscribe Management
- Uses `@ngneat/until-destroy` library
- Automatic cleanup of observables
- No memory leaks

## 📱 Application Routes

- `/` - Home page with album search
- `/album/:id` - Album details page
- `/registration` - User registration page

## 🎨 Features Implementation

### 1. Home Page
- Search input with Spotify API integration
- **Virtual scroll viewport** for optimal performance with large result sets
- Real-time search results display
- Last 5 queries saved in localStorage
- Clickable query chips for quick search
- Loading states and error handling
- Empty states for better UX
- **Persistent error state display** with retry functionality
- Network error handling with user-friendly messages

### 2. Album Details Page
- Comprehensive album information
- Artist details
- Release date and track count
- Link to open album in Spotify
- Back navigation
- **Error handling** for invalid album IDs
- **Loading states** during data fetch
- **Fallback UI** for missing or failed album data

### 3. User Registration
- Email validation (regex pattern)
- Username validation:
  - Only English characters and numbers
  - Cannot start with a number
  - No spaces
- Password validation:
  - At least 1 uppercase letter
  - At least 1 number
  - No spaces
- Real-time validation feedback
- Form status indicators
- Validation rules display
- **Comprehensive error messages** for each validation rule
- **Field-level error display** with helpful hints

## 🛡️ Error Handling & Edge Cases

### API Error Handling
- **Authentication Errors**: Displays user-friendly messages when Spotify API authentication fails
- **Network Failures**: Catches and displays network errors with retry options
- **401 Errors**: Handles expired authentication with clear messages
- **Rate Limiting**: Gracefully handles API rate limits
- **Empty Responses**: Shows appropriate messages when no results are found

### User Input Validation
- **Empty Search**: Prevents search with empty queries
- **Whitespace Trimming**: Automatically trims leading/trailing spaces
- **Form Validation**: Real-time validation with regex patterns
- **Required Fields**: Clear indicators for required form fields
- **Invalid Formats**: Specific error messages for each validation failure

### Application States
- **Loading States**: Spinners and loading indicators during API calls
- **Empty States**: Helpful messages when no data is available
- **No Results**: Clear feedback when search returns zero results
- **Error States**: Persistent error displays with retry functionality
- **Success States**: Visual confirmation for successful operations

### Edge Cases Covered
- Invalid album IDs in URL parameters
- Missing album images (placeholder fallback)
- Network timeouts and connection issues
- Malformed API responses
- Browser localStorage failures
- Window resize handling for responsive layout
- Duplicate search queries in history
- Special characters in search input

## 🔨 Development Scripts

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code with Prettier
npx prettier --write "src/**/*.{ts,html,scss}"
```

## 🎨 Styling

The application uses:
- Angular Material for UI components
- Custom SCSS for additional styling
- Responsive design with CSS Grid and Flexbox
- Material Design color palette

## 📦 Dependencies

### Core
- Angular 19.0.2
- Angular Material 19.x
- **Angular CDK (Virtual Scrolling)**
- RxJS 7.8.0

### Additional
- @ngneat/until-destroy - Subscription management
- Prettier - Code formatting

## 🌟 Best Practices Implemented

1. **Signals First**: Uses signals as primary state management
2. **Standalone Components**: All components are standalone
3. **Dependency Injection**: Uses `inject()` function
4. **Type Safety**: Full TypeScript typing
5. **Error Handling**: Comprehensive error handling
6. **Edge Cases**: Handles empty states, loading states, errors
7. **Code Organization**: Clear separation of concerns
8. **Responsive Design**: Mobile-first approach
9. **Accessibility**: Proper ARIA labels and semantic HTML
10. **Clean Code**: Following Angular style guide
11. **Performance Optimization**: Virtual scrolling for large lists
12. **Regex Validation**: Custom regex patterns for form validation

## 🚀 Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📝 Notes

- The application requires active Spotify API credentials to function
- Search history is persisted in browser localStorage
- The registration form simulates submission (no backend integration)
- All data is fetched from Spotify's official API
