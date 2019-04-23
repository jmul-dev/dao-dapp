export const schema = {
	type: "object",
	required: ["recipient"],
	properties: {
		recipient: {
			title: "Recipient Address",
			type: "string"
		},
		resourceType: {
			title: "Type",
			type: "string",
			enum: ["ETH", "AO", "AO+", "ERC20"],
			default: "ETH"
		}
	},
	dependencies: {
		resourceType: {
			oneOf: [
				{
					properties: {
						resourceType: {
							title: "Type",
							type: "string",
							enum: ["ETH"]
						},
						amount: {
							title: "Amount (in Wei)",
							type: "integer"
						}
					},
					required: ["amount"]
				},
				{
					properties: {
						resourceType: {
							title: "Type",
							type: "string",
							enum: ["AO"]
						},
						amount: {
							title: "Amount",
							type: "integer"
						}
					},
					required: ["amount"]
				},
				{
					properties: {
						resourceType: {
							title: "Type",
							type: "string",
							enum: ["AO+"]
						},
						amount: {
							title: "Amount",
							type: "integer"
						}
					},
					required: ["amount"]
				},
				{
					properties: {
						resourceType: {
							title: "Type",
							type: "string",
							enum: ["ERC20"]
						},
						erc20Address: {
							title: "ERC20 Token Address",
							type: "string"
						},
						amount: {
							title: "Amount",
							type: "integer"
						}
					},
					required: ["erc20Address", "amount"]
				}
			]
		}
	}
};
