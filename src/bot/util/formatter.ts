import { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } from 'discord.js';

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
	strikethrough() {
		this.message = strikethrough(this.message);
		return this;
	}
	underscore() {
		this.message = underscore(this.message);
		return this;
	}
	spoiler() {
		this.message = spoiler(this.message);
		return this;
	}
	quote() {
		this.message = quote(this.message);
		return this;
	}
	blockQuote() {
		this.message = blockQuote(this.message);
		return this;
	}
	toString() {
		return this.message;
	}
}
export default Formatter;
