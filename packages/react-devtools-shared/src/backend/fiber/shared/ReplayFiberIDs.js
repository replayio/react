/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// REPLAY Element IDs for Replay.
//
// Upstream hands out element IDs from a counter and remembers them for the
// lifetime of the backend. In Replay, a backend can be set up from scratch at
// any point of a recording (each replay process the backend routine runs in
// starts partway in; the devtools frontend sets one up in whatever pause the
// user inspects), but the IDs have to identify the same element in all of
// them. So they are derived from Replay's persistent object IDs instead, which
// Replay assigns in creation order and keeps stable for an object across the
// whole recording.
//
// A fiber and its alternate are one element, so the element ID is the lower
// (= older) of their two persistent IDs. The alternate pointer may be gone
// already: React clears it when it detaches deleted fibers. Replay's hook stub
// saves it from the `onCommitFiberUnmount` callback before that happens, and
// the backend routine passes those in `window.unmountedFiberAlternates`.

import type {Fiber} from 'react-reconciler/src/ReactInternalTypes';

// Provided by Replay in the scope of evaluations in paused recordings.
declare var __RECORD_REPLAY_ARGUMENTS__: {
  getPersistentId: (value: any) => number,
};

function getReplayPersistentID(fiber: Fiber): number {
  const id = __RECORD_REPLAY_ARGUMENTS__.getPersistentId(fiber);
  // Replay returns 0 for objects it doesn't track.
  if (!id) {
    // The backend routine recognizes this message.
    throw new Error('Missing persistent ID for fiber');
  }
  return id;
}

export function getReplayFiberID(fiber: Fiber): number {
  const id = getReplayPersistentID(fiber);

  let alternateFiber = fiber.alternate;
  if (alternateFiber == null && window.unmountedFiberAlternates?.has(fiber)) {
    alternateFiber = window.unmountedFiberAlternates.get(fiber);
  }
  if (alternateFiber == null) {
    return id;
  }

  return Math.min(id, getReplayPersistentID(alternateFiber));
}

// Virtual instances (e.g. Server Components) are created from component info
// objects rather than fibers. Replay doesn't track those objects today, so
// the renderer leaves virtual instances without a persistent ID out of the
// tree, like any filtered element (their children attach to the nearest
// included ancestor instead).
export function hasReplayPersistentID(object: {...}): boolean {
  return !!__RECORD_REPLAY_ARGUMENTS__.getPersistentId(object);
}

export function getReplayVirtualInstanceID(componentInfo: {...}): number {
  const id = __RECORD_REPLAY_ARGUMENTS__.getPersistentId(componentInfo);
  if (!id) {
    throw new Error('Missing persistent ID for component info');
  }
  return id;
}
