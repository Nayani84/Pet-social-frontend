import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PetApi from "../PetApi";
import PostDetail from "./PostDetail";
import { CurrentUserContext } from "../CurrentUserContext";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock PetApi
vi.mock("../PetApi", () => {
  return {
    __esModule: true,
    default: {
      getPost: vi.fn(),
      getComments: vi.fn(),
      addComment: vi.fn(),
      removeComment: vi.fn(),
      updateComment: vi.fn(),
    },
  };
});

describe("PostDetail component", () => {
  const mockPost = {
    id: 1,
    content: "Test Post Content",
    imageUrl: "https://via.placeholder.com/150",
    ownerId: 123,
    ownerUsername: "postowner",
    createdAt: "2025-01-01T12:00:00Z",
  };

  const mockCurrentUser = { username: "testuser" };

  beforeEach(() => {
    // Default mock return values for each test
    PetApi.getPost.mockResolvedValue(mockPost);
    // Default to an empty array for comments
    PetApi.getComments.mockResolvedValue([]);
  });

  it("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders post details after fetching successfully", async () => {

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockPost.content)).toBeInTheDocument();
      expect(screen.getByText(/created at:/i)).toBeInTheDocument();
      expect(screen.getByRole("img", { name: /post/i })).toHaveAttribute("src", mockPost.imageUrl);
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    PetApi.getPost.mockRejectedValueOnce(new Error("Failed to fetch post"));

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    // Asserting that console.error was called with the expected error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching post details:",
      expect.any(Error)
    );

    // Restore the original console.error after the test
    consoleErrorSpy.mockRestore();
  });
});
