import { connect } from "react-redux";
import { LogosDetails } from "./LogosDetails";

const mapStateToProps = (state) => {
	return {
		logos: state.contractReducer.contracts.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const LogosDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LogosDetails);
