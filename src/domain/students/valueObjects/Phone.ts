import { z } from "zod";
import { InvalidPhoneError } from "../errors/InvalidPhone";

const phoneSchema = z
	.string()
	.trim()
	.regex(/^\(?\d{3}\)?[\s-]?9\d{4}[\s-]?\d{4}$/, {
		message: "Invalid phone number format.",
	});

export class Phone {
	private phoneValue: string;

	constructor(private readonly value: string) {
		try {
			this.phoneValue = phoneSchema.parse(value.replaceAll(/\D/g, ""));
		} catch (_error) {
			throw new InvalidPhoneError();
		}
	}

	getValue() {
		return this.phoneValue;
	}
}
