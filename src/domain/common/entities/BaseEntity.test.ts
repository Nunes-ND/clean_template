import { beforeEach, describe, expect, it } from "vitest";
import { BaseEntity } from "./BaseEntity";

describe("BaseEntity", () => {
	let baseEntity: BaseEntity;

	beforeEach(() => {
		baseEntity = new BaseEntity();
	});

	it("should have the id", () => {
		const idRegex =
			/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
		expect(idRegex.test(baseEntity.getId())).toBe(true);
	});

	it("should have the createdAt", () => {
		expect(baseEntity.getCreatedAt()).toStrictEqual(expect.any(Date));
	});

	it("should have the updatedAt", () => {
		expect(baseEntity.getUpdatedAt()).toStrictEqual(expect.any(Date));
	});
});
