export const schema = {
	type: "object",
	required: ["username"],
	properties: {
		username: {
			type: "string",
			title: "Please choose a username before you can continue and use this Dapp",
			pattern: "^[a-zA-Z0-9_-]{3,20}$",
			minLength: 3,
			maxLength: 20
		}
	}
};
