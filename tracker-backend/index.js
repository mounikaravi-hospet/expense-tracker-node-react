import express from "express";
import cors from "cors";
import { PORT, db } from "./config.js";
import { sessionConfig } from "./session.js";
import https from "https";
import fs from "fs";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(sessionConfig);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: {
        name: req.session.user.name,
        email: req.session.user.email,
        password: req.session.user.password,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.post("/register", (req, res) => {
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [req.body.name, req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error registering user");
      }
      res.status(201).send("User registered successfully");
    }
  );
});

app.post("/login", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        // console.error(err);
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        const user = result[0];
        // res.status(200).send(result);
        req.session.user = {
          email: user.email,
          name: user.name,
          password: user.password,
          id: user.id,
        };

        res.status(200).send({
          message: "Login successful",
          user: {
            email: user.email,
            name: user.name,
            password: user.password,
            id: user.id,
          },
        });
      } else {
        res.status(401).send("Invalid credentials");
      }
    }
  );
});

//edit profile route
app.put("/edit-profile", (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.session.user.id;

  // Begin a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err);
      return res.status(500).send("Transaction failed to start");
    }

    // Update the user profile
    db.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, userId],
      (err, result) => {
        if (err) {
          console.error("Error updating profile:", err);
          return db.rollback(() => {
            res.status(500).send("Error updating profile");
          });
        }

        // Update the email in transactions
        db.query(
          "UPDATE transactions SET email = ? WHERE user_id = ?",
          [email, userId],
          (err, result) => {
            if (err) {
              console.error("Error updating transactions:", err);
              return db.rollback(() => {
                res.status(500).send("Error updating transactions");
              });
            }

            // Commit the transaction if both updates succeed
            db.commit((err) => {
              if (err) {
                console.error("Transaction commit error:", err);
                return db.rollback(() => {
                  res.status(500).send("Transaction failed");
                });
              }

              // Update session with new details
              req.session.user = { ...req.session.user, name, email, password };
              res.status(200).send(result);
            });
          }
        );
      }
    );
  });
});

//logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).send("Logged out successfully");
  });
});

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send("Not authenticated");
  }
  next();
};

//Get transactions for a user using email
app.get("/transactions/:email", requireAuth, (req, res) => {
  const email = req.params.email;
  db.query(
    "SELECT * FROM transactions WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error fetching transactions");
      }
      res.status(200).json(result);
    }
  );
});

//Add transaction for a user using email
app.post("/add-transaction", requireAuth, (req, res) => {
  const { category, amount, type, date, notes } = req.body;
  const email = req.session.user.email;
  const userId = req.session.user.id;
  db.query(
    "INSERT INTO transactions (email, user_id ,category, amount, type, date, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [email, userId, category, amount, type, date, notes],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error adding transaction");
      }
      res.status(201).json(result);
    }
  );
});

app.delete("/delete-transaction/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  db.query("DELETE FROM transactions WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting transaction");
    }
    res.status(200).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// const options = {
//   key:  fs.readFileSync("./localhost-key.pem"),
//   cert: fs.readFileSync("./localhost.pem"),
// };

// // Start HTTPS instead of plain HTTP
// https
//   .createServer(options, app)
//   .listen(PORT, () => {
//     console.log(`HTTPS server running on port ${PORT}`);
//   })
