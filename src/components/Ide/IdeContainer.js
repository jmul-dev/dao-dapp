import { connect } from "react-redux";
import { Ide } from "./Ide";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		taoFactory: state.contractReducer.contracts.taoFactory
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const IdeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Ide);
