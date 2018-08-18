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

  padding-left: 2rem;

  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const ArticleList = ({
  data,
  activeIndex=0,
  setIndex,
}) => (
  <List>
    {map(data, ({ id, description, links, isActive }, index) => (
      <ArticleCard
        key={id}
        text={description}
        linkUrl={links.html}
        isActive={index === activeIndex}
        onClick={() => {setIndex(index)}}
      />
    ))}
  </List>
);