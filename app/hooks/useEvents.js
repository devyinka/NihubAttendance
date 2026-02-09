import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API;

// Fetch all events
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await axios.get(`${API}/GetEvents`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch student count for a specific event
export const useStudentCount = (eventid) => {
  return useQuery({
    queryKey: ["studentCount", eventid],
    queryFn: async () => {
      const response = await axios.get(`${API}/getnumberofstudentsonevent`, {
        params: { eventid },
      });
      return response.data.studentcount;
    },
    enabled: !!eventid, // Only run if eventid exists
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Fetch student counts for multiple events (optimized parallel fetch)
export const useStudentCounts = (eventIds) => {
  return useQuery({
    queryKey: ["studentCounts", eventIds],
    queryFn: async () => {
      const promises = eventIds.map((id) =>
        axios
          .get(`${API}/getnumberofstudentsonevent`, {
            params: { eventid: id },
          })
          .then((resp) => ({ eventId: id, count: resp.data.studentcount }))
          .catch(() => ({ eventId: id, count: 0 })),
      );
      const results = await Promise.all(promises);
      return results.reduce((acc, { eventId, count }) => {
        acc[eventId] = count;
        return acc;
      }, {});
    },
    enabled: eventIds && eventIds.length > 0,
    staleTime: 3 * 60 * 1000,
  });
};

// Update event mutation
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const response = await axios.put(`${API}/UpdateEvent`, eventData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Update event status mutation
export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventid, status }) => {
      const response = await axios.put(`${API}/UpdateEventStatus`, {
        eventid,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Delete event mutation
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventid) => {
      const response = await axios.delete(`${API}/DeleteEvent`, {
        data: { eventid },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["studentCounts"] });
    },
  });
};

// Delete track mutation
export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventid, trackid }) => {
      const response = await axios.delete(`${API}/DeleteTrack`, {
        data: { eventid, trackid },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Update track mutation
export const useUpdateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventid, trackid, trackName, trackabrevation }) => {
      const response = await axios.put(`${API}/UpdateEventTracks`, {
        eventid,
        trackid,
        trackName,
        trackabrevation,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
