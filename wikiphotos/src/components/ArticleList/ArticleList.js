import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';

import { ArticleCard } from '../ArticleCard';

const List = styled.div`
  background-color: #ddd;
  height: 8rem;

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
`;

export const ArticleList = ({
  photoData,
  activeIndex,
  openIndex,
  page,
  windowWidth,
  articlesPerPage,
  dispatch
}) => (
  <List>
    {map(photoData, ({ id, description, links, location, wikipediaDescription, user }, index) => (
      <ArticleCard
        key={id}
        index={index}
        dispatch={dispatch}
        title={location.title}
        text={wikipediaDescription || description}
        isActive={activeIndex === index}
        isOpen={openIndex === index}
        openIndex={openIndex}
        activeIndex={activeIndex}
        page={page}
        windowWidth={windowWidth}

        articlesPerPage={articlesPerPage}
        linkUrl={links.html}
        wikiUrl={`https://en.wikipedia.org/wiki/${location.name}`}
        photogAvatar={user.profile_image.medium}
        photogName={user.name}
        photogLink={user.links.html}
      />
    ))}
  </List>
);
