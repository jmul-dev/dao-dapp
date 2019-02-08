import { connect } from "react-redux";
import { Toast } from "./Toast";
import { clearToast } from "./actions";

const mapStateToProps = (state) => {
	return {
		type: state.toastReducer.type,
		headline: state.toastReducer.headline,
		message: state.toastReducer.message,
		persisted: state.toastReducer.persisted
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleClearToast: () => dispatch(clearToast())
	};
};

export const ToastContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Toast);
