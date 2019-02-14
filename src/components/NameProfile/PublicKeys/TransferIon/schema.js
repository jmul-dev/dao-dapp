export const schema = {
	definitions: {
		publicKeys: {
			type: "string",
			enum: []
		}
	},
	type: "object",
	required: ["from", "to", "type", "amount"],
	properties: {
		from: {
			title: "From",
			$ref: "#/definitions/publicKeys"
		},
		to: {
			title: "To",
			$ref: "#/definitions/publicKeys"
		},
		type: {
			title: "Type",
			type: "string",
			enum: ["AO", "AO+"]
		},
		amount: {
			title: "Amount",
			type: "integer"
		}
	}
};
