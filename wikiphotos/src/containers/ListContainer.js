import { connect } from 'react-redux';
import { ArticleList } from '../components';

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
    openIndex: state.openIndex,
    page: state.page,
    articlesPerPage: state.articlesPerPage,
    clientDimensions: state.clientDimensions,
  }
};

export const ListContainer = connect(mapStateToProps)(ArticleList);