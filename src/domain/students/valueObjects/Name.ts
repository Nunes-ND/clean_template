import { z } from "zod";
import { InvalidNameError } from "../errors/InvalidName";

const nameSchema = z
	.string()
	.trim()
	.min(3, { message: "Name must be at least 3 characters long." });

export class Name {
	private nameValue: string;

	constructor(private readonly value: string) {
		try {
			this.nameValue = nameSchema.parse(value);
		} catch (_error) {
			throw new InvalidNameError();
		}
	}

	getValue() {
		return this.nameValue;
	}
}
