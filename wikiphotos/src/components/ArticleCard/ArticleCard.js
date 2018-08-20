import React from 'react';
import styled from 'styled-components';
import { animated, Spring, Transition, } from 'react-spring';

import { closeDetails, expandDetails, pauseOn } from '../../actions'

const Card = styled(animated.div)`
  background-color: white;
  border-radius: .5rem;
  box-shadow: 0rem .25rem 1rem -.5rem rgba(0,0,0,0.5);

  position:absolute;
  left: 0%;
  bottom: .25rem;

  cursor: pointer;

  margin: 1rem;
  padding: 1.5rem;

  display: flex;
  flex: 0 0 16rem;
  flex-direction: column;
  align-items: flex-end;
  overflow: ${props => props.isOpen ? 'auto' : 'hidden'};
`;

const CardContent = styled.div`
  color: #777;
  width: 100%;
  overflow: hidden;
  line-height: 1.1;
`;

const CardTitle = styled.div`
  font-size: 1.2rem;
  color: black;
  margin-bottom: .5rem;
  margin-right: 1rem;
`;

const ExpandCloseButton = styled(animated.a)`
  position:absolute;
  top: .5rem;
  right: .75rem;
  padding: .5rem;
  width: 1rem;
  height: 1rem;
  font-size: 1.2rem;
  font-family: Roboto;

  background-color: white;
  border-radius: 50%;
  &:hover{
    background-color: #ddd;
  }

  line-height: 1;
  text-align: center;
`;

const PhotogInfo = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: .5rem;
  &:hover{
    background-color: #ddd;
  }

  padding: 1rem;
`;
const ProfilePic = styled.div`
  background-image: url(${props => props.image});
  margin-right: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
`;

const LinkContainer = styled(animated.div)`
  width: 100%;
  height: ${props => props.isOpen ? '3rem' : '8rem'};
  position: absolute;
  bottom: .75rem;
  left: 0;
  z-index: 2;

  background-image:linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,.75) 50%, rgba(255,255,255,0));
`;

const Link = styled.a`
  display: inline-block;
  padding: .75rem 1rem;
  color: #77f;
  text-decoration: none;
  text-transform: capitalize;

  position: absolute;
  bottom: 0;
  ${props => props.side}: 1rem;
  z-index: 2;

  background-color: white;
  border-radius: .5rem;
  &:hover{
    background-color: #ddd;
  }
`;

export const ArticleCard = ({
  text,
  title,
  linkUrl,
  wikiUrl,
  photogName,
  photogAvatar,
  photogLink,
  activeIndex,
  page,
  windowWidth,
  articlesPerPage,
  index,
  isActive,
  isOpen,
  openIndex,
  dispatch,
}) => (
  <Spring
    config={{
      duration: 1200,
    }}
    from={{
      opacity: 1,
      height: '3rem',
      width: '304px',
      left: '0px',
      transform: 'translate(0px, 0px)',
      expandRotation: 'rotate(45deg)',
      zIndex: 0,
    }}
    to={{
      opacity: (openIndex !== null && !isOpen) ? .3 : 1,
      zIndex: isOpen ? 1 : 0,
      height: isOpen
        ? '25rem'
        : isActive
          ? '16rem'
          : '3rem',
      left: isOpen ? `${(windowWidth/2) || 0}px` : '0px',
      width: isOpen ? '608px' : '304px',
      transform: isOpen ? 'translate(-304px, -64px)' : `translate(${(((index * 385) + (-1 * page * articlesPerPage * 385)) + 48)}px, 0px)`,
      expandRotation: `rotate(${isOpen ? '0' : '45' }deg)`,
    }}
    native
  >
    {styles => (
      <Card
        onClick={() => { dispatch(pauseOn(index)) }}
        isOpen={isOpen}
        style={{
          opacity: styles.opacity,
          height: styles.height,
          transform: styles.transform,
          left: styles.left,
          width: styles.width,
          zIndex: styles.zIndex,
        }}
      >
        {isActive &&
          <ExpandCloseButton
            style={{ transform: styles.expandRotation }}
            onClick={(e) => {e.stopPropagation(); dispatch(isOpen ? closeDetails() : expandDetails(index))}}
          >
            &times;
          </ExpandCloseButton>
        }
        <CardContent><CardTitle>{title}</CardTitle>{text}<PhotogInfo href={photogLink}><ProfilePic image={photogAvatar} />{photogName}</PhotogInfo></CardContent>
        <Transition
          from={{ transform: 'translateY(12rem)' }}
          enter={{ transform: 'translateY(0rem)' }}
          leave={{ transform: 'translateY(12rem)' }}
          native
        >
          {isActive && ( styles => (
            <LinkContainer style={styles} isOpen={isOpen}>
              <Link side="left" href={linkUrl}>VIEW PHOTO</Link>
              <Link side="right" href={wikiUrl}>READ MORE</Link>
            </LinkContainer>
          ))}
        </Transition>
      </Card>
    )}
  </Spring>
);
