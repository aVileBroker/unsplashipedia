import { connect } from 'react-redux';
import { ArticleCard } from '../components';

import { closeDetails, expandDetails, pauseOn } from '../actions';

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
    openIndex: state.openIndex,
    page: state.page,
    articlesPerPage: state.articlesPerPage,
    clientDimensions: state.clientDimensions,
    scrollOffset: state.scrollOffset,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    closeDetails: () => dispatch(closeDetails()),
    expandDetails: i => dispatch(expandDetails(i)),
    pauseOn: i => dispatch(pauseOn(i)),
  }
};

export const CardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArticleCard);