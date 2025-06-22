export type StudentInputDto = {
	name: string;
	phone: string;
	birthdate: string;
};

export type StudentOutputDto = {
	id: string;
	name: string;
	phone: string;
	birthdate: string;
	createdAt: Date;
	updatedAt: Date;
};
