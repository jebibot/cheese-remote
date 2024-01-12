import type { Fiber } from "react-reconciler";

export function getReactContainer(elem: HTMLElement | null) {
  if (elem == null) {
    return;
  }
  return Object.entries(elem).find(([k]) =>
    k.startsWith("__reactContainer$"),
  )?.[1];
}

export function findReactNode(
  node: Fiber | null,
  criteria: (node: Fiber) => boolean,
): Fiber | null {
  if (node == null) {
    return null;
  }
  if (criteria(node)) {
    return node;
  }
  return (
    findReactNode(node.child, criteria) || findReactNode(node.sibling, criteria)
  );
}

export function findCurrentFiber(node: Fiber) {
  if (node == null) {
    return null;
  }
  const fiber = node;
  const alternate = node.alternate;
  if (alternate == null) {
    return fiber;
  }
  let a = fiber;
  let b = alternate;
  while (true) {
    const parentA = a.return;
    if (parentA === null) {
      break;
    }
    const parentB = parentA.alternate;
    if (parentB === null) {
      return null;
    }
    if (parentA.child === parentB.child) {
      let child = parentA.child;
      while (child) {
        if (child === a) {
          return fiber;
        }
        if (child === b) {
          return alternate;
        }
        child = child.sibling;
      }
    }
    if (a.return !== b.return) {
      a = parentA;
      b = parentB;
    } else {
      let didFindChild = false;
      let child = parentA.child;
      while (child) {
        if (child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }
        if (child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }
        child = child.sibling;
      }
      if (!didFindChild) {
        child = parentB.child;
        while (child) {
          if (child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }
          if (child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }
          child = child.sibling;
        }
        if (!didFindChild) {
          return null;
        }
      }
    }
    if (a.alternate !== b) {
      return null;
    }
  }
  if (a.stateNode.current === a) {
    return fiber;
  }
  return alternate;
}

export function findReactState(
  node: Fiber | null,
  criteria: (state: any) => boolean,
) {
  if (node == null) {
    return;
  }
  let state = node.memoizedState;
  while (state != null) {
    if (state.memoizedState != null && criteria(state.memoizedState)) {
      return state;
    }
    state = state.next;
  }
}
