/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {DevToolsHook} from 'react-devtools-shared/src/backend/types';

import Agent from 'react-devtools-shared/src/backend/agent';
import Bridge from 'react-devtools-shared/src/bridge';
import {initBackend} from 'react-devtools-shared/src/backend';
import setupNativeStyleEditor from 'react-devtools-shared/src/backend/NativeStyleEditor/setupNativeStyleEditor';

import {COMPACT_VERSION_NAME} from './utils';

window.logMessage('RDT initializing');
setup(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
window.logMessage('RDT setup complete');

function setup(hook: ?DevToolsHook) {
  if (hook == null) {
    return;
  }

  const bridge = new Bridge({
    listen(fn) {
      const listener = event => {
        if (
          event.source !== window ||
          !event.data ||
          event.data.source !== 'react-devtools-content-script' ||
          !event.data.payload
        ) {
          return;
        }
        fn(event.data.payload);
      };
      window.addEventListener('message', listener);
      return () => {
        window.removeEventListener('message', listener);
      };
    },
    send(event, payload, transferable) {
      window.postMessage(
        {
          source: 'react-devtools-bridge',
          payload: {event, payload},
        },
        '*',
        transferable,
      );
    },
  });

  const agent = new Agent(bridge);
  initBackend(hook, agent, window);

  hook.backends.set(COMPACT_VERSION_NAME, {
    Agent,
    Bridge,
    initBackend,
    setupNativeStyleEditor,
  });
  hook.emit('devtools-backend-installed', COMPACT_VERSION_NAME);
}
