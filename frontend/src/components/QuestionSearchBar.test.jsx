import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import QuestionSearchBar from "./QuestionSearchBar";

describe("QuestionSearchBar", () => {
  it("reports typed search values", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<QuestionSearchBar value="" onChange={onChange} />);
    await user.type(screen.getByRole("searchbox", { name: /search faqs/i }), "fee");

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.map(([value]) => value).join("")).toContain("fee");
  });

  it("shows a clear button for a non-empty search", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<QuestionSearchBar value="deadline" onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /clear search/i }));

    expect(onChange).toHaveBeenCalledWith("");
  });
});
