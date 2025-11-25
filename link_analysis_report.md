# Famous People Link Analysis Report

## People WITHOUT Links in Their Bio

The following people do not have any hyperlink in their description:

1. **Mila Kunis** (mila) - No link
2. **Dame Judi Dench** (judi) - No link
3. **Bono** (bono) - No link
4. **Georgia O'Keeffe** (georgia) - No link
5. **Ella Fitzgerald** (ella) - No link
6. **Sugar Ray Leonard** (sugar) - No link
7. **Stephen Curry** (stephen) - No link
8. **Allan Pineda Lindo (Apl.de.ap)** (allan) - No link
9. **Fetty Wap** (fetty) - No link
10. **Slick Rick** (slick) - No link
11. **Abraham Nemeth** (abraham) - No link
12. **Sharon Stone** (sharon) - No link
13. **Daredevil / Matt Murdock** (daredevil) - No link

## People with Links That Won't Work (Domain Not Recognized)

The following people have links in their descriptions, but the domains are NOT recognized in the `parseDescriptionWithLinks` function, so they won't be converted to clickable links:

1. **Murphy Mason** (murphyMason) - Description says "Learn more at in-the-dark-cw.fandom.com" but this domain is not in the recognized domains list
2. **Fujitora (Issho)** (fujitora) - Description says "Learn more at onepiece.fandom.com" but this domain is not in the recognized domains list
3. **Heather Hutchison** (heatherHutchison) - Description says "Visit her website at heather-hutchison.com" but this domain is not in the recognized domains list
4. **John Bramblitt** (johnBramblitt) - Description says "Visit his website at bramblitt.com" but this domain is not in the recognized domains list

## People with Links That May Need Verification

The following people have links that should work, but may need verification:

1. **John Kay** (johnKay) - Description says "Learn more at steppenwolf.com/pages/john-kay-biography" 
   - The domain "steppenwolf.com" IS recognized, but the regex uses word boundaries, so "steppenwolf.com/pages/john-kay-biography" should match "steppenwolf.com" correctly. However, the full URL path might not be preserved - it will link to "https://steppenwolf.com/" instead of the full path.

2. **Wanda Díaz-Merced** (wanda) - Description says "Learn more at en.wikipedia.org/wiki/Wanda_D%C3%ADaz-Merced"
   - The domain "en.wikipedia.org" IS recognized and uses `getWikipediaUrl(personId)` which should return the correct Wikipedia URL for wanda. This should work correctly.

## Summary

### Total People Without Working Links: 17

**Completely missing links (13):**
- mila, judi, bono, georgia, ella, sugar, stephen, allan, fetty, slick, abraham, sharon, daredevil

**Links that won't work because domain not recognized (4):**
- murphyMason (in-the-dark-cw.fandom.com)
- fujitora (onepiece.fandom.com)
- heatherHutchison (heather-hutchison.com)
- johnBramblitt (bramblitt.com)

### Links That May Need Verification:

- johnKay (steppenwolf.com path - may link to homepage instead of biography page)
- wanda (wikipedia path - should work correctly via getWikipediaUrl function)

## Recommended Actions

1. Add missing domains to the `websiteMap` in `famousPeopleUtils.tsx`:
   - `in-the-dark-cw.fandom.com` for murphyMason
   - `onepiece.fandom.com` for fujitora
   - `heather-hutchison.com` for heatherHutchison
   - `bramblitt.com` for johnBramblitt

2. Consider adding links to the 13 people who don't have any links in their descriptions.

3. For johnKay, consider updating the description to just say "steppenwolf.com" or add a specific URL mapping in the websiteMap.

