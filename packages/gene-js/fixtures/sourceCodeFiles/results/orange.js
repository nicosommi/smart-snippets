/* ph replacements */
/* className, /Orange/g, Orange */
/* endph */
/* ph stamps */
/* /^.*$/ */
/* endph */

/* stamp withSeedsSymbol */
const generateSeeds = Symbol("generateSeeds");
/* endstamp */


export default class Orange {
	constructor() {
		/* ph constructor */
		this[generateSeeds](4, 6);
		/* endph */
	}

	/* stamp withSeeds */
	[generateSeeds](min, max) {
		this.seeds = Math.floor((Math.random() * ((max + 1) - min + 1)) + min);
	}
	/* endstamp */

	eat() {
		/* ph onomatopoeia */
		return "yum";
		/* endph */
	}

	/* stamp throwAway */
	throwAway() {
		return "done";
	}
	/* endstamp */
}
