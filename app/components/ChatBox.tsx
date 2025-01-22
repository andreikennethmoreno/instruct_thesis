import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Message {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  sent_at: string;
}

const ChatBox: React.FC<{ selectedUser: User | null }> = ({ selectedUser }) => {
  const { data: session } = useSession(); // Get session data
  const [messages, setMessages] = useState<Message[]>([]); // State for messages
  const [message, setMessage] = useState<string>(""); // Track the message input

  // Polling interval (e.g., every 3 seconds)
  const POLLING_INTERVAL = 3000;

  useEffect(() => {
    if (!selectedUser || !session) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/messages?sender_id=${session.user.id}&receiver_id=${selectedUser.user_id}`
        );
        const data = await res.json();
        setMessages(data); // Set fetched messages
        console.log("Fetched messages:", data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling to fetch new messages at regular intervals
    const intervalId = setInterval(fetchMessages, POLLING_INTERVAL);

    // Clean up polling on component unmount
    return () => clearInterval(intervalId);
  }, [selectedUser, session]);

  const handleSendMessage = async () => {
    if (!session || !selectedUser || !message) return;

    const newMessage = {
      sender_id: parseInt(session.user.id),
      receiver_id: selectedUser.user_id,
      message_text: message,
    };

    console.log("sending" + message)

    try {
      // Send the new message to the backend
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      // Update the message list optimistically
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Select a user to start the chat.</p>
      </div>
    );
  }

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <div className="m-3 flex items-center space-x-2 w-full">
            <div className="avatar">
              <div className="w-11 rounded-full">
                <img
                  src={selectedUser.profile_picture_url || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  alt="Avatar"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">{selectedUser.username}</h3>
            </div>
          </div>
        </div>
      </div>

      {messages.map((msg, index) => (
        <div
          key={msg.message_id || `${msg.sender_id}-${msg.receiver_id}-${index}`}
          className={`chat px-4 ${msg.receiver_id === selectedUser.user_id ? "chat-end": "chat-start"}`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User profile"
                src={msg.receiver_id === selectedUser.user_id ? 
                  session?.user?.profile_picture_url || "default-profile-pic.jpg": 
                  selectedUser.profile_picture_url || "default-profile-pic.jpg" } // Replace with the appropriate URL for the sender
              />
            </div>
          </div>
          <div className="chat-header ">
              {msg.receiver_id === selectedUser.user_id ? "You" : selectedUser.username}
          </div>
          <div className={`chat-bubble ${msg.receiver_id === selectedUser.user_id ? "chat-bubble-secondary" : "chat-bubble"}`}>
            {msg.message_text}
          </div>
          <div className="chat-footer opacity-50">
            {new Date(msg.sent_at).toLocaleTimeString()}
          </div>
        </div>
      ))}

      <div className="navbar fixed bottom-0 bg-base-100 w-full">
        <div className="flex items-center w-[55rem] p-4">
          <textarea
            className="textarea textarea-bordered flex-grow max-w-full"
            placeholder="Write a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button className="btn btn-primary ml-2" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
