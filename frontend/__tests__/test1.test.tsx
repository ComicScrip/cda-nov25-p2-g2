import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

// Mock next/router

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Heading", () => {
  it("composed h1", () => {
    render(
      <MockedProvider>
        <Header />
      </MockedProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
