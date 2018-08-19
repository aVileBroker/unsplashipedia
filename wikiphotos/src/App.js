import React, { Component } from 'react';
import { ArticleList, ImageContainer } from './components/';
import styled from 'styled-components';
import { connect } from 'react-redux';

import has from 'lodash/has';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';

import {
  addPhoto,
  addWikiEntry,
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
    const { dispatch, photoData } = this.props;

    fetch('https://api.unsplash.com/photos/random?client_id=e2b41587283713a6edaa232ae6820afe8c9a6c0b6164c123df7582b1abcb565c&count=500')
    .then(response => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      const filteredData = filter(data, d => { return has(d, 'location.title'); });

      forEach(filteredData, (photo, index) => {
        // preload the image
        const preload = new Image();
        preload.src = photo.urls.full;
        this.imageStore.push(preload);
        dispatch(addPhoto(photo));

        fetch(`https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&titles=${photo.location.name}&prop=revisions&rvprop=content&format=json&formatversion=2&redirects`,
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
        .then(data => {
          if(has(data, 'query.pages[0].revisions[0]')) {
            dispatch(addWikiEntry(data.query.pages[0].revisions[0].content, index));
          }
        });
      });

      this.resumeRotation();
    });
  }

  nextArticle = () => {
    const { dispatch, photoData = [], activeIndex } = this.props;

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
    this.setState({ interval: window.setInterval(this.nextArticle, 3000)});
  }

  setIndex = (newIndex) => {
    this.pauseRotation();
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { dispatch, activeIndex, photoData } = this.props;

    if(photoData.length > 0) {
      dispatch(setWindowWidth(
        Math.floor((( (activeIndex + 1) * 304 ) + 32) / this.wrapper.clientWidth)
      ));
    }

    return (
      <Wrapper innerRef={w => this.wrapper = w}>
        {!!photoData && [
          <ImageContainer
            key="photo"
          />,
          <ArticleList
            key="list"
          />,
        ]}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  return {
    photoData: state.photos.photoData,
    activeIndex: state.photos.activeIndex,
  }
};

export default connect(mapStateToProps)(App);
