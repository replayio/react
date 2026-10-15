/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// REPLAY Component types seen per fiber, for the backend routine.
//
// Production builds of the recorded app have minified component names. To
// show the real ones, the backend routine wants the component functions
// themselves (which it maps back to their source): when it evaluates this
// backend, it provides `window.componentFunctionDetailsPerPoint` and
// `window.nonComponentFiberTypesPerPoint`, and getDisplayNameForFiber()
// records there which element IDs it saw with which type. getDisplayName()
// (in utils.js) records the (minified) name it computed for a component type.

import type {Fiber} from 'react-reconciler/src/ReactInternalTypes';

import {getReplayFiberID} from './ReplayFiberIDs';

export function recordReplayComponentType(fiber: Fiber, type: any): void {
  const componentFunctionDetailsPerPoint =
    window.componentFunctionDetailsPerPoint;
  if (componentFunctionDetailsPerPoint == null) {
    return;
  }
  const fiberId = getReplayFiberID(fiber);
  const functionDetails = componentFunctionDetailsPerPoint.get(type);
  if (functionDetails != null) {
    if (!functionDetails.fiberIds.includes(fiberId)) {
      functionDetails.fiberIds.push(fiberId);
    }
  } else {
    componentFunctionDetailsPerPoint.set(type, {
      minifiedDisplayName: null,
      fiberIds: [fiberId],
    });
  }
}

// Like recordReplayComponentType(), for fibers that aren't components (e.g.
// context providers and consumers, whose names come from the context).
export function recordReplayNonComponentType(fiber: Fiber, type: any): void {
  const nonComponentFiberTypesPerPoint = window.nonComponentFiberTypesPerPoint;
  if (nonComponentFiberTypesPerPoint == null) {
    return;
  }
  const fiberId = getReplayFiberID(fiber);
  const fiberTypeDetails = nonComponentFiberTypesPerPoint.get(type);
  if (fiberTypeDetails != null) {
    if (!fiberTypeDetails.fiberIds.includes(fiberId)) {
      fiberTypeDetails.fiberIds.push(fiberId);
    }
  } else {
    nonComponentFiberTypesPerPoint.set(type, {fiberIds: [fiberId]});
  }
}

export function recordReplayComponentDisplayName(
  type: any,
  displayName: string,
): void {
  const componentFunctionDetailsPerPoint =
    window.componentFunctionDetailsPerPoint;
  if (componentFunctionDetailsPerPoint == null) {
    return;
  }
  const functionDetails = componentFunctionDetailsPerPoint.get(type);
  if (functionDetails != null) {
    functionDetails.minifiedDisplayName = displayName;
  } else {
    componentFunctionDetailsPerPoint.set(type, {
      minifiedDisplayName: displayName,
      fiberIds: [],
    });
  }
}
