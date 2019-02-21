import { connect } from "react-redux";
import { TAODetails } from "./TAODetails";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const TAODetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TAODetails);
