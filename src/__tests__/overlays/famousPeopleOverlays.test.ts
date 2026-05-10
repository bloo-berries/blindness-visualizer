import { VisualEffect } from '../../types/visualEffects';
import {
  createMiltonOverlays,
  createChristineHaOverlays,
  createJudiDenchOverlays,
  createSugarRayLeonardOverlays,
  createStephenCurryOverlays,
  createAmadouBagayokoOverlays,
  createDavidBrownOverlays,
  createLexGilletteOverlays,
  createGalileoOverlays,
  createVedMehtaOverlays,
  createLucyEdwardsOverlays,
  createDavidPatersonOverlays,
  createErikWeihenmayerOverlays,
  createMarlaRunyanOverlays,
  createMinkaraOverlays,
  createJoshuaMieleOverlays,
  createMilaKunisOverlays,
  createJoseCidOverlays,
  createAllFamousPeopleOverlays,
} from '../../utils/overlays/famousPeople';

import { galileoOverlays } from '../../utils/overlays/famousPeople/galileoOverlays';
import { vedMehtaOverlays } from '../../utils/overlays/famousPeople/vedMehtaOverlays';
import { lucyEdwardsOverlays } from '../../utils/overlays/famousPeople/lucyEdwardsOverlays';
import { davidPatersonOverlays } from '../../utils/overlays/famousPeople/davidPatersonOverlays';
import { joseCidOverlays } from '../../utils/overlays/famousPeople/joseCidOverlays';
import {
  processOverlayConfigs,
  createOverlayProcessor,
  OverlayConfig,
} from '../../utils/overlays/famousPeople/overlayConfig';

function makeEffect(id: string, intensity: number): VisualEffect {
  return {
    id,
    name: id,
    enabled: true,
    intensity,
    category: 'famousPeople' as VisualEffect['category'],
    description: '',
  };
}

function effectsMap(...entries: VisualEffect[]): Map<string, VisualEffect> {
  const map = new Map<string, VisualEffect>();
  for (const e of entries) map.set(e.id, e);
  return map;
}

