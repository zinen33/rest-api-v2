---

# Open Source REST API  
Created by **Lance Ajiro**  

A lightweight and customizable open-source REST API framework for developers.  

---

## Adding an API Endpoint  

To add a new API endpoint, use the following template:  

```javascript
exports.config = {
    name: 'example', // The name of your API
    author: 'Your_Name', // Your name or alias
    description: 'API Description', // Brief description of your API
    category: 'utility', // The category of your API (e.g., utility, data, etc.)
    link: ['/example?q=test'] // Example link to access your API
};

exports.initialize = async function ({ req, res }) {
    // Your API logic here
};
```

### Example  
Here's how you might implement a sample API:  

```javascript
exports.config = {
    name: 'helloWorld',
    author: 'Lance Ajiro',
    description: 'Returns a Hello World message',
    category: 'example',
    link: ['/hello']
};

exports.initialize = async function ({ req, res }) {
    res.json({ message: 'Hello, World!' });
};
```

---

## Important Notes  

- **Automatic Linking**:  
  You don't need to manually add the API link to the HTML. The framework automatically displays it on the website.  

- **Show Some Love**:  
  If you find this project useful, please don't forget to give it a ⭐ when you fork or use it!  

---

Feel free to contribute and improve this project. Happy coding!  

--- 
