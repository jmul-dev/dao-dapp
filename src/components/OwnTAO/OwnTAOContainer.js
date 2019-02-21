import { connect } from "react-redux";
import { OwnTAO } from "./OwnTAO";

const mapStateToProps = (state) => {
	return {
		taos: state.nameReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const OwnTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnTAO);
