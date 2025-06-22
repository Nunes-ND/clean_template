import { isValid, parse } from "date-fns";
import { ZodError, z } from "zod";
import { InvalidBirthdateError } from "../errors/InvalidBirthdate";

const MINIMUM_COLLEGE_AGE = 16;
const birthdateSchema = z
	.string()
	.trim()
	.refine(
		(dateStr: string) => {
			const date = parse(dateStr, "dd/MM/yyyy", new Date());
			return isValid(date);
		},
		{ message: "Birthdate must be in DD/MM/YYYY format." },
	)
	.refine(
		(dateStr: string) => {
			const date = parse(dateStr, "dd/MM/yyyy", new Date());
			return date < new Date();
		},
		{ message: "Birthdate cannot be in the future." },
	)
	.refine(
		(dateStr) => {
			const birthDate = parse(dateStr, "dd/MM/yyyy", new Date());
			const currentDate = new Date();

			let age = currentDate.getUTCFullYear() - birthDate.getUTCFullYear();
			const monthDifference =
				currentDate.getUTCMonth() - birthDate.getUTCMonth();
			if (
				monthDifference < 0 ||
				(monthDifference === 0 &&
					currentDate.getUTCDate() < birthDate.getUTCDate())
			) {
				age--;
			}
			return age >= MINIMUM_COLLEGE_AGE;
		},
		{ message: `Student must be at least ${MINIMUM_COLLEGE_AGE} years old.` },
	);

export class Birthdate {
	private birthdateValue: string;

	constructor(private readonly value: string) {
		try {
			this.birthdateValue = birthdateSchema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new InvalidBirthdateError(error.errors[0].message);
			}
			throw new InvalidBirthdateError("Invalid birthdate provided.");
		}
	}

	getValue() {
		return this.birthdateValue;
	}
}
