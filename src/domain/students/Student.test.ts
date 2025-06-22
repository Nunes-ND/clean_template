import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Student, StudentData, StudentProps } from "./Student";
import { InvalidBirthdateError } from "./errors/InvalidBirthdate";
import { InvalidNameError } from "./errors/InvalidName";
import { InvalidPhoneError } from "./errors/InvalidPhone";
import { Birthdate } from "./valueObjects/Birthdate";
import { Name } from "./valueObjects/Name";
import { Phone } from "./valueObjects/Phone";

describe("Student", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-10T10:00:00.000Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const validStudentData: StudentProps = {
		name: "John Doe",
		phone: "(055) 99999-9999",
		birthdate: "09/01/2008",
	};

	it("should create a student instance with correct data and value objects", () => {
		const student = Student.create(validStudentData);

		expect(student).toBeInstanceOf(Student);
		expect(student.getData()).toEqual({
			id: expect.stringMatching(
				/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
			),
			name: validStudentData.name,
			phone: validStudentData.phone.replace(/\D/g, ""),
			birthdate: validStudentData.birthdate,
			createdAt: new Date("2024-01-10T10:00:00.000Z"),
			updatedAt: new Date("2024-01-10T10:00:00.000Z"),
		});

		expect(student.getName()).toBeInstanceOf(Name);
		expect(student.getPhone()).toBeInstanceOf(Phone);
		expect(student.getBirthdate()).toBeInstanceOf(Birthdate);
	});

	it.each([
		{ field: "name", value: "", expectedError: InvalidNameError },
		{ field: "name", value: "A", expectedError: InvalidNameError },
		{ field: "phone", value: "123", expectedError: InvalidPhoneError },
		{
			field: "birthdate",
			value: "01/01/2025",
			expectedError: InvalidBirthdateError,
		},
	])(
		"should throw $expectedError.name when $field is invalid ($value)",
		({ field, value, expectedError }) => {
			const invalidData = { ...validStudentData, [field]: value };
			expect(() => Student.create(invalidData)).toThrow(expectedError);
		},
	);

	it("should generate different UUIDs for different students", () => {
		const student1 = Student.create(validStudentData);
		const student2 = Student.create(validStudentData);

		expect(student1.getData().id).not.toBe(student2.getData().id);
	});

	it("should restore a student instance from data", () => {
		const student = Student.create(validStudentData);
		const studentId = student.getData().id;
		const studentData: StudentData = student.getData();
		const { name, phone, birthdate, ...restoredStudentData } = studentData;

		const restoredStudent = Student.restore(
			{ name, phone, birthdate },
			restoredStudentData,
		);

		expect(restoredStudent).toBeInstanceOf(Student);
		expect(restoredStudent.getData()).toEqual({
			id: studentId,
			name,
			phone,
			birthdate,
			createdAt: restoredStudentData.createdAt,
			updatedAt: restoredStudentData.updatedAt,
		});
	});
});
