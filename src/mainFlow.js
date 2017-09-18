import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types'
import ComponentAnimation from './componentAnimation';

// TODO add support for onBackAtBeginning prop and onNextEnd prop-types
// recieve funcition of behavior when user presses back at beginning, or next
// at the end of routes.

function renderContentPage(
  { title, startPosition, ContentComponent, currentPosition, routeKey },
  pageIndex,
  screenWidth,
) {
  return (
    <ComponentAnimation
      key={routeKey}
      startPosition={startPosition}
      screenWidth={screenWidth}
      nextPosition={currentPosition}>
      <ContentComponent pageIndex={pageIndex} />
    </ComponentAnimation>
  );
}

function renderAllContentComponents(routes, screenWidth) {
  return routes.map((route, index) =>
    renderContentPage(route, index, screenWidth),
  );
}

const FlowNavigation = ({ routes, screenWidth }) =>
  <View style={{ flex: 1, flexDirection: 'row' }}>
    {
      renderAllContentComponents(routes, screenWidth)
    }
  </View>

FlowNavigation.propTypes = {
  routes: PropTypes.any.isRequired,
  screenWidth: PropTypes.number.isRequired,
}

export default FlowNavigation;
