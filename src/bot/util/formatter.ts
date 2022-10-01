import {
	bold,
	italic,
	strikethrough,
	underscore,
	spoiler,
	quote,
	blockQuote,
	channelMention,
	roleMention,
	userMention,
} from 'discord.js';

class Formatter {
	message: string;
	constructor(message: string) {
		this.message = message;
	}
	bold() {
		this.message = bold(this.message);
		return this;
	}
	italic() {
		this.message = italic(this.message);
		return this;
	}
	toString() {
		return this.message;
	}
}
export default Formatter;
