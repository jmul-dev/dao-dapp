export const schema = {
	type: "object",
	required: ["amount"],
	properties: {
		amount: {
			title: "Amount",
			type: "integer",
			minimum: 1
		}
	}
};
