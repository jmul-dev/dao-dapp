import { connect } from "react-redux";
import { SpokenTAO } from "./SpokenTAO";

const mapStateToProps = (state) => {
	return {
		taos: state.globalReducer.taos,
		taoPositions: state.globalReducer.taoPositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const SpokenTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SpokenTAO);
