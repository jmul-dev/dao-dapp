import { connect } from "react-redux";
import { TopNavBar } from "./TopNavBar";
import { setNameInfo, setProfileImage, setTAOCurrencyBalances } from "./actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		nameInfo: state.nameReducer.nameInfo,
		profileImage: state.nameReducer.profileImage,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		ethos: state.contractReducer.contracts.ethos,
		pathos: state.contractReducer.contracts.pathos,
		logos: state.contractReducer.contracts.logos,
		stakedTAOs: state.globalReducer.stakedTAOs,
		namesPositionLogos: state.globalReducer.namesPositionLogos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNameInfo: (nameInfo) => dispatch(setNameInfo(nameInfo)),
		setProfileImage: (profileImage) => dispatch(setProfileImage(profileImage)),
		setTAOCurrencyBalances: (balances) => dispatch(setTAOCurrencyBalances(balances))
	};
};

export const TopNavBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TopNavBar);
