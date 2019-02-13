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
			$ref: "#/definitions/publicKeys"
		},
		to: {
			$ref: "#/definitions/publicKeys"
		},
		type: {
			type: "string",
			enum: ["AO", "AO+"]
		},
		amount: {
			type: "integer"
		}
	}
};
