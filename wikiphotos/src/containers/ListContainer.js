import { connect } from 'react-redux';
import { ArticleList } from '../components';

import {
  setScrollOffset,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
    openIndex: state.openIndex,
    pausedOn: state.pausedOn,
    page: state.page,
    articlesPerPage: state.articlesPerPage,
    clientDimensions: state.clientDimensions,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setScrollOffset: o => dispatch(setScrollOffset(o)),
  }
};

export const ListContainer = connect(mapStateToProps, mapDispatchToProps)(ArticleList);