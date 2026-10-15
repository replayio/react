/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// REPLAY Measuring host instances (for the Suspense tab, which Replay doesn't
// have) would make the recorded page compute its layout inside a paused
// recording, at every commit. The renderer reports them as unmeasurable
// instead, as upstream does for hosts it can't measure.
export function shouldMeasureHostInstances(): boolean {
  return false;
}
