import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrentUserContext } from "../CurrentUserContext";
import NavBar from "./NavBar";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import '@testing-library/jest-dom';


// Mock react-router-dom to include Link, MemoryRouter, and useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'), 
  Link: ({ to, children }) => <a href={to}>{children}</a>,  
  MemoryRouter: ({ children }) => <div>{children}</div>, 
  useNavigate: vi.fn(),  
}));

describe("NavBar", () => {
  const mockOnLogout = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderNavBarWithUser = (user) => {
    render(
      <CurrentUserContext.Provider value={{ currentUser: user }}>
        <NavBar onLogout={mockOnLogout} />
      </CurrentUserContext.Provider>
    );
  };

  const renderNavBarWithoutUser = () => {
    render(
      <CurrentUserContext.Provider value={{ currentUser: null }}>
        <NavBar onLogout={mockOnLogout} />
      </CurrentUserContext.Provider>
    );
  };

  it("renders the navbar correctly when user is logged in", () => {
    const mockUser = { username: "testuser" };
    renderNavBarWithUser(mockUser);

    expect(screen.getByText("PetLovers")).toBeInTheDocument();

    const petsLinks = screen.getAllByText("Pets");
    expect(petsLinks.length).toBeGreaterThan(0);

    const userLinks = screen.getAllByText("testuser");
  expect(userLinks.length).toBeGreaterThan(0);

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("renders the navbar correctly when no user is logged in", () => {
    renderNavBarWithoutUser();

    expect(screen.getByText("PetLovers")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("calls onLogout and navigates to login when logout button is clicked", () => {
    const mockUser = { username: "testuser" };
    renderNavBarWithUser(mockUser);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
