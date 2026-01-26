import { VisualEffect } from '../../types/visualEffects';
import { createAllFamousPeopleOverlays } from './famousPeople';

/**
 * Creates overlays for famous people-specific conditions
 * Delegates to individual person-specific modules for maintainability
 */
export const createFamousPeopleOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  createAllFamousPeopleOverlays(effects, container);
};
