import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser, createUser, updateUser, User } from "../api";
import UserDetails from "./UserDetails";
import UserForm from "./UserForm";

interface UsersListProps {
  onLogout: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(page);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
      <h2>Users</h2>
      <button
        onClick={() =>
          setEditingUser({ first_name: "", last_name: "", email: "" })
        }
      >
        Add User
      </button>

      {loading && <p>Loading...</p>}
      {users.map((user) => (
        <div key={user.id}>
          <p>
            {user.first_name} {user.last_name} ({user.email})
          </p>
          <button onClick={() => setSelectedUser(user.id!)}>Details</button>
          <button onClick={() => setEditingUser(user)}>Edit</button>
          <button onClick={() => handleDelete(user.id!)}>Delete</button>
        </div>
      ))}

      {selectedUser && (
        <UserDetails id={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {editingUser && (
        <UserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            loadUsers();
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersList;
