import { VisualEffect } from '../../../types/visualEffects';

export type EffectGetter = (id: string) => VisualEffect | undefined;
