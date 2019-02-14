export const schema = {
	type: "object",
	required: ["recipient", "amount"],
	properties: {
		recipient: {
			title: "Recipient",
			enum: [],
			enumNames: []
		},
		amount: {
			title: "Amount",
			type: "integer"
		}
	}
};
