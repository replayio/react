export const CHANGE_LOG_URL =
  'https://github.com/facebook/react/blob/main/packages/react-devtools/CHANGELOG.md';

export const UNSUPPORTED_VERSION_URL =
  'https://reactjs.org/blog/2019/08/15/new-react-devtools.html#how-do-i-get-the-old-version-back';

export const REACT_DEVTOOLS_WORKPLACE_URL =
  'https://fburl.com/react-devtools-workplace-group';

import type {
  Theme,
  DisplayDensity,
} from './devtools/views/Settings/SettingsContext';

export const THEME_STYLES: {[style: Theme | DisplayDensity]: any, ...} = {
  light: {},
  dark: {},
  compact: {},
  comfortable: {},
};

// HACK
//
// Sometimes the inline target is rendered before root styles are applied,
// which would result in e.g. NaN itemSize being passed to react-window list.
const COMFORTABLE_LINE_HEIGHT: number = 22;
const COMPACT_LINE_HEIGHT: number = 18;

export {COMFORTABLE_LINE_HEIGHT, COMPACT_LINE_HEIGHT};
