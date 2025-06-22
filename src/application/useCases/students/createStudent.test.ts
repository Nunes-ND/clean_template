import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { IStudentRepository } from "../../../domain/students/IStudentRepository";
import { Student } from "../../../domain/students/Student";
import { InvalidBirthdateError } from "../../../domain/students/errors/InvalidBirthdate";
import { InvalidNameError } from "../../../domain/students/errors/InvalidName";
import { InvalidPhoneError } from "../../../domain/students/errors/InvalidPhone";
import { InMemoryStudentRepository } from "../../../shared/tests/doubles/InMemoryStudentRepository";
import { CreateStudentUseCase } from "./createStudent";
import { StudentInputDto } from "./dtos/createStudent";
import { StudentAlreadyExistsError } from "./errors/StudentAlreadyExistsError";

describe("Create Student Use Case", () => {
	let studentRepository: IStudentRepository;
	let createStudentUseCase: CreateStudentUseCase;
	const validStudentData: StudentInputDto = {
		name: "John Doe",
		phone: "05599999-9999",
		birthdate: "01/01/2000",
	};

	describe("when using a stateful in-memory repository", () => {
		beforeEach(() => {
			studentRepository = new InMemoryStudentRepository();
			createStudentUseCase = new CreateStudentUseCase(studentRepository);
		});

		it("should create a student with valid data", async () => {
			const output = await createStudentUseCase.execute(validStudentData);

			expect(output).toEqual({
				id: expect.any(String),
				name: validStudentData.name,
				phone: validStudentData.phone.replace(/\D/g, ""),
				birthdate: validStudentData.birthdate,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
		});

		it("should prevent duplicate student creation", async () => {
			await createStudentUseCase.execute(validStudentData);

			await expect(
				createStudentUseCase.execute(validStudentData),
			).rejects.toThrow(StudentAlreadyExistsError);
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
			"should reject invalid $field ($value)",
			async ({ field, value, expectedError }) => {
				const invalidData = { ...validStudentData, [field]: value };

				await expect(createStudentUseCase.execute(invalidData)).rejects.toThrow(
					expectedError,
				);
			},
		);

		it("should validate before checking for duplicates", async () => {
			const mockRepository: IStudentRepository = {
				save: vi.fn(),
				exists: vi.fn(),
			};
			const useCase = new CreateStudentUseCase(mockRepository);
			const invalidData = { ...validStudentData, name: "" };

			await expect(useCase.execute(invalidData)).rejects.toThrow(
				InvalidNameError,
			);
			expect(mockRepository.exists).not.toHaveBeenCalled();
		});
	});

	describe("when interacting with a repository mock", () => {
		let mockRepository: IStudentRepository;

		beforeEach(() => {
			mockRepository = {
				save: vi.fn().mockImplementation(async (student: Student) => student),
				exists: vi.fn().mockResolvedValue(undefined),
			};
			createStudentUseCase = new CreateStudentUseCase(mockRepository);
		});

		it("should call repository with a Student entity containing the normalized phone number", async () => {
			await createStudentUseCase.execute(validStudentData);

			const studentArgument = (mockRepository.save as Mock).mock.calls[0][0];
			const normalizedPhone = validStudentData.phone.replace(/\D/g, "");
			expect(studentArgument.getPhone().getValue()).toBe(normalizedPhone);
		});

		it("should handle repository save errors", async () => {
			const testError = new Error("Database error");
			mockRepository.save = vi.fn().mockRejectedValue(testError);

			await expect(
				createStudentUseCase.execute(validStudentData),
			).rejects.toThrow(testError);
			expect(mockRepository.save).toHaveBeenCalledTimes(1);
		});

		it("should pass a Student entity to the repository's save method", async () => {
			await createStudentUseCase.execute(validStudentData);

			expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Student));
		});
	});
});
