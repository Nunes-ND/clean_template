import { describe, expect, it } from "vitest";
import { Phone } from "./Phone";

describe("Phone", () => {
	it.each([
		{ phoneValue: "055999999999" },
		{ phoneValue: "(055)999999999" },
		{ phoneValue: "05599999-9999" },
		{ phoneValue: "(055)99999-9999" },
		{ phoneValue: "055 99999 9999" },
		{ phoneValue: "055-99999-9999" },
		{ phoneValue: "(055) 99999 9999" },
		{ phoneValue: "055 9 9999 9999" },
		{ phoneValue: "055-9-9999-9999" },
	])(
		"should accept valid phone formats and normalize correctly ($phoneValue)",
		({ phoneValue }) => {
			const phone = new Phone(phoneValue);
			expect(phone.getValue()).toBe("055999999999");
		},
	);

	it("should handle extreme formatting cases", () => {
		const cases = [
			{ input: " ( 055 ) 99999 - 9999 ", expected: "055999999999" },
			{ input: "0-5-5-9-9-9-9-9-9-9-9-9", expected: "055999999999" },
			{ input: "(0\t55)\n99999\t9999", expected: "055999999999" },
		];

		cases.forEach(({ input, expected }) => {
			const phone = new Phone(input);
			expect(phone.getValue()).toBe(expected);
		});
	});

	it.each([
		{
			phoneValue: "",
			expectedError: "Invalid phone number format.",
		},
		{
			phoneValue: "999999999",
			expectedError: "Invalid phone number format.",
		},
		{
			phoneValue: "055-99999999",
			expectedError: "Invalid phone number format.",
		},
		{
			phoneValue: "055-9999999999",
			expectedError: "Invalid phone number format.",
		},
		{
			phoneValue: "55-9999-99999",
			expectedError: "Invalid phone number format.",
		},
		{
			phoneValue: "55-999999999",
			expectedError: "Invalid phone number format.",
		},
		{
			phoneValue: "123456789012",
			expectedError: "Invalid phone number format.",
		},
	])(
		"should throw specific error for invalid phone ($phoneValue)",
		({ phoneValue, expectedError }) => {
			expect(() => new Phone(phoneValue)).toThrowError(expectedError);
		},
	);
});
