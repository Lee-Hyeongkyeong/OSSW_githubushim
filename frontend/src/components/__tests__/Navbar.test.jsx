import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import API_CONFIG from '../../config/api';

// Mock fetch
global.fetch = jest.fn();

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

// Mock console.error to prevent error messages in test output
console.error = jest.fn();

describe('Navbar Component', () => {
  // Given: Setup the test environment
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset fetch mock
    fetch.mockReset();
    // Clear localStorage
    localStorage.clear();
  });

  test('renders login button when user is not logged in', () => {
    // Given: Mock fetch to return not logged in
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ loggedIn: false })
    });

    // When: Component is rendered
    renderNavbar();

    // Then: Login button should be present
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

  test('renders logout button when user is logged in', async () => {
    // Given: Mock fetch to return logged in
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ loggedIn: true })
    });

    // When: Component is rendered
    renderNavbar();

    // Then: Logout button should be present
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toBeInTheDocument();
    });
  });

  test('opens Google login popup when login button is clicked', () => {
    // Given: Mock fetch to return not logged in
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ loggedIn: false })
    });

    // When: Component is rendered and login button is clicked
    renderNavbar();
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    // Then: Google login popup should open
    expect(mockOpen).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/`,
      'googleLogin',
      'width=500,height=600'
    );
  });

  test('handles logout successfully', async () => {
    // Given: Mock fetch responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ loggedIn: true })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' })
      });

    // When: Component is rendered and logout button is clicked
    renderNavbar();
    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    // Then: Logout API should be called and alert shown
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/logout`,
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        })
      );
      expect(mockAlert).toHaveBeenCalledWith('로그아웃이 완료됐습니다.');
    });
  });

  test('handles login check error gracefully', async () => {
    // Given: Mock fetch to throw error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    // When: Component is rendered
    renderNavbar();

    // Then: Login button should still be present
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

  test('maintains login state after page refresh', async () => {
    // Given: Mock localStorage and fetch
    const mockToken = 'fake-token';
    localStorage.setItem('token', mockToken);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ loggedIn: true })
    });

    // When: Component is rendered
    renderNavbar();

    // Then: Should maintain logged in state
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('handles Google OAuth callback', async () => {
    // Given: Mock fetch responses for both initial state and after OAuth
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ loggedIn: false })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ loggedIn: true })
      });

    // When: Component is rendered
    renderNavbar();

    // And: Simulate Google OAuth callback
    const mockUserData = {
      type: 'LOGIN_SUCCESS',
      user: {
        name: 'Test User',
        email: 'test@example.com'
      }
    };

    // Use act to wrap state updates and ensure all promises are resolved
    await act(async () => {
      window.postMessage(mockUserData, '*');
      // Wait for any promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Then: Should update login state and show logout button
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('handles unauthorized API access', async () => {
    // Given: Mock fetch to return unauthorized
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthorized' })
    });

    // When: Component is rendered
    renderNavbar();

    // Then: Should show login button
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('handles session expiration', async () => {
    // Given: Mock fetch to return session expired
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Session expired' })
    });

    // When: Component is rendered
    renderNavbar();

    // Then: Should show login button
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
