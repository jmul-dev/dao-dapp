export const schema = {
	type: "object",
	required: ["imageFile"],
	properties: {
		imageFile: {
			type: "string",
			format: "data-url",
			title: "Image File (Max Size: 1MB)"
		}
	}
};
