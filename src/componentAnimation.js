import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';

import { flowClearInjections } from './flowRedux'

class ContentAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(props.startPosition * width),
    };
  }

  componentDidMount() {
    if (this.props.injected) {
      this.animation(this.props.nextPosition);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.nextPosition !== nextProps.nextPosition) {
      this.animation(nextProps.nextPosition);
    }
  }

  animation(toValue) {
    Animated.timing(this.state.animatedValue, {
      toValue: toValue * this.props.width,
      duration: 1000,
    }).start(() => {
      if (this.props.injected) this.props.onAnimateComplete();
    });
  }
  render() {
    const { children } = this.props;
    const { animatedValue } = this.state;

    return (
      <Animated.View
        style={{
          flex: 1,
          flexDirection: 'row',
          position: 'absolute',
          left: animatedValue,
        }}>
        <View style={{ flex: 1 }}>{children}</View>
      </Animated.View>
    );
  }
}

ContentAnimation.defaultProps({
  injected: false,
})

ContentAnimation.propTypes = {
  screenWidth: PropTypes.number.isRequired,
  injected: PropTypes.bool,
  children: PropTypes.element.isRequired,
  startPosition: PropTypes.oneOf([-1, 0, 1]).isRequired,
  nextPosition: PropTypes.oneOf([-1, 0, 1]).isRequired,
};

export default ContentAnimation;
