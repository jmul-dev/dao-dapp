export const schema = {
	type: "object",
	required: ["taoName", "childMinLogos"],
	properties: {
		taoName: {
			title: "Describe the name for this TAO",
			type: "string",
			minLength: 5,
			maxLength: 50
		},
		childMinLogos: {
			title: "What is the minimum required Logos for creating a child TAO of this?",
			type: "integer"
		},
		ethosCapStatus: {
			title: "Is there an Ethos cap for this TAO?",
			type: "string",
			enum: ["No", "Yes"],
			default: "No"
		}
	},
	dependencies: {
		ethosCapStatus: {
			oneOf: [
				{
					properties: {
						ethosCapStatus: {
							title: "Is there an Ethos cap for this TAO?",
							type: "string",
							enum: ["No"]
						}
					}
				},
				{
					properties: {
						ethosCapStatus: {
							title: "Is there an Ethos cap for this TAO?",
							type: "string",
							enum: ["Yes"]
						},
						ethosCapAmount: {
							title: "What is the Ethos cap amount?",
							type: "integer"
						}
					},
					required: ["ethosCapAmount"]
				}
			]
		}
	}
};
