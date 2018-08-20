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

  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const ArticleList = ({
  photoData,
  activeIndex,
  page,
  articlesPerPage,
  dispatch
}) => (
  <List>
    {map(photoData, ({ id, description, links, location, wikipediaDescription }, index) => (
      <ArticleCard
        key={id}
        index={index}
        dispatch={dispatch}
        text={wikipediaDescription || description}
        isActive={activeIndex === index}
        activeIndex={activeIndex}
        page={page}
        articlesPerPage={articlesPerPage}
        linkUrl={links.html}
        wikiUrl={`https://en.wikipedia.org/wiki/${location.name}`}
      />
    ))}
  </List>
);
