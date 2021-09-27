import { keyframes } from 'styled-components';

const slideInTop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0.8em);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideInBottom = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-0.8em);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeIn = keyframes`
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
`

//const popup = keyframes``

export {slideInTop, slideInBottom, fadeIn}