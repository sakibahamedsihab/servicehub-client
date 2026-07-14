"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { servicesApi } from "@/lib/services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface DeleteServiceButtonProps {
  serviceId: string;
}

export function DeleteServiceButton({ serviceId }: DeleteServiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await servicesApi.delete(serviceId);
      toast.success("Service deleted successfully");
      setShowModal(false);
      router.refresh(); // Refresh the page to reflect the deletion
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service");
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 text-gray-600 border border-gray-200 transition-colors hover:bg-gray-100 hover:text-red-500 disabled:opacity-50"
        title="Delete Service"
      >
        <Trash2 size={16} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 text-left">
            <div className="p-6 md:p-8 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-5 mx-auto md:mx-0">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">Delete Service?</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to delete this service? This action cannot be undone and will permanently remove it from your listings.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                  loading={loading}
                  className="w-full sm:w-auto"
                >
                  Yes, Delete Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
