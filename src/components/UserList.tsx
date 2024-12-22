import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser, User } from "../api";
import UserDetails from "./UserDetails";
import UserForm from "./UserForm";

interface UsersListProps {
  onLogout: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchUsers(page);
      setUsers(response.data); 
      setTotalPages(response.total_pages); 
      setError("");
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      loadUsers(); 
    } catch {
      setError("Failed to delete user.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
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

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <UserDetails id={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {editingUser && (
        <UserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
};

export default UsersList;
