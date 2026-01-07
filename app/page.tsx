'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { FileUpload } from '@/components/file-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.towers.deduplicate(file),
    onSuccess: (data) => {
      // Store the cache key and towers for later use
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cacheKey', data.cache_key);
        sessionStorage.setItem('towers', JSON.stringify(data.towers));
        sessionStorage.setItem('uploadedFile', selectedFile?.name || '');
      }
      router.push('/towers');
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    uploadMutation.mutate(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Tower Data</h1>
        <p className="text-muted-foreground">
          Upload a CSV file containing tower information to deduplicate and match with Dove's Guide
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV File Requirements</CardTitle>
          <CardDescription>
            Your CSV file must contain the following columns:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><code className="bg-muted px-1.5 py-0.5 rounded">bells_type</code> - Type of bells</li>
            <li><code className="bg-muted px-1.5 py-0.5 rounded">place</code> - Location name</li>
            <li><code className="bg-muted px-1.5 py-0.5 rounded">address</code> - Full address</li>
            <li><code className="bg-muted px-1.5 py-0.5 rounded">region</code> - Geographic region</li>
            <li><code className="bg-muted px-1.5 py-0.5 rounded">tenor</code> - Tenor weight</li>
          </ul>
        </CardContent>
      </Card>

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

      {uploadMutation.isSuccess && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            File uploaded successfully. Redirecting to towers page...
          </AlertDescription>
        </Alert>
      )}

      {uploadMutation.isPending ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-lg">Processing {selectedFile?.name}...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <FileUpload onFileSelect={handleFileSelect} />
      )}
    </div>
  );
}
