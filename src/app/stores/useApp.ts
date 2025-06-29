import { create } from "zustand";

type FileKey = "clients" | "workers" | "tasks";

type UploadStore = {
  uploadedFiles: Record<FileKey, any[]>;
  setFileData: (type: FileKey, data: any[]) => void;
};

export const useApp = create<UploadStore>((set) => ({
  uploadedFiles: {
    clients: [],
    workers: [],
    tasks: [],
  },
  setFileData: (type, data) =>
    set((state) => ({
      uploadedFiles: { ...state.uploadedFiles, [type]: data },
    })),
}));
