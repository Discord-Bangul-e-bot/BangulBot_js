import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';
import Cat from 'src/backend/entity/Cat';
import UserRepository from 'src/backend/repository/UserRepository';
import CatRepository from 'src/backend/repository//CatRepository';

@RepositoryDecorator<Relation>()
class RelationRepository extends BaseRepository<Relation> {
	model: Relation;

	constructor(model: Relation) {
		super(model);
	}
	static getOrCreate(args: { user: User; cat: Cat }) {
		return new Promise<Relation>((resolve, reject) => {
			const findargs = {
				cat: { id: args.cat.id },
				user: { id: args.user.id },
			};
			console.log(findargs);
			Relation.findOneByOrFail(findargs)
				.then(resolve)
				.catch(async (e) => {
					console.log(e);
					console.log('relation create!');
					console.table(args);
					const instance = RelationRepository.createDefault({ cat: args.cat, user: args.user });
					console.log('instance create!');
					await instance.save();
					resolve(instance);
				});
		});
	}
	static getOrCreateFromMessage(message: MessageBase) {
		return new Promise<Relation>(async (resolve, reject) => {
			const user = await UserRepository.getOrCreateFromMessage(message);
			const cat = await CatRepository.getOrCreateFromMessage(message);
			RelationRepository.getOrCreate({ user, cat }).then(resolve).catch(reject);
		});
	}

	private static createDefault({ cat, user }: { cat: Cat; user: User }) {
		const instance = new Relation();
		instance.user = user;
		instance.cat = cat;
		instance.intimacy = 0;
		instance.name = 'relation';
		return instance;
	}
}

export default RelationRepository;
