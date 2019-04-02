import { connect } from "react-redux";
import { ViewThoughts } from "./ViewThoughts";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		taos: state.globalReducer.taos,
		taoFactory: state.contractReducer.contracts.taoFactory,
		names: state.globalReducer.names,
		namesSumLogos: state.globalReducer.namesSumLogos,
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const ViewThoughtsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewThoughts);
