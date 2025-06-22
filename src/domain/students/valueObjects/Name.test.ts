import { describe, expect, it } from "vitest";
import { Name } from "./Name";

describe("Name", () => {
	it("should have the name value", () => {
		const nameValue = "John Doe";
		const name = new Name(nameValue);
		expect(name.getValue()).toBe(nameValue);
	});

	it("should accept names with special characters and accents", () => {
		const names = [
			"João Álvaro",
			"Maria-José",
			"Antônio O'Connor",
			"André Müller",
		];

		names.forEach((nameValue) => {
			const name = new Name(nameValue);
			expect(name.getValue()).toBe(nameValue);
		});
	});

	it("should trim whitespace from name", () => {
		const cases = [
			{ input: "  John Doe  ", expected: "John Doe" },
			{ input: "\tJane Smith\n", expected: "Jane Smith" },
		];

		cases.forEach(({ input, expected }) => {
			const name = new Name(input);
			expect(name.getValue()).toBe(expected);
		});
	});

	it.each([
		{
			nameValue: "",
			expectedError: "Name must be at least 3 characters long.",
		},
		{
			nameValue: "a",
			expectedError: "Name must be at least 3 characters long.",
		},
		{
			nameValue: "aa",
			expectedError: "Name must be at least 3 characters long.",
		},
		{
			nameValue: "   ",
			expectedError: "Name must be at least 3 characters long.",
		},
	])(
		"should throw specific error for invalid name value",
		({ nameValue, expectedError }) => {
			expect(() => new Name(nameValue)).toThrowError(expectedError);
		},
	);

	it("should accept name with exactly 3 characters", () => {
		const name = new Name("Ana");
		expect(name.getValue()).toBe("Ana");
	});
});
