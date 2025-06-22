import { BaseEntity, BaseEntityProps } from "../common/entities/BaseEntity";
import { Birthdate } from "./valueObjects/Birthdate";
import { Name } from "./valueObjects/Name";
import { Phone } from "./valueObjects/Phone";

export type StudentProps = {
	name: string;
	phone: string;
	birthdate: string;
};

export type StudentData = StudentProps & BaseEntityProps;

export class Student extends BaseEntity {
	private name: Name;
	private phone: Phone;
	private birthdate: Birthdate;

	private constructor(props: StudentProps, userData?: BaseEntityProps) {
		super(userData);
		this.name = new Name(props.name);
		this.phone = new Phone(props.phone);
		this.birthdate = new Birthdate(props.birthdate);
	}

	public static create(data: StudentProps): Student {
		return new Student(data);
	}

	public static restore(
		props: StudentProps,
		userData: BaseEntityProps,
	): Student {
		return new Student(props, userData);
	}

	getName() {
		return this.name;
	}

	getPhone() {
		return this.phone;
	}

	getBirthdate() {
		return this.birthdate;
	}

	getData(): StudentData {
		return {
			id: this.id,
			name: this.name.getValue(),
			phone: this.phone.getValue(),
			birthdate: this.birthdate.getValue(),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
