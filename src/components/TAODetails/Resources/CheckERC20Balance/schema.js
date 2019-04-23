export const schema = {
	type: "object",
	required: ["erc20Address"],
	properties: {
		erc20Address: {
			title: "ERC20 Token Address",
			type: "string"
		}
	}
};
