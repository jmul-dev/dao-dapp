export const schema = {
	type: "object",
	required: ["publicKey", "privateKey"],
	properties: {
		publicKey: {
			type: "string",
			title: "New Public Key"
		},
		privateKey: {
			type: "string",
			title: "Associated Private Key"
		}
	}
};
