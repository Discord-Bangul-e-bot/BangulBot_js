import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToMany,
	JoinColumn,
	JoinTable,
	OneToOne,
	ManyToOne,
} from 'typeorm';
import BaseModel from './BaseModel';
import Cat from './Cat';
import User from './User';

@Entity()
class Relation extends BaseModel {
	@ManyToOne((type) => Cat, (cat) => cat.relations, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'cat_id' })
	cat: Cat;

	@ManyToOne((type) => Cat, (user) => user.relations, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ default: 0 })
	intimacy: number;
}

export default Relation;
