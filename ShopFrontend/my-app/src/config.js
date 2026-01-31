const apiHost = process.env.REACT_APP_API_HOST || "http://localhost:5001";

console.log("Current API Host:", apiHost);

const config = {
    apiHost
};

export default config;
