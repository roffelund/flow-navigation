Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/mainFlow.js';var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _contentAnimation=require('./components/contentAnimation');var _contentAnimation2=_interopRequireDefault(_contentAnimation);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function renderContentPage(_ref,pageIndex,screenWidth){var title=_ref.title,startPosition=_ref.startPosition,ContentComponent=_ref.ContentComponent,currentPosition=_ref.currentPosition,injected=_ref.injected;return _react2.default.createElement(_contentAnimation2.default,{key:title,startPosition:startPosition,injected:injected,screenWidth:screenWidth,nextPosition:currentPosition,__source:{fileName:_jsxFileName,lineNumber:12}},_react2.default.createElement(ContentComponent,{pageIndex:pageIndex,__source:{fileName:_jsxFileName,lineNumber:18}}));}function renderAllContentComponents(routes,screenWidth){return routes.map(function(route,index){return renderContentPage(route,index,screenWidth);});}var FlowNavigation=function FlowNavigation(_ref2){var routes=_ref2.routes;return _react2.default.createElement(_reactNative.View,{style:{flex:1,flexDirection:'row'},__source:{fileName:_jsxFileName,lineNumber:30}},renderAllContentComponents(routes,screenWidth));};FlowNavigation.propTypes={routes:PropTypes.array.isRequired,screenWidth:PropTypes.number.isRequired};exports.default=FlowNavigation;