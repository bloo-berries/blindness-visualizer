import { VisualEffect } from '../../../types/visualEffects';

/**
 * Shared types and helper function for visual disturbance overlays
 */

export type EffectGetter = (id: string) => VisualEffect | undefined;

export type ContainerFinder = () => Element | null;
