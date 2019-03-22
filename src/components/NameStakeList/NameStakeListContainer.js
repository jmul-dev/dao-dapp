import { connect } from "react-redux";
import { NameStakeList } from "./NameStakeList";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		taos: state.globalReducer.taos,
		taoPool: state.contractReducer.contracts.taoPool,
		nameStakeEthos: state.nameReducer.stakeEthos,
		nameStakePathos: state.nameReducer.stakePathos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameStakeListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameStakeList);
