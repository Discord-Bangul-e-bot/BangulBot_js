import { Column, Entity, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import Relation from './Relation';

@Entity()
class Cat extends BaseModel {
	@OneToMany((type) => Relation, (relation) => relation.cat)
	relations: Relation[];

	@Column()
	hungry: number;
}

export default Cat;
