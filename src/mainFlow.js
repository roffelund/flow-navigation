import React from 'react';
import { View } from 'react-native';

import ContentAnimation from './contentAnimation.js';

function renderContentPage(
  { title, startPosition, ContentComponent, currentPosition, injected },
  pageIndex,
  screenWidth,
) {
  return (
    <ContentAnimation
      key={title}
      startPosition={startPosition}
      injected={injected}
      screenWidth={screenWidth}
      nextPosition={currentPosition}>
      <ContentComponent pageIndex={pageIndex} />
    </ContentAnimation>
  );
}

function renderAllContentComponents(routes, screenWidth) {
  return routes.map((route, index) =>
    renderContentPage(route, index, screenWidth),
  );
}

const FlowNavigation = ({ routes }) =>
  <View style={{ flex: 1, flexDirection: 'row' }}>
    {
      renderAllContentComponents(routes, screenWidth)
    }
  </View>

FlowNavigation.propTypes = {
  routes: PropTypes.array.isRequired,
  screenWidth: PropTypes.number.isRequired,
}

export default FlowNavigation;
