import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import get from 'lodash/get';
import { Transition, animated } from 'react-spring';

const Image = styled(animated.div)`
  background-image: url('${props => props.background}');
  background-position: top;
  background-size: cover;

  width: 100%;
  height: calc(100% - 8rem);

  background-color: ${props => props.color || `hsl(${Math.random() * 360}, 50%, 50%)`};

  position: fixed;
  top: 0;
  left: 0;
`;

const Gradient = styled.div`
  width: 100%;
  height: 12rem;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  background-image:linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0));
`;

const Title = styled.div`
  color: white;
  font-size: 2.5rem;
  margin: 3rem;
  text-shadow: 0px .125rem .75rem rgba(0,0,0,0.25);
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ImageContainer = ({ photos, activeIndex }) => (
  <Transition
    keys={map(photos, photo => photo.id)}
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0 }}
    native
  >{ styles => (<Image key={get(photos[activeIndex], 'id')} style={styles} color={get(photos[activeIndex], 'color')} background={get(photos[activeIndex], 'urls.full', '')}>
      <Gradient />
      <Title>{get(photos[activeIndex], 'location.name')}</Title>
    </Image>)
  }</Transition>
);
