'use client';

import { useRef, useState, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

/**
 * Drag-and-drop avatar uploader. Uploads to the `avatars` Storage bucket
 * (`avatars/{userId}/...`) and returns the public URL via onUploaded.
 */
export default function AvatarUpload({
  userId,
  currentUrl,
  onUploaded,
}: {
  userId: string;
  currentUrl: string | null;
  onUploaded: (publicUrl: string) => void;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB.');
      return;
    }

    const supabase = createClient();
    const path = `${userId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    setUploading(true);
    const { error } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    setUploading(false);

    if (error) {
      console.error('[AvatarUpload]', error);
      toast.error('Upload failed. Please try again.');
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    toast.success('Avatar updated.');
    onUploaded(data.publicUrl);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="flex items-start gap-6">
      {/* Current avatar */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/10 text-slate-400">
            No photo
          </div>
        )}
        {currentUrl && (
          <button
            type="button"
            onClick={() => onUploaded('')}
            aria-label="Remove avatar"
            className="absolute right-0 top-0 rounded-full bg-slate-900/80 p-1 text-slate-300 transition hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Dropzone */}
      <motion.div
        animate={{ scale: dragging ? 1.02 : 1 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors',
          dragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : 'border-white/15 bg-white/5 hover:border-white/25'
        )}
      >
        <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
        <p className="text-sm font-medium text-slate-200">
          {uploading ? 'Uploading…' : 'Drag & drop or click to upload'}
        </p>
        <p className="mt-1 text-xs text-slate-500">JPG, PNG or WebP · max 2 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = '';
          }}
        />
      </motion.div>
    </div>
  );
}
