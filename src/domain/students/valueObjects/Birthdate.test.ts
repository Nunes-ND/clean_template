import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Birthdate } from "./Birthdate";

describe("Birthdate", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-01-10T00:00:00.000Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should create a valid birthdate for a student with sufficient age", () => {
		const value = "09/01/2009";

		const birthdate = new Birthdate(value);

		expect(birthdate.getValue()).toBe(value);
	});

	it("should create birthdate for a student who is exactly 16 years old", () => {
		const value = "10/01/2009";

		const birthdate = new Birthdate(value);

		expect(birthdate.getValue()).toBe(value);
	});

	it.each([
		{
			birthdateValue: "",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "01-01-2000",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "01/01/00",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "00/01/2000",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "32/01/2000",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "01/00/2000",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "01/13/2000",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "29/02/2025",
			expectedError: "Birthdate must be in DD/MM/YYYY format.",
		},
		{
			birthdateValue: "11/01/2025",
			expectedError: "Birthdate cannot be in the future.",
		},
		{
			birthdateValue: "11/01/2009",
			expectedError: "Student must be at least 16 years old.",
		},
	])(
		"should throw specific error messages for invalid birthdate",
		({
			birthdateValue,
			expectedError,
		}: { birthdateValue: string; expectedError: string }) => {
			expect(() => new Birthdate(birthdateValue)).toThrowError(expectedError);
		},
	);
});
