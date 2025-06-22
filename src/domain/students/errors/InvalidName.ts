export class InvalidNameError extends Error {
	constructor() {
		super("Name must be at least 3 characters long.");
		this.name = "InvalidNameError";
	}
}
