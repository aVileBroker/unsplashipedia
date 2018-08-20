export const setPhotos = photoData => ({
  type: 'SET_PHOTOS',
  photoData,
});

export const setWindowWidth = windowWidth => ({
  type: 'SET_WINDOW_WIDTH',
  windowWidth,
});

export const goToPhoto = index => ({
  type: 'GO_TO_PHOTO',
  index,
});