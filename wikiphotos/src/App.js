import React, { Component } from 'react';
import { ArticleList, ImageContainer } from './components/';
import styled from 'styled-components';

import has from 'lodash/has';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';

const Wrapper = styled.div`
  position: relative;
  font-family: Roboto Condensed, sans-serif;
  height: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.imageStore = [];
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
      const filteredData = filter(data, d => { return has(d, 'location'); });

      this.setState({ photoData: filteredData });

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
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(data => {
          if(has(data, 'query.pages[0].revisions[0]')) {
            this.setState((state) => {
              let newPhotoData = state.photoData;
              newPhotoData[index].wikipediaDescription = data.query.pages[0].revisions[0].content;
              return { photoData: newPhotoData };
            });
          }
        });
      });

      console.log(this.state.photoData, this.imageStore);

      this.resumeRotation();
    });
  }

  prevArticle = () => {
    this.setState((state) => {
      return {
        activeIndex: state.activeIndex - 1 === 0
          ? state.photoData.length - 1
          : state.activeIndex - 1,
      }
    });
  }

  nextArticle = () => {
    this.setState((state) => {
      return {
        activeIndex: state.activeIndex + 1 === state.photoData.length
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
    const { activeIndex, photoData } = this.state;

    return !!photoData ? (
      <Wrapper>
        <ImageContainer
          photos={photoData}
          activeIndex={activeIndex}
        />
        <ArticleList
          setIndex={this.setIndex}
          activeIndex={activeIndex}
          data={photoData}
        />
      </Wrapper>
    ) : (<Wrapper />);
  }
}

export default App;
