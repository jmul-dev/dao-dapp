import { connect } from "react-redux";
import { LogosDetails } from "./LogosDetails";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		logos: state.contractReducer.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const LogosDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LogosDetails);
