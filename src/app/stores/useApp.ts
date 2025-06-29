import { create } from "zustand";

type FileKey = "clients" | "workers" | "tasks";

export type CSVRow = Record<string, string | number | boolean | null>;

type UploadStore = {
  uploadedFiles: Record<FileKey, CSVRow[]>;
  setFileData: (type: FileKey, data: CSVRow[]) => void;
};

export const useApp = create<UploadStore>((set) => ({
  uploadedFiles: {
    clients: [],
    workers: [],
    tasks: [],
  },
  setFileData: (type, data) =>
    set((state) => ({
      uploadedFiles: {
        ...state.uploadedFiles,
        [type]: data,
      },
    })),
}));
