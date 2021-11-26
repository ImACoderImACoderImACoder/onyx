import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Tap anywhere to connect/i);
  expect(linkElement).toBeInTheDocument();
});
