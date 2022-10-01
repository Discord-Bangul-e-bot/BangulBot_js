import Discord from 'discord.js';
import BaseModel from 'src/backend/entity/BaseModel';
import Cat from 'src/backend/entity/Cat';
import User from 'src/backend/entity/User';
import { AfterInsert, BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import CatRepository from 'src/backend/repository/CatRepository';
import UserRepository from 'src/backend/repository/UserRepository';

@Entity()
class Relation extends BaseModel {
	@ManyToOne((type) => Cat, (cat) => cat.relations, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'cat_id' })
	cat: Cat;

	@ManyToOne((type) => User, (user) => user.relations, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ default: 0 })
	intimacy: number;

	async increaseIntimacy(amount = 1) {
		if (!this.setIntimacyAvailable(amount)) {
			return false;
		}
		await this.setIntimacy(amount);
		return true;
	}

	async decreaseIntimacy(amount = 1) {
		if (!this.setIntimacyAvailable(-amount)) {
			return false;
		}
		await this.setIntimacy(-amount);
		return true;
	}

	setIntimacyAvailable(amount: number) {
		const target = this.intimacy + amount;
		if (0 > target) {
			return false;
		} else {
			return true;
		}
	}

	private async setIntimacy(amount: number) {
		this.intimacy += amount;
		await this.save();
	}
}

export default Relation;
