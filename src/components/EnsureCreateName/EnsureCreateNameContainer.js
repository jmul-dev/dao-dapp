import { connect } from "react-redux";
import { EnsureCreateName } from "./EnsureCreateName";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		nameId: state.nameReducer.nameId,
		taos: state.globalReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const EnsureCreateNameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EnsureCreateName);
