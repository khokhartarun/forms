import { useEffect, useState } from "react";
import  { CanceledError} from "./services/api-client";
import userService ,{ User } from "./services/user-service";



function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const {request , cancel}=userService.getAll <User>();  // getting data 
      request.then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancel ();
    };
  }, []);

  // delete user

  const deleteUser = (user: User) => {
    const originalUsers =[...users];
    setUsers(users.filter((u) => u.id !== user.id));

    
    userService.delete(user.id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  // add user

  const addUser= () => {
    const originalUsers= [ ...users];
    const newUser: User ={ id:0 , name: 'Tarun', username : ' Tar-1'}
    setUsers([newUser,...users ]);

    userService.create(newUser)
      .then(({data : savedUser}) => setUsers ([savedUser,...users]))
      .catch(err => {
        setError(err.message);
        setUsers(originalUsers);
      });

  }
  // update user
  const updateUser = (user :User) => { 
    const originalUsers = [ ...users]
    const updatedUser = { ...user, name: user.name + '  -- User Updated'}
    setUsers(users.map (u=> u.id === user.id ? updatedUser : u))
    
    userService.update(updatedUser)
      .catch(err => {
        setError ( err.message);
        setUsers (originalUsers);

      })
  }

  return (
    <div className="container" style={{ maxWidth: "400px" }}>
    {error && <p className="text-danger">{error}</p>}
    {isLoading && <div className="spinner-border"></div>}
    <button className="btn btn-primary mb-3" onClick={addUser}>
      Add
    </button>
    <ul className="list-group">
      {users.map((user) => (
        <li
          key={user.id}
          className="list-group-item d-flex justify-content-between align-items-left"
        >
          {user.name}
          <div>
            <button
              className="btn btn-outline-secondary btn-sm mx-1"
              onClick={() => updateUser(user)}
            >
              Update
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => deleteUser(user)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default App;
