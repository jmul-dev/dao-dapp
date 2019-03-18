import * as React from "react";
import { Wrapper, Title, Ahref, Table, Button } from "components/";
import { UnpositionLogosFormContainer } from "./UnpositionLogosForm/";

class PositionOnOthersDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			positionLogos: null,
			showUnpositionLogosForm: false,
			targetNameId: null
		};
		this.toggleUnpositionLogosForm = this.toggleUnpositionLogosForm.bind(this);
	}

	componentDidMount() {
		const { positionLogos } = this.props;
		this.setState({ positionLogos });
	}

	componentDidUpdate(prevProps) {
		if (this.props.positionLogos !== prevProps.positionLogos) {
			this.setState({ positionLogos: this.props.positionLogos });
		}
	}

	toggleUnpositionLogosForm(nameId) {
		this.setState({ showUnpositionLogosForm: !this.state.showUnpositionLogosForm, targetNameId: nameId });
	}

	render() {
		const { positionLogos, showUnpositionLogosForm, targetNameId } = this.state;
		const { refreshPositionLogos } = this.props;
		if (!positionLogos) {
			return null;
		}

		const columns = [
			{
				Header: "ID",
				accessor: "nameId",
				Cell: (props) => <Ahref to={`/profile/${props.value}`}>{props.value}</Ahref>
			},
			{
				Header: "Name",
				accessor: "name"
			},
			{
				Header: "Logos Positioned",
				accessor: "value",
				Cell: (props) => props.value.toNumber()
			},
			{
				Header: "Action",
				accessor: "nameId",
				Cell: (props) => (
					<Button type="button" className="btn small" onClick={() => this.toggleUnpositionLogosForm(props.value)}>
						Unposition
					</Button>
				)
			}
		];

		return (
			<Wrapper className="margin-top-40">
				{!showUnpositionLogosForm ? (
					<Wrapper>
						<Title>Logos Positioned on Others Details</Title>
						<Table data={positionLogos} columns={columns} defaultPageSize={5} filterable={true} />
					</Wrapper>
				) : (
					<Wrapper>
						<Title>Unposition Logos</Title>
						<UnpositionLogosFormContainer
							toggleUnpositionLogosForm={this.toggleUnpositionLogosForm}
							targetNameId={targetNameId}
							refreshPositionLogos={refreshPositionLogos}
						/>
					</Wrapper>
				)}
			</Wrapper>
		);
	}
}

export { PositionOnOthersDetails };
