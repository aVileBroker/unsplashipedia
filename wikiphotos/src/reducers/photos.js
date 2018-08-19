import map from 'lodash/map';

const photos = (state = {
  photoData: [],
  activeIndex: 0
}, action) => {
  switch ( action.type ) {
    case 'SET_WINDOW_WIDTH':
      return {
        ...state,
        windowWidth: action.windowWidth,
      }

    case 'ADD_PHOTO':
      return {
        ...state,
        photoData: [
          ...state.photoData,
          action.photoData,
        ],
      };

    case 'ADD_WIKI_ENTRY':
      return {
        ...state,
        photoData: map(state.photoData, (photo, i) => {
          return action.index === i
            ? { ...photo, wikipediaDescription: action.entry }
            : photo;
        }),
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