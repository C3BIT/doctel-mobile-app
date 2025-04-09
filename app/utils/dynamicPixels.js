import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const dynamicPixels = {

  w: (percentage) => (width * percentage) / 100,

  h: (percentage) => (height * percentage) / 100,
  
  fs: (size) => Math.min((width * size) / 375, (height * size) / 812),
  
  responsive: (options) => {
    const { small, medium, large } = options;
    if (width < 375) return small;
    if (width < 768) return medium;
    return large;
  }
};

export default dynamicPixels;