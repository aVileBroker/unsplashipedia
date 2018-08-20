export const initState = photoData => ({
  type: 'INIT_STATE',
});

export const setWindowWidth = windowWidth => ({
  type: 'SET_WINDOW_WIDTH',
  windowWidth,
});

export const setPhotos = photoData => ({
  type: 'SET_PHOTOS',
  photoData,
});

export const pauseOn = index => ({
  type: 'PAUSE_ON',
  index,
});

export const resume = () => ({
  type: 'RESUME',
});

export const goToPhoto = (index, source) => ({
  type: 'GO_TO_PHOTO',
  index,
  source,
});