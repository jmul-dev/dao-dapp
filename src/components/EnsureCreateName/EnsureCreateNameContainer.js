import { connect } from "react-redux";
import { EnsureCreateName } from "./EnsureCreateName";

const mapStateToProps = (state) => {
	return {
		nameId: state.taoReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const EnsureCreateNameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EnsureCreateName);
