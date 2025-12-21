import React, { useState } from "react";
// import {
//   useGetSupportTicketsQuery,
//   useUpdateTicketStatusMutation,
// } from "../../features/support/supportTicketApiSlice";
import {useGetSupportTicketsQuery, useUpdateTicketStatusMutation } from "../features/kyc/suppport";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  SOLVED: "bg-blue-100 text-blue-800",
  ON_HOLD: "bg-gray-100 text-gray-800",
};

const SupportTickets = () => {
  const { data, isLoading, isError } = useGetSupportTicketsQuery();
  const [updateTicketStatus, { isLoading: updating }] =
    useUpdateTicketStatusMutation();

  const [remark, setRemark] = useState("");

  const handleStatusChange = async (ticketId, status) => {
    if (!remark.trim()) {
      alert("Please add admin remark");
      return;
    }

    try {
      await updateTicketStatus({
        ticketId,
        status,
        adminRemark: remark,
      }).unwrap();

      setRemark("");
      alert(`Ticket marked as ${status}`);
    } catch (error) {
      alert("Failed to update ticket");
    }
  };

  if (isLoading) return <p>Loading tickets...</p>;
  if (isError) return <p>Failed to load tickets</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Ticket ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.map((ticket) => (
              <tr key={ticket._id} className="border-t">
                <td className="p-3">{ticket.ticketId}</td>
                <td className="p-3">{ticket.userEmail}</td>
                <td className="p-3">{ticket.subject}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[ticket.status]
                      }`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      handleStatusChange(ticket._id, "APPROVED")
                    }
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    disabled={updating}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(ticket._id, "REJECTED")
                    }
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    disabled={updating}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(ticket._id, "SOLVED")
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    disabled={updating}
                  >
                    Solve
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(ticket._id, "ON_HOLD")
                    }
                    className="px-3 py-1 bg-gray-600 text-white rounded"
                    disabled={updating}
                  >
                    Hold
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Remark */}
      <div className="mt-4">
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Admin remark..."
          className="w-full border rounded p-3"
        />
      </div>
    </div>
  );
};

export default SupportTickets;
