import { connect } from "react-redux";
import { App } from "./App";
import { detectMobileBrowser, setNameId, setLoggedInNameCompromised, resetLoggedInNameCompromised } from "./actions";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		networkId: state.web3Reducer.networkId,
		accounts: state.web3Reducer.accounts,
		nameFactory: state.contractReducer.contracts.nameFactory,
		nameId: state.nameReducer.nameId,
		nameAccountRecovery: state.contractReducer.contracts.nameAccountRecovery,
		namesCompromised: state.globalReducer.namesCompromised
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		detectMobileBrowser: (isMobileBrowser) => dispatch(detectMobileBrowser(isMobileBrowser)),
		setNameId: (nameId) => dispatch(setNameId(nameId)),
		setLoggedInNameCompromised: (submittedTimestamp, lockedUntilTimestamp) =>
			dispatch(setLoggedInNameCompromised(submittedTimestamp, lockedUntilTimestamp)),
		resetLoggedInNameCompromised: () => dispatch(resetLoggedInNameCompromised())
	};
};

export const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
