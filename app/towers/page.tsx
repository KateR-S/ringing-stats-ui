'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DoveSearchSelect } from '@/components/dove-search-select';
import { api } from '@/lib/api';
import type { Tower, CacheEntry, CacheData, DoveMatch } from '@/lib/types';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function TowersPage() {
  const router = useRouter();
  const [towers, setTowers] = useState<Tower[]>([]);
  const [cacheKey, setCacheKey] = useState<string>('');
  const [cacheData, setCacheData] = useState<CacheData>({});
  const [towerMatches, setTowerMatches] = useState<Record<string, DoveMatch[]>>({});

  // Load cache on mount
  const cacheQuery = useQuery({
    queryKey: ['cache'],
    queryFn: api.cache.getUser,
    enabled: false, // We'll manually trigger this
  });

  const saveCacheMutation = useMutation({
    mutationFn: ({ key, entry }: { key: string; entry: CacheEntry }) =>
      api.cache.saveEntry(key, entry),
  });

  useEffect(() => {
    // Get data from sessionStorage
    if (typeof window !== 'undefined') {
      const storedCacheKey = sessionStorage.getItem('cacheKey');
      const storedTowers = sessionStorage.getItem('towers');

      if (storedCacheKey) {
        setCacheKey(storedCacheKey);
        cacheQuery.refetch();
      }

      if (storedTowers) {
        try {
          setTowers(JSON.parse(storedTowers));
        } catch (e) {
          console.error('Failed to parse towers:', e);
        }
      }

      // If no data, redirect back to upload
      if (!storedCacheKey && !storedTowers) {
        router.push('/');
      }
    }
  }, []);

  useEffect(() => {
    if (cacheQuery.data) {
      setCacheData(cacheQuery.data);
    }
  }, [cacheQuery.data]);

  const handleCacheUpdate = (key: string, entry: CacheEntry, matches: DoveMatch[]) => {
    setCacheData((prev) => ({ ...prev, [key]: entry }));
    setTowerMatches((prev) => ({ ...prev, [key]: matches }));
    saveCacheMutation.mutate({ key, entry });
  };

  // Get the selected tower ID for display
  const getSelectedTowerId = (towerUid: string): string => {
    const key = `${cacheKey}:${towerUid}`;
    return cacheData[key]?.selected || '';
  };

  if (towers.length === 0 && !cacheQuery.isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            No tower data found. Please upload a CSV file first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tower Management</h1>
        <p className="text-muted-foreground">
          Review and match towers with Dove's Guide database
        </p>
      </div>

      {cacheQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Deduplicated Towers</CardTitle>
            <CardDescription>
              {towers.length} towers found. Search and select matching Dove entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Place</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Tenor</TableHead>
                    <TableHead>Dove Tower ID</TableHead>
                    <TableHead className="w-[400px]">Dove Search & Selection</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {towers.map((tower) => (
                    <TableRow key={tower.uid}>
                      <TableCell className="font-medium">{tower.place}</TableCell>
                      <TableCell>{tower.address}</TableCell>
                      <TableCell>{tower.region}</TableCell>
                      <TableCell>
                        {tower.tenor_weight
                          ? `${tower.tenor_weight} kg`
                          : tower.tenor_raw}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {getSelectedTowerId(tower.uid) || '-'}
                      </TableCell>
                      <TableCell>
                        <DoveSearchSelect
                          tower={tower}
                          cacheKey={`${cacheKey}:${tower.uid}`}
                          initialCache={cacheData[`${cacheKey}:${tower.uid}`]}
                          onUpdate={handleCacheUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
