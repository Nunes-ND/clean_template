import { IStudentRepository } from "../../../domain/students/IStudentRepository";
import { Student } from "../../../domain/students/Student";
import { StudentInputDto, StudentOutputDto } from "./dtos/createStudent";
import { StudentAlreadyExistsError } from "./errors/StudentAlreadyExistsError";

export class CreateStudentUseCase {
	constructor(private readonly studentRepository: IStudentRepository) {}

	async execute(data: StudentInputDto): Promise<StudentOutputDto> {
		const studentEntity = Student.create(data);

		const studentExists = await this.studentRepository.exists(data);
		if (studentExists) {
			throw new StudentAlreadyExistsError();
		}

		await this.studentRepository.save(studentEntity);

		return studentEntity.getData();
	}
}
