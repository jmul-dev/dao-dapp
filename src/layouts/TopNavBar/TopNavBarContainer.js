import { connect } from "react-redux";
import { TopNavBar } from "./TopNavBar";
import { setNameInfo, setTAOCurrencyBalances } from "./actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.taoReducer.nameId,
		nameInfo: state.taoReducer.nameInfo,
		taoCurrencyBalances: state.taoReducer.taoCurrencyBalances,
		nameTAOLookup: state.contractReducer.nameTAOLookup,
		ethos: state.contractReducer.ethos,
		pathos: state.contractReducer.pathos,
		logos: state.contractReducer.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNameInfo: (nameInfo) => dispatch(setNameInfo(nameInfo)),
		setTAOCurrencyBalances: (balances) => dispatch(setTAOCurrencyBalances(balances))
	};
};

export const TopNavBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TopNavBar);
