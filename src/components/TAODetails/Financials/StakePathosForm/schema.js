export const schema = {
	type: "object",
	required: ["amount"],
	properties: {
		amount: {
			title: "Stake Pathos Amount",
			type: "integer",
			minimum: 1
		}
	}
};
