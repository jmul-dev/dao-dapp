import { connect } from "react-redux";
import { EnsureCreateName } from "./EnsureCreateName";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		taos: state.taoReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const EnsureCreateNameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EnsureCreateName);
