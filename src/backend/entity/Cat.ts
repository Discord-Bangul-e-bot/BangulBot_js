import { Column, Entity, OneToMany } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import Relation from 'src/backend/entity/Relation';

@Entity()
class Cat extends BaseModel {
	@OneToMany((type) => Relation, (relation) => relation.cat)
	relations: Relation[];

	@Column()
	hungry: number;
}

export default Cat;
