export const schema = {
	type: "object",
	required: ["amount"],
	properties: {
		amount: {
			title: "Stake Ethos Amount",
			type: "integer",
			minimum: 1
		}
	}
};
