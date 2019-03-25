import { connect } from "react-redux";
import { ListenedTAO } from "./ListenedTAO";

const mapStateToProps = (state) => {
	return {
		taos: state.globalReducer.taos,
		taoPositions: state.globalReducer.taoPositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ListenedTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListenedTAO);
