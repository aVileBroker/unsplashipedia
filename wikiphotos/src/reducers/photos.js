const photos = (state = {
  photoData: [],
  activeIndex: 0,
}, action) => {
  switch ( action.type ) {
    case 'SET_WINDOW_WIDTH':
      return {
        ...state,
        windowWidth: action.windowWidth,
      }

    case 'SET_PHOTOS':
      return {
        ...state,
        photoData: action.photoData,
      };

    case 'GO_TO_PHOTO':
      return {
        ...state,
        activeIndex: action.index,
      }

    default:
      return state;
  }
}

export default photos;
