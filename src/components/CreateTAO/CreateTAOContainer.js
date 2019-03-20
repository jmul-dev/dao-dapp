import { connect } from "react-redux";
import { CreateTAO } from "./CreateTAO";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameInfo: state.nameReducer.nameInfo,
		taos: state.globalReducer.taos,
		aoSetting: state.contractReducer.contracts.aoSetting,
		settingTAOId: state.globalReducer.settingTAOId,
		taoAncestry: state.contractReducer.contracts.taoAncestry,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		nameFactory: state.contractReducer.contracts.nameFactory
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const CreateTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateTAO);
