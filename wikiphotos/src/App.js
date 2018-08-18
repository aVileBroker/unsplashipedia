import React, { Component } from 'react';
import { ArticleList, ImageContainer } from './components/';
import styled from 'styled-components';
import filter from 'lodash/filter';
import has from 'lodash/has';

const Wrapper = styled.div`
  position: relative;
  font-family: Roboto Condensed, sans-serif;
  height: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      interval: null,
      afkTimer: null,
    };
  }

  componentDidMount() {
    fetch('https://api.unsplash.com/photos/random?client_id=e2b41587283713a6edaa232ae6820afe8c9a6c0b6164c123df7582b1abcb565c&collections=1599706&count=10')
    .then(response => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      const locationEnabledPhotos = filter(data, photo => {
        return has(photo, 'location');
      });

      this.setState({ photos: locationEnabledPhotos });

      console.log(locationEnabledPhotos);
      this.resumeRotation();
    });
  }

  prevArticle = () => {
    this.setState((state) => {
      return {
        activeIndex: state.activeIndex - 1 === 0
          ? state.photos.length - 1
          : state.activeIndex - 1,
      }
    });
  }

  nextArticle = () => {
    this.setState((state) => {
      return {
        activeIndex: state.activeIndex + 1 === state.photos.length
          ? 0
          : state.activeIndex+1,
      }
    });
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
    const { activeIndex, photos } = this.state;

    return !!photos ? (
      <Wrapper>
        <ImageContainer
          photos={photos}
          activeIndex={activeIndex}
        />
        <ArticleList
          setIndex={this.setIndex}
          activeIndex={activeIndex}
          data={photos}
        />
      </Wrapper>
    ) : (<Wrapper />);
  }
}

export default App;
