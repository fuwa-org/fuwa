class BitField {
	constructor(bits) {
		this.bitfield = bits;
	}
	has(bit) {
		// @ts-ignore
		bit = this.constructor.FLAGS[bit] ?? bit;
		return (this.bitfield & bit) === bit;
	}
}

BitField.FLAGS = {};

module.exports = BitField;
