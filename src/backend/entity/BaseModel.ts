import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
class BaseModel extends BaseEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column()
	name: string;

	@Column({ name: 'created_at', default: () => 'now()', type: 'timestamp' })
	createdAt: Date;

	@BeforeInsert()
	beforeInsertActions() {
		this.createdAt = new Date();
	}
}

export default BaseModel;
