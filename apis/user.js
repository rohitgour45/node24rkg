const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;



app.use(bodyParser.json()); // Add this line to parse JSON requests


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Retrieve all users
app.get('/api/users', (req, res) => {
  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) {
      res.status(500).json({ data: '', status: 0, msg: 'error' });
      throw err;
    }
    res.json({data: result, status: 1, msg: 'success'});
  });
});

// Retrieve a specific user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  con.query("SELECT * FROM users WHERE id = ?", [userId], function (err, result, fields) {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw err;
    }
    res.json(result);
  });
});


// Update a specific user by ID
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body; // Assuming you send updated data in the request body
    console.log('updatedUserData', updatedUserData);
  
    // Construct the SET part of the query dynamically
    const setClause = Object.keys(updatedUserData).map(key => `${key} = ?`).join(', ');
    console.log('setClause', setClause);
  
    // Construct the SQL query
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
  
    // Prepare the values for the query
    const values = [...Object.values(updatedUserData), userId];
    console.log('values', values);
  
    // Execute the query
    con.query(sql, values, function (err, result) {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw err;
      }
      res.json({ data: result, status: 1 });
    });
  });
  
  
// Object.keys(updatedUserData): This part returns an array of keys from the updatedUserData object. For example, if updatedUserData is { fname: 'John', age: 25 }, this part would return ['fname', 'age'].

// .map(key => ${key} = ?): The map function is used to transform each element of the array. In this case, it transforms each key into a string of the form ${key} = ?. This results in an array like ['fname = ?', 'age = ?'].

// .join(', '): This part joins the array elements into a single string, using ', ' as the separator. So, the resulting string becomes 'fname = ?, age = ?'.




// Delete a specific user by ID
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  con.query("DELETE FROM users WHERE id = ?", [userId], function (err, result) {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw err;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
