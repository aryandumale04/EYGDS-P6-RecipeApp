const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const docClient = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = "Users";

async function createUser(email, password) {
  const params = {
    TableName: USERS_TABLE,
    Item: {
      email,
      password,
    },
  };

  return docClient.put(params).promise();
}

async function getUserByEmail(email) {
  const params = {
    TableName: USERS_TABLE,
    Key: { email },
  };

  const data = await docClient.get(params).promise();
  return data.Item;
}

module.exports = { createUser, getUserByEmail };
