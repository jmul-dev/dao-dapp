import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";

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
		this.props.refreshProfileImage(formData.imageFile);
		this.props.toggleUploadProfileImageForm();
		/*
		const isKeyExist = await promisify(namePublicKey.isKeyExist)(nameId, formData.publicKey);
		if (isKeyExist) {
			this.setState({ error: true, errorMessage: "Public key already exist", formLoading: false });
			return;
		}
		namePublicKey.addKey(nameId, formData.publicKey, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.appendPublicKey(formData.publicKey);
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
		*/
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
