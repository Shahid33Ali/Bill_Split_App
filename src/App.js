import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showForm, setShowForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function addFriend() {
    setShowForm(!showForm);
  }
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowForm(false);
  }
  function handleSplit(value) {
    setFriends((friends) =>
      friends.map((e) =>
        e.id === selectedFriend.id ? { ...e, balance: e.balance + value } : e
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
          addFriend={setShowForm}
        />
        {showForm && (
          <FormAddFriend
            friends={friends}
            setFriends={setFriends}
            addFriend={addFriend}
          />
        )}
        <Button onClick={addFriend}>{showForm ? "Done" : "Add Friend"}</Button>
      </div>
      {selectedFriend && (
        <FormSplittBill
          selectedFriend={selectedFriend}
          spltFunc={handleSplit}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend, addFriend }) {
  return (
    <ul>
      {friends.map(function (friend) {
        return (
          <Friend
            friend={friend}
            id={friend.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const is = friend === selectedFriend;
  return (
    <li className={is ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button
        onClick={function () {
          onSelection(friend);
        }}
      >
        select
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ friends, setFriends, addFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function func(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID;
    setFriends([
      ...friends,
      {
        id: id,
        name: name,
        image: `${image}?u=${id}`,
        balance: 0,
      },
    ]);
    addFriend();
  }
  return (
    <form className="form-add-friend" onSubmit={func}>
      <label>Friend name</label>
      <input
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <button className="button">Add</button>
    </form>
  );
}
function FormSplittBill({ selectedFriend, spltFunc }) {
  const [bill, setBill] = useState(0);
  const [expense, setExpense] = useState(0);
  const frindExpense = bill - expense;
  const [whoisPaying, setWhosPaying] = useState("user");
  function func(e) {
    e.preventDefault();
    if (!bill || !expense) {
      return;
    }
    const value = whoisPaying === "user" ? frindExpense : -frindExpense;
    spltFunc(value);
  }
  return (
    <form className="form-split-bill" onSubmit={func}>
      <h2>Split Bill With {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      ></input>
      <label>Your Expense</label>
      <input
        type="text"
        value={expense}
        onChange={(e) => setExpense(e.target.value)}
      ></input>
      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={frindExpense}></input>
      <label>Whos payig the bill</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhosPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>.
    </form>
  );
}
