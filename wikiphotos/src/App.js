import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import wtf from 'wtf_wikipedia';

import has from 'lodash/has';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';

import { ImageContainer } from './components/ImageContainer';
import { ArticleList } from './components/ArticleList';

import {
  initState,
  setPhotos,
  goToPhoto,
  setWindowWidth,
  resume,
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

    window.onresize = () => props.dispatch(setWindowWidth(this.wrapper.clientWidth));
    props.dispatch(initState());

    this.state = {
      interval: null,
      readingTimer: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let filteredData;

    fetch('https://api.unsplash.com/photos/random?client_id=e2b41587283713a6edaa232ae6820afe8c9a6c0b6164c123df7582b1abcb565c&count=500')
      .then(response => {
        if (response.status >= 400) {
          throw new Error(`Unsplash Server ${response.status} Error`);
        }
        return response.json();
      })
      .then(data => {
        filteredData = filter(data, d => { return has(d, 'location.name'); });

        dispatch(setPhotos(filteredData));

        forEach(filteredData, (photo, index) => {
          // preload the image
          const preload = new Image();
          preload.src = photo.urls.full;
          this.imageStore.push(preload);

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
                throw new Error(`Wikipedia Server ${response.status} Error`);
              }
              return response.json();
            })
            .then(wikiData => {
              if(has(wikiData, 'query.pages[0].revisions[0].content')) {
                const text = wtf(wikiData.query.pages[0].revisions[0].content).text();
                filteredData[index].wikipediaDescription = text.substring(0, 500).includes('may refer to') ? undefined : text;

                dispatch(setPhotos(filteredData));
              } else { console.log(`No Wikipedia page found for ${photo.location.name}`); }
            });
          });

      dispatch(setWindowWidth(this.wrapper.clientWidth));
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.pausedOn !== prevProps.pausedOn) {
      this.pauseRotation();
    }
  }

  nextArticle = () => {
    const { dispatch, photoData = [], activeIndex = -1 } = this.props;

    dispatch(goToPhoto(activeIndex + 1 === photoData.length
      ? 0
      : activeIndex+1));
  }

  pauseRotation = () => {
    const { interval, readingTimer } = this.state;

    // stop it from rotating further
    if(interval) {
      window.clearInterval(interval);
      this.setState({ interval: null });
    }

    // restart the timer to 6 seconds
    if(readingTimer) {
      window.clearTimeout(readingTimer)
    }
    this.setState({ readingTimer: window.setTimeout(this.resumeRotation, 6000) });
  }

  resumeRotation = () => {
    const { dispatch } = this.props;
    dispatch(resume());
    this.setState({ interval: window.setInterval(this.nextArticle, 6000) });
  }

  render() {
    const {
      photoData,
      activeIndex = 0,
      page = 0,
      articlesPerPage = 0,
      dispatch,
    } = this.props;

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
            dispatch={dispatch}
            page={page}
            articlesPerPage={articlesPerPage}
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
    pausedOn: state.pausedOn,
    page: state.page,
    articlesPerPage: state.articlesPerPage,
  }
};

export default connect(mapStateToProps)(App);
