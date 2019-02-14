export const schema = {
	type: "object",
	required: ["publicKey"],
	properties: {
		publicKey: {
			type: "string",
			title: "New Public Key"
		}
	}
};
