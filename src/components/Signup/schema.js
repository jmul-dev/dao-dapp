export const schema = {
	type: "object",
	required: ["username"],
	properties: {
		username: {
			type: "string",
			title: "Please choose a username before you can continue and use this Dapp"
		}
	}
};
