const axios = require("axios");

async function registerAdmin() {
  try {
    const response = await axios.post("http://localhost:4000/admin-register", {
      username: "admin",
      password: "A264156254"
    });

    console.log(response.data);
  } catch (error) {
    console.error("註冊失敗:", error.response ? error.response.data : error.message);
  }
}

registerAdmin();
