import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	PrimaryColumn,
	BeforeInsert,
	ValueTransformer,
	Generated,
} from 'typeorm';

function bigIntValidator(num: bigint) {
	if (num.toString().length >= 20) {
		num = BigInt(num.toString().substring(0, 10));
	}
	console.log('bigint', num);
	return num;
}

export const bigint: ValueTransformer = {
	to: (entityValue: bigint) => bigIntValidator(entityValue),
	from: (databaseValue: string): bigint => bigIntValidator(BigInt(databaseValue)),
};

@Entity()
class BaseModel extends BaseEntity {
	@Generated('uuid')
	@PrimaryColumn('varchar')
	id: string;

	@Column()
	name: string;

	@Column({ name: 'created_at', default: () => 'now()', type: 'timestamp' })
	createdAt: Date;

	@BeforeInsert()
	beforeInsertActions() {
		this.createdAt = new Date();
	}
	async save() {
		return await super.save();
	}
}

export default BaseModel;
