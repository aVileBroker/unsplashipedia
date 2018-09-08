const rootReducer = (state, action) => {
  switch ( action.type ) {
    case 'SET_CLIENT_DIMENSIONS':
      const articlesPerPage =  Math.floor((action.clientDimensions.width - 48) / 385);

      return {
        ...state,
        clientDimensions: action.clientDimensions || state.clientDimensions,
        articlesPerPage,
        page: Math.floor(state.activeIndex / articlesPerPage) || 0,
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
        page: Math.floor(action.index / state.articlesPerPage),
        openIndex: null,
      }

    case 'EXPAND_DETAILS':
      return {
        ...state,
        openIndex: action.index,
      }

    case 'CLOSE_DETAILS':
      return {
        ...state,
        openIndex: null,
      }

    case 'RESUME':
      return {
        ...state,
        pausedOn: null,
      }

    case 'PAUSE_ON':
      const pauseIndex = state.pausedOn === action.index ? null : action.index;

      return {
        ...state,
        pausedOn: pauseIndex,
        browsing: false,
        activeIndex: action.index,
        openIndex: null,
        page: Math.floor(action.index / state.articlesPerPage),
      }

    case 'SET_BROWSE':
      return {
        ...state,
        browsing: action.browsing,
      }

    case 'OFFSET_SCROLL':

      const newScroll = state.scrollY + action.scroll >= Math.floor(state.photoData.length / state.articlesPerPage) * -164 + (state.clientDimensions.height / 2)
        ? Math.min(0, state.scrollY + action.scroll)
        : state.scrollY;

      return {
        ...state,
        scrollY: newScroll,
      }

    default:
      return state;
  }
}

export default rootReducer;
