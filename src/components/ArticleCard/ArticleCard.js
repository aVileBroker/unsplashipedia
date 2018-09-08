import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { animated, Spring, Transition, } from 'react-spring';
import { TimingAnimation, Easing } from 'react-spring/dist/addons';

import {
  closeDetails,
  expandDetails,
  pauseOn,
  setBrowse,
} from '../../actions';

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

  overflow: hidden;

  z-index: ${props => props.isOpen ? 10 : 0 };
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

const PhotogInfo = styled.a`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  padding: .75rem 1rem;
  color: #77f;
  text-decoration: none;
  background-color: white;
  border-radius: .5rem;
  &:hover{
    background-color: #ddd;
  }
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

const Timer = styled(animated.div)`
  height: ${props => props.isPaused ? '.5rem' : '.25rem'};
  background-color: ${props => props.isPaused ? '#cc0' : '#77f'};
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  transform-origin: left;

  z-index: 10;

  ${props => props.isPaused ? `
    &::before{
      content: '';
      width:3rem;
      height:3rem;

      left: calc(50% - 1.5rem);

      background-image: url('images/pause.svg');
      background-position: center;
      background-color: #cc0;
      background-size: 1rem;
      background-repeat: no-repeat;

      position:absolute;
      bottom: 0rem;
      border-radius: 50%;
    }
  `: ''}
`;

const getTransform = (index, page, articlesPerPage, clientDimensions, browsing, scrollY) => {
  if(browsing) {
    const xPosition = ((index % articlesPerPage) * 385) + 32;
    const yPosition = -clientDimensions.height + ((Math.floor(index / articlesPerPage) + 1) * (96 + 64) + 144);

    return `translate(${xPosition}px, ${yPosition + scrollY}px)`;
  }

  return `translate(${(((index * 385) + (-1 * page * articlesPerPage * 385)) + 32)}px, 0px)`;
};

const ArticleCardBase = ({
  text,
  title,
  linkUrl,
  wikiUrl,
  photogName,
  photogAvatar,
  photogLink,
  activeIndex,
  browsing,
  scrollY,
  page,
  clientDimensions,
  articlesPerPage,
  hidden,
  index,
  isActive,
  isOpen,
  isPaused,
  openIndex,

  closeDetails,
  expandDetails,
  pauseOn,
}) => (
  <Spring
    impl={TimingAnimation}
    config={{
      duration: 300,
    }}
    from={{
      opacity: 1,
      height: '96px',
      width: '304px',
      left: '0px',
      transform: 'translate(0px, 0px)',
      expandRotation: 'rotate(45deg)',
    }}
    to={{
      filter: (openIndex !== null && !isOpen) ? 'blur(4px)' : 'blur(0px)',
      height: isOpen
        ? `${clientDimensions.height - 240}px`
        : (isActive && !browsing)
          ? '304px'
          : '96px',
      left: isOpen
        ? `${(clientDimensions.width/2) - 32 || -32}px`
        : '0px',
      width: isOpen
        ? `${Math.min(((clientDimensions.width - 32) * .9), 608)}px`
        : '304px',
      transform: isOpen
        ? `translate(-${Math.min(clientDimensions.width*.45, 304)}px, -64px)`
        : getTransform(index, page, articlesPerPage, clientDimensions, browsing, scrollY),
      expandRotation: `rotate(${isOpen ? '0' : '45' }deg)`,
    }}
    native
  >
    {styles => (
      <Card
        onClick={() => { pauseOn(index) }}
        isOpen={isOpen}
        style={{
          display: (hidden && !browsing) ? 'none' : 'flex',
          filter: styles.filter,
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
            onClick={(e) => {
              e.stopPropagation();
              if(isOpen) {
                closeDetails();
              } else {
                expandDetails(index);
              }
            }}
          >
            &times;
          </ExpandCloseButton>
        }
        <CardContent>
          <CardTitle>{title}</CardTitle>
          {text}
          <PhotogInfo href={photogLink}>
            <ProfilePic image={photogAvatar} />
            {photogName}
          </PhotogInfo>
        </CardContent>
        {(isActive && !isOpen && !isPaused) &&
          <Spring
            native
            impl={TimingAnimation}
            config={{
              duration: 6000,
              easing: Easing.linear,
            }}
            from={{ width: '100%' }}
            to={{ width: `${isActive ? 0 : 100}%` }}
          >
            {styles => (
              <Timer style={styles} />
            )}
          </Spring>
        }
        {(isPaused && !isOpen) &&
          <Timer isPaused />
        }
        <Transition
          from={{ transform: 'translateY(12rem)' }}
          enter={{ transform: 'translateY(0rem)' }}
          leave={{ transform: 'translateY(12rem)' }}
          native
        >
          {(isActive && !browsing) && ( styles => (
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

const mapStateToProps = (state) => {
  return {
    photoData: state.photoData,
    activeIndex: state.activeIndex,
    openIndex: state.openIndex,
    page: state.page,
    articlesPerPage: state.articlesPerPage,
    clientDimensions: state.clientDimensions,
    browsing: state.browsing,
    scrollY: state.scrollY,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    closeDetails: () => dispatch(closeDetails()),
    expandDetails: i => dispatch(expandDetails(i)),
    pauseOn: i => dispatch(pauseOn(i)),
    setBrowse: b => dispatch(setBrowse(b)),
  }
};

export const ArticleCard =  connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArticleCardBase);
