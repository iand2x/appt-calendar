# 🚀 Quick Deployment Guide

## Step 1: Prepare AWS Credentials

Make sure your AWS CLI is configured:

```powershell
aws configure
```

You'll need:

- AWS Access Key ID
- AWS Secret Access Key
- Default region: `ap-southeast-2`

## Step 2: Deploy to AWS

```powershell
cd server
npm run deploy
```

This will:

- ✅ Create DynamoDB tables
- ✅ Deploy Lambda function
- ✅ Set up API Gateway
- ✅ Configure CORS

## Step 3: Seed Sample Data

After deployment completes, add sample data:

```powershell
npm run seed
```

## Step 4: Test Your API

Your GraphQL endpoint will be displayed after deployment:

```
https://YOUR-API-ID.execute-api.ap-southeast-2.amazonaws.com/graphql
```

Test with a simple query:

```graphql
query {
  hello
  appointments {
    id
    date
    dentist
    equipment
    notes
    createdBy
    createdAt
    updatedAt
  }
}
```

## Step 5: Update Frontend

Update your Vue.js app to use the new API endpoint:

```javascript
// In your Vue app
const GRAPHQL_ENDPOINT =
  "https://YOUR-API-ID.execute-api.ap-southeast-2.amazonaws.com/graphql";
```

## 🔧 Local Development

To test locally before deployment:

```powershell
npm run dev
```

Local endpoint: `http://localhost:3001/graphql`

## 💰 Estimated Costs

For a small appointment calendar app:

- **DynamoDB**: ~$1-2/month (pay per request)
- **Lambda**: ~$0.20-1/month (first 1M requests free)
- **API Gateway**: ~$1-3/month ($3.50 per million calls)

**Total: $2-6/month** for moderate usage

## 🧹 Cleanup

To remove everything:

```powershell
npm run remove
```

This will delete all AWS resources and stop billing.
