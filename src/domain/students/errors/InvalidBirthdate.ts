export class InvalidBirthdateError extends Error {
	constructor(message: string = "Invalid birthdate format or value.") {
		super(message);
		this.name = "InvalidBirthdateError";
	}
}
