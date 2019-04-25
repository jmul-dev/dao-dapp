import { connect } from "react-redux";
import { RequireActions } from "./RequireActions";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		names: state.globalReducer.names,
		taos: state.globalReducer.taos,
		challengedTAOAdvocates: state.nameReducer.challengedTAOAdvocates
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const RequireActionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RequireActions);
