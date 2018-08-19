export const addPhoto = photoData => ({
  type: 'ADD_PHOTO',
  photoData,
});

export const addWikiEntry = (photoData, index) => ({
  type: 'ADD_WIKI_ENTRY',
  photoData,
  index,
});

export const setWindowWidth = windowWidth => ({
  type: 'SET_WINDOW_WIDTH',
  windowWidth,
});

export const goToPhoto = index => ({
  type: 'GO_TO_PHOTO',
  index,
});