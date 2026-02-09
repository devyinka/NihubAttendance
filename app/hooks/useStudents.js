import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API;

// Fetch student info for event/track
export const useStudentInfo = (selectedeventid, selectedtrackid) => {
  return useQuery({
    queryKey: ["students", selectedeventid, selectedtrackid],
    queryFn: async () => {
      const response = await axios.post(`${API}/getStudentinfo`, {
        selectedeventid,
        selectedtrackid: selectedtrackid || undefined,
      });
      return response.data.data;
    },
    enabled: !!selectedeventid,
    staleTime: 3 * 60 * 1000,
  });
};

// Fetch students by event
export const useStudentsByEvent = (eventid) => {
  return useQuery({
    queryKey: ["studentsByEvent", eventid],
    queryFn: async () => {
      const response = await axios.get(`${API}/getStudentbyevent`, {
        params: { eventid },
      });
      return response.data.data;
    },
    enabled: !!eventid,
    staleTime: 3 * 60 * 1000,
  });
};
