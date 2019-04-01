import { connect } from "react-redux";
import { ListThoughts } from "./ListThoughts";

const mapStateToProps = (state) => {
	return {
		names: state.globalReducer.names,
		namesSumLogos: state.globalReducer.namesSumLogos,
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ListThoughtsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListThoughts);
