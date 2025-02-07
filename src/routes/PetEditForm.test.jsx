import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PetEditForm from './PetEditForm';
import { CurrentUserContext } from '../CurrentUserContext';
import PetApi from '../PetApi';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock PetApi 
vi.mock('../PetApi', () => ({
  default: {
    getPet: vi.fn(),
    updatePet: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('PetEditForm Component', () => {
  const currentUser = { username: 'testuser' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form with fetched pet data', async () => {
    PetApi.getPet.mockResolvedValueOnce({
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 5,
      bio: 'Friendly and playful',
      photoUrl: 'http://example.com/buddy.jpg',
    });

    render(
      <MemoryRouter initialEntries={['/pets/7']}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PetEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the PetEditForm to load "Buddy" into the Name field
    await waitFor(() => {
      expect(screen.getByDisplayValue('Buddy')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Dog')).toBeInTheDocument();
    });
  });

  test('submitting form sends API call and shows success message', async () => {
    // Setup the mocks
    PetApi.getPet.mockResolvedValueOnce({
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 5,
      bio: 'Friendly and playful',
      photoUrl: 'http://example.com/buddy.jpg',
    });
    PetApi.updatePet.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/pets/7']}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PetEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to populate
    await waitFor(() => {
      expect(screen.getByDisplayValue('Buddy')).toBeInTheDocument();
    });

    // Change the Name field and submit
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Max' },
    });
    fireEvent.click(screen.getByText('Update Pet'));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Pet updated successfully!!')).toBeInTheDocument();
      expect(PetApi.updatePet).toHaveBeenCalledWith('7', {
        name: 'Max',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: 5,
        bio: 'Friendly and playful',
        photoUrl: 'http://example.com/buddy.jpg',
      });
    });
  });

  test('displays error message on API failure', async () => {
    PetApi.getPet.mockRejectedValueOnce(new Error('Could not load pet details.'));

    render(
      <MemoryRouter initialEntries={['/pets/7']}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PetEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Could not load pet details.')).toBeInTheDocument();
    });
  });

  test('shows validation errors for required fields', async () => {
    // Return empty fields from the API
    PetApi.getPet.mockResolvedValueOnce({
      name: '',
      type: '',
      breed: '',
      age: '',
      bio: '',
      photoUrl: '',
    });

    render(
      <MemoryRouter initialEntries={['/pets/7']}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PetEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    });

    // Attempt to submit empty fields
    fireEvent.click(screen.getByText('Update Pet'));

    await waitFor(() => {
      // Check each field is invalid
      expect(screen.getByLabelText(/Name/i)).toBeInvalid();
      expect(screen.getByLabelText(/Type/i)).toBeInvalid();
      expect(screen.getByLabelText(/Breed/i)).toBeInvalid();
      expect(screen.getByLabelText(/Age/i)).toBeInvalid();
      expect(screen.getByLabelText(/Bio/i)).toBeInvalid();
      expect(screen.getByLabelText(/Photo Url/i)).toBeInvalid();
    });
  });
});

