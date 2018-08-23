import { connect } from 'react-redux';
import { ImageRotator } from '../components';

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
  }
};

export const ImageContainer = connect(mapStateToProps)(ImageRotator);