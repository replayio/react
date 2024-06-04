/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import {useContext} from 'react';
import {SettingsContext} from './SettingsContext';

import styles from './SettingsShared.css';

export default function DebuggingSettings(_: {}): React.Node {
  const {
    appendComponentStack,
    breakOnConsoleErrors,
    hideConsoleLogsInStrictMode,
    setAppendComponentStack,
    setBreakOnConsoleErrors,
    setShowInlineWarningsAndErrors,
    showInlineWarningsAndErrors,
    setHideConsoleLogsInStrictMode,
  } = useContext(SettingsContext);

  return (
    <div className={styles.Settings}>
      <div className={styles.Setting}>
        <label>
          <input
            type="checkbox"
            checked={appendComponentStack}
            onChange={({currentTarget}) =>
              setAppendComponentStack(currentTarget.checked)
            }
          />{' '}
          Append component stacks to console warnings and errors.
        </label>
      </div>

      <div className={styles.Setting}>
        <label>
          <input
            type="checkbox"
            checked={showInlineWarningsAndErrors}
            onChange={({currentTarget}) =>
              setShowInlineWarningsAndErrors(currentTarget.checked)
            }
          />{' '}
          Show inline warnings and errors.
        </label>
      </div>

      <div className={styles.Setting}>
        <label>
          <input
            type="checkbox"
            checked={breakOnConsoleErrors}
            onChange={({currentTarget}) =>
              setBreakOnConsoleErrors(currentTarget.checked)
            }
          />{' '}
          Break on warnings
        </label>
      </div>

      <div className={styles.Setting}>
        <label>
          <input
            type="checkbox"
            checked={hideConsoleLogsInStrictMode}
            onChange={({currentTarget}) =>
              setHideConsoleLogsInStrictMode(currentTarget.checked)
            }
          />{' '}
          Hide logs during additional invocations in{' '}
          <a
            className={styles.StrictModeLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://react.dev/reference/react/StrictMode">
            Strict Mode
          </a>
        </label>
      </div>
    </div>
  );
}
