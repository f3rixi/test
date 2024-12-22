import React, { useEffect, useState } from "react";
import { fetchUser, User } from "../api";

interface UserDetailsProps {
  id: number;
  onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ id, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUser(id);
        setUser(data);
      } catch {
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <button onClick={onClose}>Close</button>
      {user && (
        <div>
          <h3>
            {user.first_name} {user.last_name}
          </h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
