import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { setNameProfileImage as graphqlSetNameProfileImage } from "utils/graphql";

class UploadProfileImageForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.validate = this.validate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelUpload = this.cancelUpload.bind(this);
	}

	validate(formData, errors) {
		if (formData.imageFile) {
			if (Buffer.byteLength(formData.imageFile, "utf8") > 1024 * 1024) {
				errors.imageFile.addError("Exceeds allowed file size");
			}
			const imageFile = formData.imageFile.split(";");
			const isImage = imageFile[0].search(/image/i);
			if (isImage === -1) {
				errors.imageFile.addError("Invalid file type");
			}
		}
		return errors;
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { nameId } = this.props;
		if (!nameId || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		try {
			const response = await graphqlSetNameProfileImage(nameId, formData.imageFile);
			this.setState({ formLoading: false });
			if (!response.errors) {
				this.props.refreshProfileImage(formData.imageFile);
				this.props.toggleUploadProfileImageForm();
				this.props.setProfileImage(formData.imageFile);
			} else {
				this.setState({ error: true, errorMessage: response.errors[0].message });
			}
		} catch (e) {
			this.setState({ error: true, errorMessage: e.message, formLoading: false });
		}
	}

	cancelUpload() {
		this.props.toggleUploadProfileImageForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		return (
			<Wrapper>
				<SchemaForm className="full" schema={schema} showErrorList={false} validate={this.validate} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Upload"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelUpload}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { UploadProfileImageForm };
