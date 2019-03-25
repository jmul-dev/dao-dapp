import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { SetAdvocateFormContainer } from "./SetAdvocateForm/";

class PositionDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showSetAdvocateForm: false,
			showSetListenerForm: false,
			showSetSpeakerForm: false
		};
		this.toggleShowForm = this.toggleShowForm.bind(this);
		this.showSetAdvocateForm = this.showSetAdvocateForm.bind(this);
		this.showSetListenerForm = this.showSetListenerForm.bind(this);
		this.showSetSpeakerForm = this.showSetSpeakerForm.bind(this);
	}

	toggleShowForm() {
		this.setState({ showForm: !this.state.showForm });
		if (!this.state.showForm) {
			this.setState({ showSetAdvocateForm: false, showSetListenerForm: false, showSetSpeakerForm: false });
		}
	}

	showSetAdvocateForm() {
		this.setState({ showForm: true, showSetAdvocateForm: true, showSetListenerForm: false, showSetSpeakerForm: false });
	}

	showSetListenerForm() {
		this.setState({ showForm: true, showSetAdvocateForm: false, showSetListenerForm: true, showSetSpeakerForm: false });
	}

	showSetSpeakerForm() {
		this.setState({ showForm: true, showSetAdvocateForm: false, showSetListenerForm: false, showSetSpeakerForm: true });
	}

	render() {
		const { id, nameId, position, getTAOPosition } = this.props;
		const { showForm, showSetAdvocateForm, showSetListenerForm, showSetSpeakerForm } = this.state;
		if (!id || !nameId || !position) {
			return null;
		}

		if (!showForm) {
			return (
				<Wrapper>
					<Title className="margin-top">Position</Title>
					<FieldContainer>
						<FieldName className="small">Advocate</FieldName>
						<FieldValue className="small">
							<Ahref to={position.advocate.isTAO ? `/tao/${position.advocate.id}` : `/profile/${position.advocate.id}`}>
								{position.advocate.name} ({position.advocate.id})
							</Ahref>
						</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName className="small">Listener</FieldName>
						<FieldValue className="small">
							<Ahref to={position.listener.isTAO ? `/tao/${position.listener.id}` : `/profile/${position.listener.id}`}>
								{position.listener.name} ({position.listener.id})
							</Ahref>
						</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName className="small">Speaker</FieldName>
						<FieldValue className="small">
							<Ahref to={position.speaker.isTAO ? `/tao/${position.speaker.id}` : `/profile/${position.speaker.id}`}>
								{position.speaker.name} ({position.speaker.id})
							</Ahref>
						</FieldValue>
					</FieldContainer>
					{nameId === position.advocate.id && (
						<Wrapper>
							<Icon className="animated bounceIn" onClick={this.showSetAdvocateForm}>
								<img src={process.env.PUBLIC_URL + "/images/advocate.png"} alt={"Set New Advocate"} />
								<div>Set New Advocate</div>
							</Icon>
							<Icon className="animated bounceIn" onClick={this.showSetListenerForm}>
								<img src={process.env.PUBLIC_URL + "/images/listener.png"} alt={"Set New Listener"} />
								<div>Set New Listener</div>
							</Icon>
							<Icon className="animated bounceIn" onClick={this.showSetSpeakerForm}>
								<img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt={"Set New Speaker"} />
								<div>Set New Speaker</div>
							</Icon>
						</Wrapper>
					)}
				</Wrapper>
			);
		} else {
			if (showSetAdvocateForm) {
				return (
					<Wrapper>
						<Title className="margin-top">Set New Advocate</Title>
						<SetAdvocateFormContainer id={id} toggleShowForm={this.toggleShowForm} getTAOPosition={getTAOPosition} />
					</Wrapper>
				);
			} else if (showSetListenerForm) {
				return (
					<Wrapper>
						<Title className="margin-top">Set New Listener</Title>
					</Wrapper>
				);
			} else if (showSetSpeakerForm) {
				return (
					<Wrapper>
						<Title className="margin-top">Set New Speaker</Title>
					</Wrapper>
				);
			}
		}
	}
}

export { PositionDetails };
