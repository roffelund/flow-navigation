import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { flowClearInjections } from './flowRedux'

class ContentAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(props.startPosition * props.screenWidth),
    };
  }

  componentDidMount() {
    if (this.props.currentPosition !== this.props.nextPosition) {
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
      toValue: toValue * this.props.screenWidth,
      duration: 1000,
    }).start();
  }
  render() {
    const { children, screenWidth } = this.props;
    const { animatedValue } = this.state;

    const styles = StyleSheet.create({
      animatedView: {
        flex: 1,
        width: screenWidth,
        position: 'absolute',
        top: 0,
        bottom: 0,
      },
      innerWrapper: {
        flex: 1
      }
    })

    return (
      <Animated.View style={[styles.animatedView, { left: animatedValue }]}>
        <View style={styles.innerWrapper}>
          {children}
        </View>
      </Animated.View>
    );
  }
}

ContentAnimation.propTypes = {
  screenWidth: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired,
  startPosition: PropTypes.oneOf([-1, 0, 1]).isRequired,
  nextPosition: PropTypes.oneOf([-1, 0, 1]).isRequired,
};

export default ContentAnimation;
