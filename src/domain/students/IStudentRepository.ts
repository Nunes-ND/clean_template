import { Student, StudentProps } from "./Student";

export interface IStudentRepository {
	save: (student: Student) => Promise<Student>;
	exists: (studentData: StudentProps) => Promise<boolean>;
}
