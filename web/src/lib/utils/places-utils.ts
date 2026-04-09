import { type AssetResponseDto } from '@immich/sdk';
import { get } from 'svelte/store';
import {
  PlacesGroupBy,
  PlacesSortBy,
  placesViewSettings,
  type PlacesViewSettings,
} from '$lib/stores/preferences.store';

/**
 * --------------
 * Places Grouping
 * --------------
 */
export interface PlacesGroup {
  id: string;
  name: string;
  places: AssetResponseDto[];
}

export interface PlacesGroupOptionMetadata {
  id: PlacesGroupBy;
  isDisabled: () => boolean;
}

export interface Place {
  city: string | null | undefined;
  state?: string | null | undefined;
  country?: string | null | undefined;
}

export const groupOptionsMetadata: PlacesGroupOptionMetadata[] = [
  {
    id: PlacesGroupBy.None,
    isDisabled: () => false,
  },
  {
    id: PlacesGroupBy.Country,
    isDisabled: () => false,
  },
];

export const findGroupOptionMetadata = (groupBy: string) => {
  // Default is no grouping
  const defaultGroupOption = groupOptionsMetadata[0];
  return groupOptionsMetadata.find(({ id }) => groupBy === id) ?? defaultGroupOption;
};

export const getSelectedPlacesGroupOption = (settings: PlacesViewSettings) => {
  const defaultGroupOption = PlacesGroupBy.None;
  const albumGroupOption = settings.groupBy ?? defaultGroupOption;

  if (findGroupOptionMetadata(albumGroupOption).isDisabled()) {
    return defaultGroupOption;
  }
  return albumGroupOption;
};

export const getDuplicateCityNames = (places: Place[]) => {
  if (!places) {
    return new Set<string>();
  }

  const duplicates = new Set<string>();
  const known = new Set<string>();

  for (const place of places) {
    if (!place.city) {
      continue;
    }
    if (known.has(place.city)) {
      duplicates.add(place.city);
    } else {
      known.add(place.city);
    }

    if (!place.country) {
      continue;
    }

    const compositeName = place.city + ', ' + place.country;
    if (known.has(compositeName)) {
      duplicates.add(compositeName);
    } else {
      known.add(compositeName);
    }
  }

  return duplicates;
};

export const getUniqueCityName = (duplicates: Set<string>, place: Place) => {
  if (!duplicates.has(place.city!)) {
    return place.city;
  }
  const compositeName = place.city + ', ' + place.country;
  if (!duplicates.has(compositeName)) {
    return compositeName;
  }
  return place.city + ', ' + place.state;
};

/**
 * ----------------------------
 * Places Sorting
 * ----------------------------
 */

export interface PlacesSortOptionMetadata {
  id: PlacesSortBy;
  isDisabled: () => boolean;
}

export const sortOptionsMetadata: PlacesSortOptionMetadata[] = [
  {
    id: PlacesSortBy.Name,
    isDisabled: () => false,
  },
  {
    id: PlacesSortBy.Count,
    isDisabled: () => false,
  },
];

export const findSortOptionMetadata = (sortBy: string) => {
  // Default is name
  const defaultSortOption = sortOptionsMetadata[0];
  return sortOptionsMetadata.find(({ id }) => sortBy === id) ?? defaultSortOption;
};

export const getSelectedPlacesSortOption = (settings: PlacesViewSettings) => {
  const defaultSortOption = PlacesSortBy.Name;
  const albumSortOption = settings.sortBy ?? defaultSortOption;

  if (findGroupOptionMetadata(albumSortOption).isDisabled()) {
    return defaultSortOption;
  }
  return albumSortOption;
};

/**
 * ----------------------------
 * Places Groups Collapse/Expand
 * ----------------------------
 */
const getCollapsedPlacesGroups = (settings: PlacesViewSettings) => {
  settings.collapsedGroups ??= {};
  const { collapsedGroups, groupBy } = settings;
  collapsedGroups[groupBy] ??= [];
  return collapsedGroups[groupBy];
};

export const isPlacesGroupCollapsed = (settings: PlacesViewSettings, groupId: string) => {
  if (settings.groupBy === PlacesGroupBy.None) {
    return false;
  }
  return getCollapsedPlacesGroups(settings).includes(groupId);
};

export const togglePlacesGroupCollapsing = (groupId: string) => {
  const settings = get(placesViewSettings);
  if (settings.groupBy === PlacesGroupBy.None) {
    return;
  }
  const collapsedGroups = getCollapsedPlacesGroups(settings);
  const groupIndex = collapsedGroups.indexOf(groupId);
  if (groupIndex === -1) {
    // Collapse
    collapsedGroups.push(groupId);
  } else {
    // Expand
    collapsedGroups.splice(groupIndex, 1);
  }
  placesViewSettings.set(settings);
};

export const collapseAllPlacesGroups = (groupIds: string[]) => {
  placesViewSettings.update((settings) => {
    const collapsedGroups = getCollapsedPlacesGroups(settings);
    collapsedGroups.length = 0;
    collapsedGroups.push(...groupIds);
    return settings;
  });
};

export const expandAllPlacesGroups = () => {
  collapseAllPlacesGroups([]);
};
