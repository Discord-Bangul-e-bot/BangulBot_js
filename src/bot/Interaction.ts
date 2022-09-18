import Discord from 'discord.js';
import Cat from 'src/backend/entity/Cat';
import Channel from 'src/backend/entity/Channel';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';

class Interaction {
	cat: Cat;
	channel: Channel;
	user: User;
	relation: Relation;

	static builder(message: Discord.Message) {
		return new Promise<Interaction>(async (resolve, reject) => {
			try {
				const interaction = new Interaction();
				interaction.cat = await Cat.getOrCreateFromMessage(message);
				interaction.user = await User.getOrCreateFromMessage(message);
				interaction.channel = await Channel.getOrCreateFromMessage(message);
				interaction.relation = await Relation.getRelation({ user: interaction.user, cat: interaction.cat });
				resolve(interaction);
			} catch {
				reject();
			}
		});
	}
}

export default Interaction;
