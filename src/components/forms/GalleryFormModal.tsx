'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Select, Textarea, Checkbox } from '@/components/ui';
import { GALLERY_CATEGORIES } from '@/lib/constants';
import type { GalleryImage } from '@/lib/types';
import { useToast } from '@/lib/context';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: GalleryImage | null;
  onSave: (data: Partial<GalleryImage>) => void;
}

type FormState = {
  url: string;
  category: 'Foundation' | 'Construction' | 'Events' | 'Final Look' | 'Ceremony';
  alt: string;
  description: string;
  date: string;
  featured: boolean;
  order: number;
};

const initialState: FormState = {
  url: '',
  category: 'Events',
  alt: '',
  description: '',
  date: '',
  featured: false,
  order: 1,
};

export function GalleryFormModal({
  isOpen,
  onClose,
  image,
  onSave,
}: GalleryFormModalProps) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (image) {
      setForm({
        url: image.url,
        category: image.category,
        alt: image.alt,
        description: image.description || '',
        date: image.date || '',
        featured: image.featured,
        order: image.order,
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [image, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.url.trim()) {
      newErrors.url = 'Image URL is required';
    }
    if (!form.alt.trim()) {
      newErrors.alt = 'Alt text is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSave(form);
      addToast({
        type: 'success',
        title: image ? 'Image updated' : 'Image added',
        message: 'The gallery image has been saved successfully.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save image. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={image ? 'Edit Gallery Image' : 'Add Gallery Image'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {image ? 'Update' : 'Add'} Image
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Image URL"
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          error={errors.url}
          placeholder="/images/gallery/photo.jpg"
          required
        />

        {form.url && (
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
          </div>
        )}

        <Input
          label="Alt Text"
          value={form.alt}
          onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
          error={errors.alt}
          placeholder="Descriptive text for the image"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as typeof form.category }))
            }
            options={GALLERY_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            required
          />
          <Input
            label="Date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            placeholder="e.g., January 2024"
          />
        </div>

        <Input
          label="Display Order"
          type="number"
          value={form.order}
          onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
          min={1}
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Brief description of the image..."
        />

        <Checkbox
          label="Mark as featured image"
          checked={form.featured}
          onChange={(checked) => setForm((f) => ({ ...f, featured: checked }))}
        />
      </div>
    </Modal>
  );
}
