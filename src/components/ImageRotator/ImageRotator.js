import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import get from 'lodash/get';
import { Spring, animated } from 'react-spring';
import { TimingAnimation, Easing } from 'react-spring/dist/addons';

const Image = styled(animated.div)`
  background-image: url('${props => props.background}');
  background-position: center;
  background-size: cover;

  width: 100%;
  height: calc(100% - 8rem);

  background-color: ${props => props.color || `hsl(${Math.random() * 360}, 50%, 50%)`};

  display: ${props => props.hidden ? 'none' : 'block'};

  position: fixed;
  top: 0;
  left: 0;
`;

const Title = styled.div`
  color: white;
  font-size: 2.5rem;
  padding: 2rem 3rem 10rem 3rem;
  text-shadow: 0px .125rem .75rem rgba(0,0,0,0.25);
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  background-image:linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0));
`;

export const ImageRotator = ({ photoData = [], activeIndex = 0, openIndex = null }) =>
  map(photoData, (p, i) => (
    <Spring
      key={get(p, 'id')}
      impl={TimingAnimation}
      config={{
        duration: 600,
        easing: Easing.easeOut,
      }}
      from={{ opacity: 0, zIndex: -1, filter: 'blur(0px)' }}
      to={{
        opacity: activeIndex === i ? 1 : 0,
        zIndex: activeIndex === i ? 0 : -1,
        filter: openIndex !== null ? 'blur(8px)' : 'blur(0px)',
      }}
      native
    >{ styles => (
      <Image
        style={styles}
        hidden={i > activeIndex + 1 || i < activeIndex - 1}
        color={get(p, 'color')}
        background={get(p, 'urls.full', '')}
      >
        <Title>{get(p, 'location.title')}</Title>
      </Image>
    )}</Spring>
  ));
