import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import has from 'lodash/has';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';

import { ImageContainer } from './components/ImageContainer';
import { ArticleList } from './components/ArticleList';

import {
  setPhotos,
  goToPhoto,
  setWindowWidth,
} from './actions';

const Wrapper = styled.div`
  position: relative;
  font-family: Roboto Condensed, sans-serif;
  height: 100%;
  overflow: hidden;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.imageStore = [];
    this.wrapper = null;
    this.state = {
      interval: null,
      afkTimer: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let filteredData;

    fetch('https://api.unsplash.com/photos/random?client_id=e2b41587283713a6edaa232ae6820afe8c9a6c0b6164c123df7582b1abcb565c&count=500')
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(data => {
        filteredData = filter(data, d => { return has(d, 'location.title'); });

        forEach(filteredData, (photo, index) => {
          // preload the image
          const preload = new Image();
          preload.src = photo.urls.full;
          this.imageStore.push(preload);

          fetch(`https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&titles=${photo.location.title}&prop=revisions&rvprop=content&format=json&formatversion=2&redirects`,
            {
              method: 'POST',
              headers: new Headers( {
                  'Api-User-Agent': 'unsplashipedia/0.1 (https://vile.studio; oliver@oliverbaker.org)',
                  'Content-Type': 'application/json; charset=UTF-8',
              } )
            })
            .then(response => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            })
            .then(wikiData => {
              if(has(wikiData, 'query.pages[0].revisions[0]')) {
                filteredData[index].wikipediaDescription = wikiData.query.pages[0].revisions[0].content;
              } else { console.log(`No Wikipedia page found for ${photo.location.title}`); }
            });
          });

      dispatch(setPhotos(filteredData));
      dispatch(setWindowWidth(this.wrapper.clientWidth));
      this.resumeRotation();
    });
  }

  nextArticle = () => {
    const { dispatch, photoData = [], activeIndex = 0 } = this.props;

    dispatch(goToPhoto(activeIndex + 1 === photoData.length
      ? 0
      : activeIndex+1));
  }

  pauseRotation = () => {
    const { interval, afkTimer } = this.state;

    // stop it from rotating further
    if(interval) {
      window.clearInterval(interval);
      this.setState({ interval: null });
    }

    // restart the timer to 6 seconds
    if(afkTimer) {
      window.clearTimeout(afkTimer)
    }
    this.setState({ afkTimer: window.setTimeout(this.resumeRotation, 6000) });
  }

  resumeRotation = () => {
    this.setState({ interval: window.setInterval(this.nextArticle, 3000) });
  }

  render() {
    const { photoData, activeIndex = 0 } = this.props;

    console.log(this.props);

    return (
      <Wrapper innerRef={w => this.wrapper = w}>
        {(!!photoData && photoData.length > 0) && [
          <ImageContainer
            key="photo"
            photoData={photoData}
            activeIndex={activeIndex}
          />,
          <ArticleList
            key="list"
            photoData={photoData}
            activeIndex={activeIndex}
          />,
        ]}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
  }
};

export default connect(mapStateToProps)(App);
