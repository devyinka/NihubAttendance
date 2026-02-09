import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API;

// Fetch all sub-admins
export const useSubAdmins = () => {
  return useQuery({
    queryKey: ["subAdmins"],
    queryFn: async () => {
      const response = await axios.get(`${API}/getsubadmin`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Create sub-admin mutation
export const useCreateSubAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subAdminData) => {
      const response = await axios.post(`${API}/createSubAdmin`, subAdminData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
    },
  });
};

// Delete sub-admin mutation
export const useDeleteSubAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subadminid) => {
      const response = await axios.delete(`${API}/deletesubadmin`, {
        data: { subadminid },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
    },
  });
};
