'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileUpload } from '@/components/file-upload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import type { Performance } from '@/lib/types';
import { AlertCircle, Loader2, Search } from 'lucide-react';

export default function PerformancesPage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.performances.parse(file),
    onSuccess: (data) => {
      // Extract performances array from response object
      if (data && typeof data === 'object' && 'performances' in data && Array.isArray(data.performances)) {
        setPerformances(data.performances);
      } else if (Array.isArray(data)) {
        setPerformances(data);
      } else {
        console.error('Unexpected response format:', typeof data, data);
        setPerformances([]);
      }
    },
  });

  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file);
  };

  // Get column headers from first performance
  const columns = performances.length > 0 ? Object.keys(performances[0]) : [];

  // Filter performances based on search term
  const filteredPerformances = performances.filter((perf) =>
    Object.values(perf).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Performances</h1>
        <p className="text-muted-foreground">
          Upload and view parsed performance data
        </p>
      </div>

      {uploadMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>
            {uploadMutation.error instanceof Error
              ? uploadMutation.error.message
              : 'Failed to upload file. Please check the file format and try again.'}
          </AlertDescription>
        </Alert>
      )}

      {performances.length === 0 ? (
        uploadMutation.isPending ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-lg">Processing file...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <FileUpload
            onFileSelect={handleFileSelect}
            label="Upload Performances CSV"
          />
        )
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Parsed Performances</CardTitle>
            <CardDescription>
              {filteredPerformances.length} of {performances.length} performances
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search performances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column} className="whitespace-nowrap">
                        {column.replace(/_/g, ' ').toUpperCase()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPerformances.map((performance, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column} className="whitespace-nowrap">
                          {String(performance[column] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredPerformances.length === 0 && searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                No performances found matching "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
