'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { Tower, DoveMatch, CacheEntry } from '@/lib/types';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface DoveSearchSelectProps {
  tower: Tower;
  cacheKey: string;
  initialCache?: CacheEntry;
  onUpdate: (cacheKey: string, entry: CacheEntry, matches: DoveMatch[]) => void;
}

export function DoveSearchSelect({
  tower,
  cacheKey,
  initialCache,
  onUpdate,
}: DoveSearchSelectProps) {
  const [searchQuery, setSearchQuery] = useState(initialCache?.search || tower.place);
  const [selectedTowerId, setSelectedTowerId] = useState(initialCache?.selected || '');
  const [checkedOk, setCheckedOk] = useState(initialCache?.checked_ok || false);
  const [matches, setMatches] = useState<DoveMatch[]>([]);

  const lookupMutation = useMutation({
    mutationFn: () =>
      api.towers.doveLookup({
        place: searchQuery,
        address: tower.address,
        region: tower.region,
        tenor_raw: tower.tenor_raw,
      }),
    onSuccess: (data) => {
      setMatches(data);
      // Auto-select first match if nothing selected
      if (data.length > 0 && !selectedTowerId) {
        const firstTowerId = data[0].TowerID;
        setSelectedTowerId(firstTowerId);
        const entry: CacheEntry = {
          search: searchQuery,
          selected: firstTowerId,
          checked_ok: false,
        };
        onUpdate(cacheKey, entry, data);
      }
    },
  });

  // Load matches from cache if available
  useEffect(() => {
    if (initialCache && initialCache.selected) {
      // Trigger a search to populate matches from cache
      lookupMutation.mutate();
    }
  }, []);

  const handleSearch = () => {
    lookupMutation.mutate();
  };

  const handleSelectionChange = (towerId: string) => {
    setSelectedTowerId(towerId);
    const entry: CacheEntry = {
      search: searchQuery,
      selected: towerId,
      checked_ok: checkedOk,
    };
    onUpdate(cacheKey, entry, matches);
  };

  const handleCheckOk = () => {
    setCheckedOk(true);
    const entry: CacheEntry = {
      search: searchQuery,
      selected: selectedTowerId,
      checked_ok: true,
    };
    onUpdate(cacheKey, entry, matches);
  };

  const bestMatch = matches[0];
  const showWarning = bestMatch && bestMatch.score < 90 && !checkedOk;

  // Format display text for dropdown: "Place - Place_2" or just "Place" if Place_2 is empty
  const formatTowerDisplay = (match: DoveMatch) => {
    if (match.Place_2) {
      return `${match.Place} - ${match.Place_2}`;
    }
    return match.Place;
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tower..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button
          onClick={handleSearch}
          disabled={lookupMutation.isPending}
          size="sm"
        >
          {lookupMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="space-y-2">
          <Select value={selectedTowerId} onValueChange={handleSelectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tower" />
            </SelectTrigger>
            <SelectContent>
              {matches.map((match) => (
                <SelectItem key={match.TowerID} value={match.TowerID}>
                  {formatTowerDisplay(match)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showWarning && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-600">
                Low confidence match (Score: {bestMatch.score.toFixed(1)})
              </span>
              <Button
                onClick={handleCheckOk}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Checked OK
              </Button>
            </div>
          )}

          {checkedOk && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
          )}
        </div>
      )}

      {lookupMutation.isError && (
        <div className="text-sm text-red-600">
          Error searching for towers. Please try again.
        </div>
      )}

      {lookupMutation.isSuccess && matches.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No matches found. Try a different search term.
        </div>
      )}
    </div>
  );
}
