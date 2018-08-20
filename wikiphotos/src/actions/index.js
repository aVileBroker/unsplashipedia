export const initState = photoData => ({
  type: 'INIT_STATE',
});

export const setClientDimensions = clientDimensions => ({
  type: 'SET_CLIENT_DIMENSIONS',
  clientDimensions,
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

export const expandDetails = index => ({
  type: 'EXPAND_DETAILS',
  index,
});

export const closeDetails = () => ({
  type: 'CLOSE_DETAILS',
});

export const goToPhoto = index => ({
  type: 'GO_TO_PHOTO',
  index,
});
