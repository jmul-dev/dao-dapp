import { connect } from "react-redux";
import { Attention } from "./Attention";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		names: state.globalReducer.names,
		taos: state.globalReducer.taos,
		challengeTAOAdvocates: state.globalReducer.challengeTAOAdvocates,
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const AttentionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Attention);
