/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// REPLAY Additions to the inspected element payload for the devtools frontend.

import type {Fiber} from 'react-reconciler/src/ReactInternalTypes';
import {
  ElementTypeClass,
  ElementTypeForwardRef,
  ElementTypeFunction,
  ElementTypeMemo,
} from 'react-devtools-shared/src/frontend/types';
import type {ChangeDescription, InspectedElement} from '../../types';

// Provided by Replay in the scope of evaluations in paused recordings.
declare var __RECORD_REPLAY_ARGUMENTS__: {
  internal?: {
    registerPlainObject: (value: any) => number | null | void,
  },
};

function getReplayObjectID(object: mixed): number | null {
  // registerPlainObject() only exists in newer Replay Chromium builds (FE-1885).
  const registerPlainObject =
    __RECORD_REPLAY_ARGUMENTS__.internal?.registerPlainObject;
  if (registerPlainObject == null || !object) {
    return null;
  }
  try {
    return registerPlainObject(object) ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// The devtools frontend shows props, state, hooks and context with Replay's
// own object inspector rather than from the dehydrated copies the payload
// carries, so it needs Replay object IDs for them (and for the component
// type, for "view source").
export function addReplayObjectIDs(
  payload: InspectedElement,
  inspectedElement: InspectedElement,
  fiber: Fiber,
): void {
  payload.contextObjectId = getReplayObjectID(inspectedElement.context);
  payload.hooksObjectId = getReplayObjectID(inspectedElement.hooks);
  payload.propsObjectId = getReplayObjectID(inspectedElement.props);
  payload.stateObjectId = getReplayObjectID(inspectedElement.state);
  const elementType = inspectedElement.type;
  payload.typeObjectId =
    elementType === ElementTypeClass ||
    elementType === ElementTypeFunction ||
    elementType === ElementTypeForwardRef ||
    elementType === ElementTypeMemo
      ? getReplayObjectID(fiber.type)
      : null;
}

// The devtools frontend highlights which props, state, context values and
// hooks of the inspected element changed in its last render. React DevTools
// computes this (the "change description") only while profiling with "record
// why each component rendered"; the renderer passes the same computation here.
export function addReplayChangedData(
  payload: InspectedElement,
  changeDescription: ChangeDescription | null,
): void {
  const context = changeDescription?.context;
  payload.changedContextKeys = Array.isArray(context) ? context : [];
  payload.changedHooksIds = changeDescription?.hooks ?? [];
  payload.changedPropsKeys = changeDescription?.props ?? [];
  payload.changedStateKeys = changeDescription?.state ?? [];
}
