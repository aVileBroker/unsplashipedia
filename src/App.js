import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import wtf from 'wtf_wikipedia';

import get from 'lodash/get';
import has from 'lodash/has';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import debounce from 'lodash/debounce';

import { ArticleList, ImageRotator } from './components';

import {
  setPhotos,
  goToPhoto,
  setClientDimensions,
  resume,
  pauseOn,
  setBrowse,
} from './actions';

const Wrapper = styled.div`
  position: relative;
  font-family: Roboto Condensed, sans-serif;
  height: 100%;
  overflow: hidden;
`;

const BrowseButton = styled.div`
  background-image: url('images/view-module.svg'); // icon by Google
  background-position: center;
  background-size: 2rem;
  background-repeat: no-repeat;

  position: absolute;
  top: 2rem;
  left: 2rem;

  cursor: pointer;

  width: 3rem;
  height: 3rem;
  border-radius: 50%;

  &:hover{ background-color: rgba(0, 0, 0, 0.2); }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.imageStore = [];
    this.wrapper = null;

    window.onblur = () => {
      props.pauseOn(this.props.activeIndex || 0);
      this.pauseRotation();
    }

    window.onfocus = () => {
      props.pauseOn(this.props.activeIndex || 0);
      this.setState({ readingTimer: window.setTimeout(() => props.resume(), 0) });
    }

    window.onresize = debounce(() => props.setClientDimensions({
      width: get(this.wrapper, 'clientWidth', this.props.clientDimensions.width),
      height: get(this.wrapper, 'clientHeight', this.props.clientDimensions.height),
    }), 200);

    this.state = {
      interval: null,
      readingTimer: null,
    };
  }

  componentDidMount() {
    const { setPhotos, setClientDimensions } = this.props;
    let filteredData;

    fetch('https://api.unsplash.com/photos/random?client_id=e2b41587283713a6edaa232ae6820afe8c9a6c0b6164c123df7582b1abcb565c&count=500')
      .then(response => {
        if (response.status >= 400) {
          console.log(`Unsplash Server ${response.status} Error`);
          return null;
        }
        return response.json();
      })
      .then(data => {
        filteredData = filter(data, d => { return has(d, 'location.name'); });

        setPhotos(filteredData);

        forEach(filteredData, (photo, index) => {
          // preload the image
          const preload = new Image();
          preload.src = photo.urls.full;
          this.imageStore.push(preload);

          fetch(`https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&titles=${photo.location.name}&prop=revisions&rvprop=content&format=json&formatversion=2&redirects`,
            {
              method: 'POST',
              headers: new Headers( {
                  'Api-User-Agent': 'unsplashipedia/0.2 (vile@vile.studio)',
                  'Content-Type': 'application/json; charset=UTF-8',
              } )
            })
            .then(response => {
              if (response.status >= 400) {
                console.log(`Wikipedia Server ${response.status} Error`);
                return null;
              }
              return response.json();
            })
            .then(wikiData => {
              if(has(wikiData, 'query.pages[0].revisions[0].content')) {
                const text = wtf(wikiData.query.pages[0].revisions[0].content).text();
                filteredData[index].wikipediaDescription = text.substring(0, 500).includes('may refer to') ? undefined : text.substring(0, 1000)+'...';

                setPhotos(filteredData);
              } else { console.log(`No Wikipedia page found for ${photo.location.name}`); }
            });
          });
      setClientDimensions({
        width: this.wrapper.clientWidth,
        height: this.wrapper.clientHeight,
      });
    });
    this.resumeRotation();
  }

  componentDidUpdate(prevProps) {
    const { pausedOn, resume, openIndex } = this.props;

    if(pausedOn !== prevProps.pausedOn) {
      if(pausedOn !== null) {

        this.pauseRotation();
        this.setState({ readingTimer: window.setTimeout(() => resume(), 10000) });

      } else {
        this.resumeRotation();
      }
    }

    if(openIndex !== prevProps.openIndex) {
      if( openIndex !== null ) {
        this.pauseRotation();
      }
    }
  }

  nextArticle = () => {
    const { goToPhoto, photoData = [], activeIndex = -1 } = this.props;

    goToPhoto(activeIndex + 1 === photoData.length
      ? 0
      : activeIndex+1);
  }

  pauseRotation = () => {
    const { interval, readingTimer } = this.state;

    // stop it from rotating further
    if(interval) {
      window.clearInterval(interval);
      this.setState({ interval: null });
    }

    // restart the timer to 10 seconds
    if(readingTimer) {
      window.clearTimeout(readingTimer)
    }
  }

  resumeRotation = () => {
    this.setState({ interval: window.setInterval(this.nextArticle, 6000) });
  }

  render() {
    const { photoData, setBrowse, browsing } = this.props;

    return (
      <Wrapper innerRef={w => this.wrapper = w}>
        {(!!photoData && photoData.length > 0) && [
          <ImageRotator key="photo" />,
          <ArticleList key="list" />,
          <BrowseButton onClick={() => setBrowse(!browsing)} />,
        ]}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    photoData: state.photoData,
    openIndex: state.openIndex,
    activeIndex: state.activeIndex,
    pausedOn: state.pausedOn,
    clientDimensions: state.clientDimensions,
    browsing: state.browsing,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setPhotos: p => dispatch(setPhotos(p)),
    goToPhoto: i => dispatch(goToPhoto(i)),
    setClientDimensions: (d) => dispatch(setClientDimensions(d)),
    resume: () => dispatch(resume()),
    pauseOn: i => dispatch(pauseOn(i)),
    setBrowse: b => dispatch(setBrowse(b)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