describe('Famous People Overlays', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // --- Overlay Config System ---
  describe('processOverlayConfigs', () => {
    it('creates overlays for enabled effects matching config', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'testEffect',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'multiply',
        },
      ];
      const effects = effectsMap(makeEffect('testEffect', 0.7));

      processOverlayConfigs(configs, effects);

      const overlay = document.getElementById('visual-field-overlay-testEffect');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('skips disabled effects', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'testEffect',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'multiply',
        },
      ];
      const disabledEffect: VisualEffect = {
        ...makeEffect('testEffect', 0.5),
        enabled: false,
      };
      const effects = new Map<string, VisualEffect>();
      effects.set('testEffect', disabledEffect);

      processOverlayConfigs(configs, effects);

      expect(document.getElementById('visual-field-overlay-testEffect')).toBeNull();
    });

    it('uses custom overlayId when provided', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'testEffect',
          overlayId: 'custom-overlay-id',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'normal',
        },
      ];
      const effects = effectsMap(makeEffect('testEffect', 0.5));

      processOverlayConfigs(configs, effects);

      expect(document.getElementById('custom-overlay-id')).not.toBeNull();
    });

    it('applies custom opacity function', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'testEffect',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'normal',
          opacity: (i: number) => Math.min(0.5, i).toString(),
        },
      ];
      const effects = effectsMap(makeEffect('testEffect', 0.8));

      processOverlayConfigs(configs, effects);

      const overlay = document.getElementById('visual-field-overlay-testEffect');
      expect(overlay!.style.opacity).toBe('0.5');
    });

    it('applies filter function when provided', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'testEffect',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'normal',
          filter: (i: number) => `blur(${i * 5}px)`,
        },
      ];
      const effects = effectsMap(makeEffect('testEffect', 0.6));

      processOverlayConfigs(configs, effects);

      const overlay = document.getElementById('visual-field-overlay-testEffect');
      expect(overlay!.style.filter).toContain('blur');
    });

    it('skips effects not in the map', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'nonExistent',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'normal',
        },
      ];

      processOverlayConfigs(configs, new Map());

      expect(document.getElementById('visual-field-overlay-nonExistent')).toBeNull();
    });
  });

  describe('createOverlayProcessor', () => {
    it('returns a function', () => {
      const processor = createOverlayProcessor([]);
      expect(typeof processor).toBe('function');
    });

    it('returned function processes configs correctly', () => {
      const configs: OverlayConfig[] = [
        {
          effectId: 'procTest',
          background: (i: number) => `rgba(0,0,0,${i})`,
          blendMode: 'screen',
        },
      ];
      const processor = createOverlayProcessor(configs);
      const effects = effectsMap(makeEffect('procTest', 0.5));

      processor(effects);

      expect(document.getElementById('visual-field-overlay-procTest')).not.toBeNull();
    });
  });

  // --- Declarative config-based overlays ---
  describe('declarative overlay configs', () => {
    const declarativeOverlays: Array<{
      name: string;
      configs: OverlayConfig[];
      createFn: (effects: Map<string, VisualEffect>, container?: HTMLElement) => void;
    }> = [
      { name: 'galileo', configs: galileoOverlays, createFn: createGalileoOverlays },
      { name: 'vedMehta', configs: vedMehtaOverlays, createFn: createVedMehtaOverlays },
      { name: 'lucyEdwards', configs: lucyEdwardsOverlays, createFn: createLucyEdwardsOverlays },
      { name: 'davidPaterson', configs: davidPatersonOverlays, createFn: createDavidPatersonOverlays },
      { name: 'joseCid', configs: joseCidOverlays, createFn: createJoseCidOverlays },
    ];

    test.each(declarativeOverlays)(
      '$name configs array is non-empty',
      ({ configs }) => {
        expect(configs.length).toBeGreaterThan(0);
      }
    );

    test.each(declarativeOverlays)(
      '$name configs each have required fields',
      ({ configs }) => {
        for (const config of configs) {
          expect(config.effectId).toBeDefined();
          expect(typeof config.background).toBe('function');
          expect(typeof config.blendMode).toBe('string');
        }
      }
    );

    test.each(declarativeOverlays)(
      '$name background function returns valid CSS for intensity 0.5',
      ({ configs }) => {
        for (const config of configs) {
          const bg = config.background(0.5);
          expect(typeof bg).toBe('string');
          expect(bg.length).toBeGreaterThan(0);
        }
      }
    );

    test.each(declarativeOverlays)(
      '$name createFn creates overlays when effects are enabled',
      ({ configs, createFn }) => {
        const effects = effectsMap(
          ...configs.map(c => makeEffect(c.effectId, 0.5))
        );
        createFn(effects);

        // At least one overlay should have been created
        for (const config of configs) {
          const overlayId = config.overlayId ?? `visual-field-overlay-${config.effectId}`;
          const overlay = document.getElementById(overlayId);
          expect(overlay).not.toBeNull();
        }
      }
    );

    test.each(declarativeOverlays)(
      '$name createFn creates no overlays when effects map is empty',
      ({ createFn }) => {
        createFn(new Map());
        const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
        expect(overlays.length).toBe(0);
      }
    );
  });

  // --- Imperative overlays (function-based) ---
  describe('createMiltonOverlays', () => {
    it('creates progressive vignetting overlay with multiply blend mode', () => {
      const effects = effectsMap(makeEffect('miltonProgressiveVignetting', 0.7));
      createMiltonOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-miltonProgressiveVignetting');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('creates temporal field loss overlay', () => {
      const effects = effectsMap(makeEffect('miltonTemporalFieldLoss', 0.6));
      createMiltonOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-miltonTemporalFieldLoss');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('creates retinal detachment overlay', () => {
      const effects = effectsMap(makeEffect('miltonRetinalDetachment', 0.7));
      createMiltonOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-miltonRetinalDetachment');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('multiply');
    });

    it('creates complete blindness overlay', () => {
      const effects = effectsMap(makeEffect('completeBlindness', 1.0));
      createMiltonOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-completeBlindness');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.opacity).toBe('1');
    });

    it('creates photophobia overlay with brightness filter', () => {
      const effects = effectsMap(makeEffect('miltonPhotophobia', 0.5));
      createMiltonOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-miltonPhotophobia');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('screen');
      expect(overlay!.style.filter).toContain('brightness');
    });

    it('creates glaucoma halos overlay with container support', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const effects = effectsMap(makeEffect('miltonGlaucomaHalos', 0.6));
      createMiltonOverlays(effects, container);

      const overlay = document.getElementById('visual-field-overlay-miltonGlaucomaHalos');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('screen');
      expect(overlay!.style.filter).toContain('blur');
    });

    it('creates no overlays when no effects are enabled', () => {
      createMiltonOverlays(new Map());

      expect(document.getElementById('visual-field-overlay-miltonProgressiveVignetting')).toBeNull();
      expect(document.getElementById('visual-field-overlay-completeBlindness')).toBeNull();
    });
  });

  describe('createChristineHaOverlays', () => {
    it('creates steamy mirror overlay with screen blend mode', () => {
      const effects = effectsMap(makeEffect('christineSteamyMirror', 0.7));
      createChristineHaOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-christineSteamyMirror');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('screen');
    });

    it('creates near-distance exception zone for steamy mirror', () => {
      const effects = effectsMap(makeEffect('christineSteamyMirror', 0.6));
      createChristineHaOverlays(effects);

      const exception = document.getElementById('visual-field-overlay-christineSteamyMirrorException');
      expect(exception).not.toBeNull();
      expect(exception!.style.mixBlendMode).toBe('multiply');
    });

    it('creates light scatter overlay with blur', () => {
      const effects = effectsMap(makeEffect('christineLightScatter', 0.5));
      createChristineHaOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-christineLightScatter');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.filter).toContain('blur');
    });

    it('creates fog overlay with screen blend mode', () => {
      const effects = effectsMap(makeEffect('christineFogOverlay', 0.6));
      createChristineHaOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-christineFogOverlay');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.mixBlendMode).toBe('screen');
    });

    it('creates fluctuating vision overlay', () => {
      const effects = effectsMap(makeEffect('christineFluctuatingVision', 0.5));
      createChristineHaOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-christineFluctuatingVision');
      expect(overlay).not.toBeNull();
    });

    it('creates NMO complete with multiple layers', () => {
      const effects = effectsMap(makeEffect('christineNMOComplete', 0.8));
      createChristineHaOverlays(effects);

      expect(document.getElementById('visual-field-overlay-christineNMOCompleteFog1')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-christineNMOCompleteFog2')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-christineNMOCompleteLightBloom')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-christineNMOCompleteException')).not.toBeNull();
    });

    it('does not create overlays for empty effects map', () => {
      createChristineHaOverlays(new Map());

      expect(document.getElementById('visual-field-overlay-christineSteamyMirror')).toBeNull();
      expect(document.getElementById('visual-field-overlay-christineLightScatter')).toBeNull();
    });
  });

  describe('createJudiDenchOverlays', () => {
    it('creates AMD complete overlay with scotoma and blur layers', () => {
      const effects = effectsMap(makeEffect('judiAMDComplete', 0.7));
      createJudiDenchOverlays(effects);

      expect(document.getElementById('visual-field-overlay-judiAMDComplete-scotoma')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-judiAMDComplete-blur')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-judiAMDComplete-color')).not.toBeNull();
    });

    it('creates central scotoma overlay', () => {
      const effects = effectsMap(makeEffect('judiCentralScotoma', 0.6));
      createJudiDenchOverlays(effects);

      expect(document.getElementById('visual-field-overlay-judiCentralScotoma-scotoma')).not.toBeNull();
      expect(document.getElementById('visual-field-overlay-judiCentralScotoma-blur')).not.toBeNull();
    });

    it('creates face blindness overlay with blur filter', () => {
      const effects = effectsMap(makeEffect('judiFaceBlindness', 0.6));
      createJudiDenchOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-judiFaceBlindness');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.filter).toContain('blur');
    });

    it('creates reading loss overlay with blur filter', () => {
      const effects = effectsMap(makeEffect('judiReadingLoss', 0.5));
      createJudiDenchOverlays(effects);

      const overlay = document.getElementById('visual-field-overlay-judiReadingLoss');
      expect(overlay).not.toBeNull();
      expect(overlay!.style.filter).toContain('blur');
    });

    it('does not create overlays when no effects are enabled', () => {
      createJudiDenchOverlays(new Map());

      expect(document.getElementById('visual-field-overlay-judiFaceBlindness')).toBeNull();
    });
  });

  // --- Imperative overlays tested via test.each ---
  describe('imperative overlay creators', () => {
    const imperativeCreators: Array<{
      name: string;
      createFn: (effects: Map<string, VisualEffect>) => void;
      sampleEffectId: string;
    }> = [
      {
        name: 'sugarRayLeonard',
        createFn: createSugarRayLeonardOverlays,
        sampleEffectId: 'sugarRetinalDetachmentComplete',
      },
      {
        name: 'stephenCurry',
        createFn: createStephenCurryOverlays,
        sampleEffectId: 'stephenKeratoconusComplete',
      },
      {
        name: 'amadouBagayoko',
        createFn: createAmadouBagayokoOverlays,
        sampleEffectId: 'amadouCataractProgression',
      },
      {
        name: 'davidBrown',
        createFn: createDavidBrownOverlays,
        sampleEffectId: 'davidKawasakiGlaucomaComplete',
      },
      {
        name: 'lexGillette',
        createFn: createLexGilletteOverlays,
        sampleEffectId: 'lexRecurrentDetachmentCycle',
      },
    ];

    test.each(imperativeCreators)(
      '$name creates overlay when effect is enabled',
      ({ createFn, sampleEffectId }) => {
        const effects = effectsMap(makeEffect(sampleEffectId, 0.6));
        createFn(effects);

        // Should have created at least one overlay in the DOM
        const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
        expect(overlays.length).toBeGreaterThan(0);
      }
    );

    test.each(imperativeCreators)(
      '$name creates no overlays for empty effects map',
      ({ createFn }) => {
        createFn(new Map());

        const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
        expect(overlays.length).toBe(0);
      }
    );
  });

  // --- Wrapped declarative overlay creators via test.each ---
  describe('wrapped declarative overlay creators', () => {
    const wrappedCreators: Array<{
      name: string;
      createFn: (effects: Map<string, VisualEffect>, container?: HTMLElement) => void;
      sampleEffectId: string;
    }> = [
      { name: 'erikWeihenmayer', createFn: createErikWeihenmayerOverlays, sampleEffectId: 'erikRetinoschisisIslands' },
      { name: 'marlaRunyan', createFn: createMarlaRunyanOverlays, sampleEffectId: 'marlaCentralScotoma' },
      { name: 'minkara', createFn: createMinkaraOverlays, sampleEffectId: 'minkaraEndStageComplete' },
      { name: 'joshuaMiele', createFn: createJoshuaMieleOverlays, sampleEffectId: 'joshuaCompleteBlindness' },
      { name: 'milaKunis', createFn: createMilaKunisOverlays, sampleEffectId: 'milaCompleteVision' },
    ];

    test.each(wrappedCreators)(
      '$name creates overlay when effect is enabled',
      ({ createFn, sampleEffectId }) => {
        const effects = effectsMap(makeEffect(sampleEffectId, 0.6));
        createFn(effects);

        const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
        expect(overlays.length).toBeGreaterThan(0);
      }
    );

    test.each(wrappedCreators)(
      '$name creates no overlays for empty effects map',
      ({ createFn }) => {
        createFn(new Map());

        const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
        expect(overlays.length).toBe(0);
      }
    );
  });

  // --- createAllFamousPeopleOverlays ---
  describe('createAllFamousPeopleOverlays', () => {
    it('is a function that accepts effects map and optional container', () => {
      expect(typeof createAllFamousPeopleOverlays).toBe('function');
    });

    it('does not throw with empty effects map', () => {
      expect(() => createAllFamousPeopleOverlays(new Map())).not.toThrow();
    });

    it('creates overlays when matching effects are provided', () => {
      const effects = effectsMap(
        makeEffect('completeBlindness', 0.9),
        makeEffect('galileoSectoralDefects', 0.5)
      );
      createAllFamousPeopleOverlays(effects);

      const overlays = document.querySelectorAll('[id^="visual-field-overlay-"]');
      expect(overlays.length).toBeGreaterThan(0);
    });
  });

  // --- Config data validation ---
  describe('galileoOverlays config data', () => {
    it('has 4 overlay configs', () => {
      expect(galileoOverlays.length).toBe(4);
    });

    it('includes sectoralDefects, arcuateScotomas, swissCheeseVision, chronicProgression', () => {
      const ids = galileoOverlays.map(c => c.effectId);
      expect(ids).toContain('galileoSectoralDefects');
      expect(ids).toContain('galileoArcuateScotomas');
      expect(ids).toContain('galileoSwissCheeseVision');
      expect(ids).toContain('galileoChronicProgression');
    });
  });

  describe('vedMehtaOverlays config data', () => {
    it('includes vedCompleteBlindness', () => {
      const ids = vedMehtaOverlays.map(c => c.effectId);
      expect(ids).toContain('vedCompleteBlindness');
    });
  });

  describe('joseCidOverlays config data', () => {
    it('has custom overlayId for at least one config', () => {
      const hasCustomId = joseCidOverlays.some(c => c.overlayId !== undefined);
      expect(hasCustomId).toBe(true);
    });
  });
});
