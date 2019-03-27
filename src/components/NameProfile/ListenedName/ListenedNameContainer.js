import { connect } from "react-redux";
import { ListenedName } from "./ListenedName";

const mapStateToProps = (state) => {
	return {
		names: state.globalReducer.names,
		namePositions: state.globalReducer.namePositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ListenedNameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListenedName);
