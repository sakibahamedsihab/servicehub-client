"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { CreateServiceInput } from "@/schemas/service.schema";
import { servicesApi } from "@/lib/services";
import { toast } from "sonner";

interface ServiceFormProps {
  initialData?: any;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes?.toString() || "");
  const [imageUrl, setImageUrl] = useState(initialData?.images?.[0] || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CreateServiceInput = {
        title,
        description,
        categoryId,
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes, 10),
        images: imageUrl ? [imageUrl] : [],
        isAvailable: isActive,
      };

      if (initialData) {
        await servicesApi.update(initialData._id, payload);
        toast.success("Service updated successfully!");
      } else {
        await servicesApi.create(payload);
        toast.success("Service created successfully!");
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 md:p-10">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200 text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Service Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Premium Home Deep Cleaning"
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what is included in this service..."
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none resize-y focus:border-orange-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none bg-white focus:border-orange-500 transition-colors"
          >
            <option value="" disabled>Select a category</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Moving">Moving</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none focus:border-orange-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Temporary: Paste a direct link to an image.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Price ($) *</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="99.99"
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Duration (Minutes) *</label>
          <input
            type="number"
            required
            min="1"
            step="1"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="120"
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 accent-orange-500 cursor-pointer"
          />
          <label htmlFor="isActive" className="text-base text-gray-900 font-medium cursor-pointer">
            Service is active and available for booking
          </label>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-end gap-4">
        <Button variant="secondary" type="button" onClick={() => router.push("/dashboard/services")} disabled={loading} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          {initialData ? "Save Changes" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
