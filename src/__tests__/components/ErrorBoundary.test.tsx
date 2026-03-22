import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

// Suppress console.error from React error boundary logging
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn();
});
afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});

const GoodChild = () => <div>Hello World</div>;

const BadChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('shows Refresh Page button on error', () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  test('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    // NODE_ENV is already 'test' in Jest, which is !== 'development'
    // So error details should NOT show
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    );
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });

  test('does not show error UI before an error occurs', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
