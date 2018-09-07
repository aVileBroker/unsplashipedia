import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import map from 'lodash/map';

import { ArticleCard } from '../../components';

const List = styled.div`
  background-color: #ddd;
  height: 8rem;

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
`;

const ArticleListBase = ({
  photoData,
  activeIndex,
  openIndex,
  pausedOn,
  page,
  clientDimensions,
  articlesPerPage,
}) => (
  <List>
    {map(photoData, ({ id, description, links, location, wikipediaDescription, user }, index) => (
      <ArticleCard
        index={index}

        isActive={activeIndex === index}
        isOpen={openIndex === index}
        isPaused={pausedOn === index}
        hidden={
          (page + 1) * articlesPerPage < index ||
          (page - 1) * articlesPerPage > index
        }

        key={id}
        text={wikipediaDescription || description || 'Loading description from Wikipedia...'}
        title={location.title}
        linkUrl={links.html}
        wikiUrl={`https://en.wikipedia.org/wiki/${location.name}`}
        photogAvatar={user.profile_image.medium}
        photogName={user.name}
        photogLink={user.links.html}
      />
    ))}
  </List>
);

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
    openIndex: state.openIndex,
    pausedOn: state.pausedOn,
    page: state.page,
    articlesPerPage: state.articlesPerPage,
    clientDimensions: state.clientDimensions,
  }
};

export const ArticleList = connect(mapStateToProps)(ArticleListBase)
