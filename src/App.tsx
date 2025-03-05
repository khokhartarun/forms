import { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  username: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    axios
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (nameRef.current && usernameRef.current) {
      if (editingUser) {
        setUsers(users.map(user => user.id === editingUser.id ? { ...user, name: nameRef.current!.value, username: usernameRef.current!.value } : user));
        setEditingUser(null);
      } else {
        const newUser: User = {
          id: users.length + 1, // Generate a new ID
          name: nameRef.current.value,
          username: usernameRef.current.value,
        };
        setUsers([...users, newUser]);
      }
      if (idRef.current) idRef.current.value = "";
      nameRef.current.value = "";
      usernameRef.current.value = "";
      setShowForm(false); // Hide form after adding/updating user
    }
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleUpdate = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    if (idRef.current && nameRef.current && usernameRef.current) {
      idRef.current.value = user.id.toString();
      nameRef.current.value = user.name;
      usernameRef.current.value = user.username;
    }
  };

  return (
    <div>
      <h2>Users Table</h2>
      
      <button onClick={() => { setShowForm(true); setEditingUser(null); }}>Add User</button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          {editingUser && <input type="text" placeholder="ID" ref={idRef} readOnly />}
          <input type="text" placeholder="Enter Name" ref={nameRef} required />
          <input type="text" placeholder="Enter Username" ref={usernameRef} required />
          <button type="submit">{editingUser ? "Update" : "Submit"}</button>
        </form>
      )}
      
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!isLoading && !error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => handleUpdate(user)}>Update</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;