import { connect } from "react-redux";
import { Meet } from "./Meet";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		taoFactory: state.contractReducer.contracts.taoFactory
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const MeetContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Meet);
