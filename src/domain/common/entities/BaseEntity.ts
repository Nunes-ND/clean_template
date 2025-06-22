export type BaseEntityProps = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

export class BaseEntity {
	protected id: string;
	protected createdAt: Date;
	protected updatedAt: Date;

	constructor(baseData?: BaseEntityProps) {
		const { id, createdAt, updatedAt } = baseData || {};
		this.initialize(id, createdAt, updatedAt);
	}

	private initialize(id?: string, createdAt?: Date, updatedAt?: Date) {
		this.id = id || crypto.randomUUID();
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	getId() {
		return this.id;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}
}
