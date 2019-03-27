import { connect } from "react-redux";
import { SpokenName } from "./SpokenName";

const mapStateToProps = (state) => {
	return {
		names: state.globalReducer.names,
		namePositions: state.globalReducer.namePositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const SpokenNameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SpokenName);
