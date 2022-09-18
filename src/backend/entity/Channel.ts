import { Column, Entity } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';

@Entity()
class Channel extends BaseModel {
	@Column()
	permission: boolean;
}

export default Channel;
