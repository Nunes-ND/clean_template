import { IStudentRepository } from "../../../domain/students/IStudentRepository";
import {
	Student,
	StudentData,
	StudentProps,
} from "../../../domain/students/Student";

export class InMemoryStudentRepository implements IStudentRepository {
	private students: Map<string, StudentData> = new Map();

	save(student: Student): Promise<Student> {
		const { id, name, phone, birthdate, createdAt, updatedAt } =
			student.getData();
		this.students.set(id, { id, name, phone, birthdate, createdAt, updatedAt });
		return new Promise((resolve) => resolve(student));
	}

	exists(studentData: StudentProps): Promise<boolean> {
		const studentExists = Array.from(this.students.values()).some(
			(student) =>
				student.name === studentData.name &&
				student.phone === studentData.phone.replaceAll(/\D/g, "") &&
				student.birthdate === studentData.birthdate,
		);
		return Promise.resolve(studentExists);
	}

	clear(): void {
		this.students.clear();
	}
}
