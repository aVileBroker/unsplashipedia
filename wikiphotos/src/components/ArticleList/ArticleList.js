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

  width: ${props => props.width}px;

  padding-left: 2rem;

  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const ArticleList = ({
  data,
  activeIndex=0,
  setIndex,
  page,
  windowWidth,
}) => (
  <List width={32+(304 * data.length)} page={page}>
    {map(data, ({ id, description, links, location, isActive }, index) => (
      <ArticleCard
        key={id}
        page={page}
        windowWidth={windowWidth}
        text={description}
        linkUrl={links.html}
        wikiUrl={`https://en.wikipedia.org/wiki/${location.name}`}
        isActive={index === activeIndex}
        activeIndex={activeIndex}
        onClick={() => {setIndex(index)}}
      />
    ))}
  </List>
);