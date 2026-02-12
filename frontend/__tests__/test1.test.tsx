import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import Header from "@/components/Header";
import { ProfileDocument } from "@/graphql/generated/schema";

const profileMock = {   
    request: {
        query: ProfileDocument
    },
    result: {
        data: {
            me: null
        }
    }
};

jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: () => jest.fn()  // méthode utilisée Header
        };
    },
}));

describe("Header test", () => {
  it("contains a h1 element, with 'P2 Template'", () => {
    render(<MockedProvider mocks={[profileMock]}>
      <Header />
    </MockedProvider>);

    expect(screen.getByRole("heading", {level: 1})).toBeInTheDocument();
    // on teste là si on a un texte 'P2 template' dans notre rendu
    expect(screen.getByText("P2 template")).toBeInTheDocument();
    // ici, on teste si notre h1 a un texte comportant 'P2 template'
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("P2 template");
  });
});
