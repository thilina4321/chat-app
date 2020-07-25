const users = [];

const addUsers = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!name || !room) {
    return {
      error: "User name and room name is required",
    };
  }

  const existingUser = users.find((user) => {
    return user.room == room && user.name == name;
  });

  if (existingUser) {
    return {
      error: "User name already taken",
    };
  }

  const user = { id: id, name: name, room: room };
  users.push(user);

  return {user:user};
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id == id);

  if (userIndex >= 0) {
    return users.splice(userIndex, 1)[0];
  }
  return undefined;
};

const getUser = (id) => {
  return users.find((user) => user.id == id);
};

const getUserInRoom = (roomName) => {
  return users.filter((user) => user.room == roomName);
};


module.exports = {
    addUsers,
    removeUser,
    getUser,
    getUserInRoom
}