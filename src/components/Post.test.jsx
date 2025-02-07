import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Post from "./Post";
import '@testing-library/jest-dom';
import { vi } from "vitest";
import PetApi from "../PetApi";

vi.mock("../PetApi", () => ({
    __esModule: true,
    default: {
        getPost: vi.fn(),
        getComments: vi.fn(),
        addComment: vi.fn(),
        removeComment: vi.fn(),
        updateComment: vi.fn(),
        getUserPosts: vi.fn(),
        deletePost: vi.fn(),
    },
}));


it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <Post post={{ id: 5, content: "Test Post" }} />
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <Post post={{ id: 5, content: "Test Post" }} />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

it("displays pet details correctly", function () {
    const { getByText } = render(
        <MemoryRouter>
            <Post post={{ id: 5, content: "Test Post" }} />
        </MemoryRouter>
    );

    expect(getByText("Test Post")).toBeInTheDocument();
});
