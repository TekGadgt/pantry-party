import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ParticipantsListProps {
  roomId: Id<"rooms">;
}

export default function ParticipantsList({ roomId }: ParticipantsListProps) {
  const room = useQuery(api.rooms.getRoom, { roomId });

  if (!room) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Participants</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const participants = room.participants || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        👥 Participants ({participants.length})
      </h3>
      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No participants yet</p>
        ) : (
          participants.map((participant: any) => (
            <div
              key={participant._id}
              className="flex items-center gap-2 text-gray-700"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm">{participant.userName}</span>
              {participant.userId === room.ownerId && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                  Owner
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
