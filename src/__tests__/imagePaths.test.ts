import {
  PLACEHOLDER_IMAGE,
  getPeopleImagePath,
  getPersonImagePath,
  getPersonSecondaryImages,
} from '../utils/imagePaths';
import { personData } from '../data/famousPeople';

describe('Image Paths', () => {
  describe('PLACEHOLDER_IMAGE', () => {
    test('is a data URI SVG', () => {
      expect(PLACEHOLDER_IMAGE).toMatch(/^data:image\/svg\+xml,/);
    });

    test('contains "Image Not Found" text', () => {
      const decoded = decodeURIComponent(PLACEHOLDER_IMAGE);
      expect(decoded).toContain('Image Not Found');
    });
  });

  describe('getPeopleImagePath', () => {
    test('returns path with /images/people/ prefix', () => {
      const path = getPeopleImagePath('test-image.webp');
      expect(path).toContain('/images/people/test-image.webp');
    });

    test('handles filenames with special characters', () => {
      const path = getPeopleImagePath('Chirrut-Îmwe.webp');
      expect(path).toContain('Chirrut-Îmwe.webp');
    });
  });

  describe('getPersonImagePath', () => {
    test('returns correct path for known person IDs', () => {
      const path = getPersonImagePath('milton');
      expect(path).toContain('/images/people/john-milton.webp');
    });

    test('returns placeholder for unknown person ID', () => {
      const path = getPersonImagePath('nonexistent-person-id');
      expect(path).toBe(PLACEHOLDER_IMAGE);
    });

    test('returns non-placeholder for all persons in personData', () => {
      const missingImages: string[] = [];
      for (const personId of Object.keys(personData)) {
        const path = getPersonImagePath(personId);
        if (path === PLACEHOLDER_IMAGE) {
          missingImages.push(personId);
        }
      }
      expect(missingImages).toEqual([]);
    });
  });

  describe('image file extensions', () => {
    test('every person image uses .webp or .gif extension', () => {
      const invalidExtensions: string[] = [];
      for (const personId of Object.keys(personData)) {
        const path = getPersonImagePath(personId);
        if (path !== PLACEHOLDER_IMAGE) {
          if (!path.endsWith('.webp') && !path.endsWith('.gif')) {
            invalidExtensions.push(`${personId}: ${path}`);
          }
        }
      }
      expect(invalidExtensions).toEqual([]);
    });
  });

  describe('getPersonSecondaryImages', () => {
    test('returns empty array for person with no secondary images', () => {
      const images = getPersonSecondaryImages('nonexistent-person');
      expect(images).toEqual([]);
    });

    test('returns array for person with single secondary image', () => {
      const images = getPersonSecondaryImages('christine');
      expect(images.length).toBe(1);
      expect(images[0].filename).toBeTruthy();
    });

    test('returns array for person with multiple secondary images', () => {
      const images = getPersonSecondaryImages('fredRogers');
      expect(images.length).toBeGreaterThan(1);
      for (const img of images) {
        expect(img.filename).toBeTruthy();
      }
    });

    test('secondary image entries have valid filenames', () => {
      // Check all known secondary images
      const personsWithSecondary = ['christine', 'lucy', 'paul', 'haben', 'molly', 'fredRogers'];
      for (const personId of personsWithSecondary) {
        const images = getPersonSecondaryImages(personId);
        expect(images.length).toBeGreaterThan(0);
        for (const img of images) {
          expect(img.filename).toMatch(/\.(webp|gif|png|jpg)$/);
        }
      }
    });
  });
});
