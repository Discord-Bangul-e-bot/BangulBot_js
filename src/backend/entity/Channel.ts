import { Column, Entity } from 'typeorm';
import BaseModel from './BaseModel';

@Entity()
class Channel extends BaseModel {
	@Column()
	permission: boolean;
}

export default Channel;
