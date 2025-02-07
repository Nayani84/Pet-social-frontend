import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostNewForm from "./PostNewForm";
import { vi } from "vitest";
import PetApi from "../PetApi";

// Mocking the PetApi module
vi.mock("../PetApi", () => ({
  default: {
    createPost: vi.fn(() => Promise.resolve({ id: 1 }))
  }
}));

// Mocking the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn().mockImplementation(() => (path) => console.log(`Navigate to ${path}`)),
  };
});

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <PostNewForm currentUser={{ id: 1 }} />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <PostNewForm currentUser={{ id: 1 }} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("submits the form with post data", async function () {
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <PostNewForm currentUser={{ id: 1 }} />
    </MemoryRouter>
  );

  const contentInput = getByLabelText("Content :");
  const imageUrlInput = getByLabelText("Image URL :");
  const submitButton = getByText("Add Post");

  // Simulate user typing into the input fields
  fireEvent.change(contentInput, { target: { value: "New Post Content" } });
  fireEvent.change(imageUrlInput, { target: { value: "http://example.com/image.jpg" } });

  fireEvent.click(submitButton);

  // Wait for expectations to avoid act warnings
  await waitFor(() => {
    expect(PetApi.createPost).toHaveBeenCalledWith({
      content: "New Post Content",
      imageUrl: "http://example.com/image.jpg",
      ownerId: 1
    });
  });
});

