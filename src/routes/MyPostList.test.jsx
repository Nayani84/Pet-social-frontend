import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import MyPostList from "./MyPostList";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import '@testing-library/jest-dom';

// mock PetApi 
vi.mock("../PetApi", () => {
  return {
    __esModule: true,
    default: {
      getPost: vi.fn(),
      getUserPosts: vi.fn(),
      deletePost: vi.fn(),
      getComments: vi.fn(),
      addComment: vi.fn(),
      removeComment: vi.fn(),
      updateComment: vi.fn(),
    },
  };
});

describe("MyPostList Component", () => {
  const mockCurrentUser = { id: 1, username: "testuser" };

  beforeEach(() => {
    PetApi.getUserPosts.mockClear();
    PetApi.deletePost.mockClear();
  });

  it("renders without crashing", async () => {
    PetApi.getUserPosts.mockResolvedValue([
      { id: 1, title: "Post 1", content: "Content 1" },
      { id: 2, title: "Post 2", content: "Content 2" },
    ]);

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPostList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Content 1/)).toBeInTheDocument();
      expect(screen.getByText(/Content 2/)).toBeInTheDocument();
    });
  });

  it("displays a message if no posts are found", async () => {
    PetApi.getUserPosts.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPostList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No posts found/)).toBeInTheDocument();
    });
  });
});
