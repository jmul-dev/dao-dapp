import { connect } from "react-redux";
import { StakeEthosList } from "./StakeEthosList";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		stakeEthos: state.nameReducer.stakeEthos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const StakeEthosListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(StakeEthosList);
