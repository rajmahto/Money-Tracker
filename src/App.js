import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const formRef = useRef(null);
  const datetimeInputRef = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = process.env.REACT_APP_API_URL + "/transactions";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Error fetching transactions: ${response.statusText}`
          );
        }

        const data = await response.json();
        setTransactions(data.reverse()); 
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const addNewTransaction = async (ev) => {
    ev.preventDefault();
    try {
      const url = process.env.REACT_APP_API_URL + "/transaction";
      const firstSpaceIndex = name.indexOf(" ");
      const price = name.substring(0, firstSpaceIndex).trim();
      const trimmedName = name.substring(firstSpaceIndex + 1).trim();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: parseFloat(price),
          name: trimmedName,
          description,
          datetime,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error adding transaction: ${response.statusText}`);
      }

      const newTransaction = await response.json();
      setTransactions((prev) => [newTransaction, ...prev]); 
      formRef.current.reset();
      setName("");
      setDatetime("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  return (
    <main>
      <h1>
        ₹{balance}
        <span>.00</span>
      </h1>
      <form ref={formRef} onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"+200 for dinner"}
          />
          <input
            ref={datetimeInputRef}
            value={datetime}
            onChange={(ev) => {
              setDatetime(ev.target.value);
              ev.target.blur();
            }}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction" key={transaction._id}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="desc">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  ₹{transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
