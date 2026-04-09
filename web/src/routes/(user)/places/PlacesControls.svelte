<script lang="ts">
  import Dropdown from '$lib/elements/Dropdown.svelte';
  import SearchBar from '$lib/elements/SearchBar.svelte';
  import { PlacesGroupBy, PlacesSortBy, placesViewSettings } from '$lib/stores/preferences.store';
  import {
    type PlacesGroupOptionMetadata,
    type PlacesSortOptionMetadata,
    collapseAllPlacesGroups,
    expandAllPlacesGroups,
    findGroupOptionMetadata,
    findSortOptionMetadata,
    getSelectedPlacesGroupOption,
    groupOptionsMetadata,
    sortOptionsMetadata,
  } from '$lib/utils/places-utils';
  import { IconButton } from '@immich/ui';
  import {
    mdiFolderArrowUpOutline,
    mdiFolderRemoveOutline,
    mdiSortAlphabeticalDescendingVariant,
    mdiSortVariant,
    mdiUnfoldLessHorizontal,
    mdiUnfoldMoreHorizontal,
  } from '@mdi/js';
  import { t } from 'svelte-i18n';
  import { fly } from 'svelte/transition';

  interface Props {
    placesGroups: string[];
    searchQuery: string;
  }

  let { placesGroups, searchQuery = $bindable() }: Props = $props();

  const handleChangeGroupBy = ({ id }: PlacesGroupOptionMetadata) => {
    $placesViewSettings.groupBy = id;
  };

  let groupIcon = $derived.by(() => {
    return selectedGroupOption.id === PlacesGroupBy.None ? mdiFolderRemoveOutline : mdiFolderArrowUpOutline; // OR mdiFolderArrowDownOutline
  });

  let selectedGroupOption = $derived(findGroupOptionMetadata($placesViewSettings.groupBy));

  let placesGroupByNames: Record<PlacesGroupBy, string> = $derived({
    [PlacesGroupBy.None]: $t('group_no'),
    [PlacesGroupBy.Country]: $t('group_country'),
  });

  const handleChangeSortBy = ({ id }: PlacesSortOptionMetadata) => {
    $placesViewSettings.sortBy = id;
  };

  let sortIcon = $derived.by(() => {
    return selectedSortOption.id === PlacesSortBy.Name ? mdiSortAlphabeticalDescendingVariant : mdiSortVariant; // OR mdiFolderArrowDownOutline
  });

  let selectedSortOption = $derived(findSortOptionMetadata($placesViewSettings.sortBy));

  let placesSortByNames: Record<PlacesSortBy, string> = $derived({
    [PlacesSortBy.Name]: $t('sort_name'),
    [PlacesSortBy.Count]: $t('sort_count'),
  });
</script>

<!-- Search Places -->
<div class="hidden md:block h-10 xl:w-60 2xl:w-80">
  <SearchBar placeholder={$t('search_places')} bind:name={searchQuery} showLoadingSpinner={false} />
</div>

<!-- Sort Places -->
<Dropdown
  position="bottom-right"
  title={$t('sort_places_by')}
  options={Object.values(sortOptionsMetadata)}
  selectedOption={selectedSortOption}
  onSelect={handleChangeSortBy}
  render={({ id, isDisabled }) => ({
    title: placesSortByNames[id],
    icon: sortIcon,
    disabled: isDisabled(),
  })}
/>

<!-- Group Places -->
<Dropdown
  position="bottom-right"
  title={$t('group_places_by')}
  options={Object.values(groupOptionsMetadata)}
  selectedOption={selectedGroupOption}
  onSelect={handleChangeGroupBy}
  render={({ id, isDisabled }) => ({
    title: placesGroupByNames[id],
    icon: groupIcon,
    disabled: isDisabled(),
  })}
/>

{#if getSelectedPlacesGroupOption($placesViewSettings) !== PlacesGroupBy.None}
  <span in:fly={{ x: -50, duration: 250 }}>
    <!-- Expand Countries Groups -->
    <div class="hidden xl:flex gap-0">
      <div class="block">
        <IconButton
          title={$t('expand_all')}
          onclick={() => expandAllPlacesGroups()}
          variant="ghost"
          color="secondary"
          shape="round"
          icon={mdiUnfoldMoreHorizontal}
          aria-label={$t('expand_all')}
        />
      </div>

      <!-- Collapse Countries Groups -->
      <div class="block">
        <IconButton
          title={$t('collapse_all')}
          onclick={() => collapseAllPlacesGroups(placesGroups)}
          variant="ghost"
          color="secondary"
          shape="round"
          icon={mdiUnfoldLessHorizontal}
          aria-label={$t('collapse_all')}
        />
      </div>
    </div>
  </span>
{/if}
