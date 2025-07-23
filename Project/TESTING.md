# JobFit.AI Testing & Debugging Guide

This document provides instructions for testing and debugging the JobFit.AI application.

## Table of Contents

1. [Testing Setup](#testing-setup)
2. [Running Tests](#running-tests)
3. [Debugging Tools](#debugging-tools)
4. [Common Issues](#common-issues)
5. [Performance Testing](#performance-testing)

## Testing Setup

The JobFit.AI application uses Jest and React Testing Library for unit and integration testing.

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

```bash
# Install dependencies (including test libraries)
npm install
```

### Test Configuration

- Test configuration is in `jest.config.js`
- Test setup is in `jest.setup.js`

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode (for development)
npm run test:watch

# Run a specific test file
npm test -- __tests__/components/UploadCV.test.tsx

# Run tests matching a pattern
npm test -- -t "CV upload"
```

## Debugging Tools

### Debug Panel (Development Only)

The application includes a built-in debug panel for development environments:

1. **Keyboard Shortcut**: Press `Ctrl+Shift+D` to toggle the debug panel
2. **Features**:
   - View the current state of Zustand stores
   - Inspect LocalStorage data
   - Test API endpoints
   - Reset application state
   - Download state data for debugging

### Logger Utilities

Use the debug utilities in `lib/debug-utils.ts`:

```typescript
import { logger, perf, storageDebugger } from '../lib/debug-utils';

// Logging with different levels
logger.info('User submitted form', formData);
logger.warn('API request took longer than expected');
logger.error('Failed to upload CV', error);
logger.success('CV uploaded successfully', response);

// Performance measurement
perf.start('cvUpload');
await uploadCV(formData);
const duration = perf.end('cvUpload'); // duration in ms

// LocalStorage debugging
storageDebugger.inspect('job-match-storage');
storageDebugger.listAll();
```

### API Debugging

API requests are automatically logged in development mode with:
- Request details (endpoint, method, payload)
- Response details (status, data)
- Error details when requests fail

To make a traced API request:

```typescript
import { logApiRequest } from '../lib/debug-utils';

const result = await logApiRequest(
  '/api/resumes/upload',
  'POST',
  { fileName: 'resume.pdf' },
  () => api.uploadCV(formData)
);
```

## Common Issues

### API Connection Issues

If you see API connection errors:

1. Ensure the backend API is running at the URL specified in `.env.local`
2. Check the API health status in the debug panel
3. Verify Supabase authentication is working
4. Check browser console for CORS errors

### Store State Issues

If the application state is not updating correctly:

1. Use the debug panel to inspect the current store state
2. Check if actions are being called with the correct parameters
3. Reset the application state from the debug panel
4. Check localStorage for stale data

### CV Upload Issues

If CV uploads are failing:

1. Verify file type (only PDF, DOCX, and DOC are supported)
2. Check file size (max 5MB)
3. Ensure you're authenticated (check Supabase token)
4. Check the network request in browser developer tools

## Performance Testing

### Component Render Tracking

Track component render cycles:

```typescript
import { trackRender } from '../lib/debug-utils';

const MyComponent = (props) => {
  trackRender('MyComponent', props);
  // Component code...
};
```

### Network Performance

Monitor API request performance:

1. Open the debug panel
2. Switch to the "API" tab
3. Make API requests to see timing data
4. For more detailed timing, use browser developer tools Network tab

### Bundle Analysis

Analyze the bundle size:

```bash
# Install the bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add configuration to next.config.js
# Then run build with analysis
ANALYZE=true npm run build
```

## Creating New Tests

When adding new features, follow these steps to create tests:

1. Create a test file in the `__tests__` directory matching the structure of the source code
2. Import the component or module to test
3. Mock dependencies using Jest
4. Write test cases that cover normal usage and edge cases
5. Run tests to verify functionality

Example test structure:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { YourComponent } from '../components/YourComponent';

// Mock dependencies
jest.mock('../store/yourStore', () => ({
  useYourStore: jest.fn(),
}));

describe('YourComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    render(<YourComponent />);
    fireEvent.click(screen.getByRole('button'));
    // Assert expected behavior
  });
});
``` 