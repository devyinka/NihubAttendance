import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API;

// Fetch daily attendance info
export const useDailyAttendance = (eventid, trackid) => {
  return useQuery({
    queryKey: ["attendance", eventid, trackid],
    queryFn: async () => {
      const response = await axios.get(`${API}/GetDailyAttendanceInfo`, {
        params: {
          eventid,
          trackid: trackid || undefined,
        },
      });
      return response.data.data;
    },
    enabled: !!eventid, // Only fetch if eventid exists
    staleTime: 2 * 60 * 1000, // 2 minutes - attendance changes frequently
  });
};

// Mark all students present mutation
export const useMarkAllPresent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ selectedeventid, selectedtrackid }) => {
      const response = await axios.post(`${API}/MarkAllPresent`, {
        eventid: selectedeventid,
        trackid: selectedtrackid,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate attendance queries for this event/track
      queryClient.invalidateQueries({
        queryKey: [
          "attendance",
          variables.selectedeventid,
          variables.selectedtrackid,
        ],
      });
    },
  });
};

// Mark individual attendance mutation
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ qrCodeData, eventid, trackid }) => {
      const response = await axios.post(`${API}/MarkAttendance`, {
        studentid: qrCodeData,
        selectedeventid: eventid,
        selectedtrackid: trackid,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all attendance queries on successful scan
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

// Get all attendance for export
export const useAttendanceExport = () => {
  return useMutation({
    mutationFn: async ({ selectedeventid, selectedtrackid }) => {
      const response = await axios.get(
        `${API}/AllAttendanceinfoforoneventoratrack`,
        {
          params: {
            selectedeventid,
            selectedtrackid: selectedtrackid || undefined,
          },
        },
      );
      return response.data;
    },
  });
};

// Delete all students by event and track mutation
export const useDeleteStudentsByEventAndTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventid, trackid }) => {
      const response = await axios.delete(
        `${API}/DeleteStudentsByEventIdAndTrackId`,
        {
          params: {
            eventid,
            trackid,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all attendance queries after deleting students
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["studentCounts"] });
    },
  });
};
