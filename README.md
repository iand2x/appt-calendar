# Appointment Calendar System

A modern, full-stack appointment management system built with Vue 3, TypeScript, and AWS serverless architecture. Features secure authentication, GraphQL API, and comprehensive testing infrastructure.

## 🚀 Features

- **Modern Frontend**: Vue 3 + TypeScript + Vite with Composition API
- **Responsive Design**: TailwindCSS with mobile-first approach
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **GraphQL API**: Apollo Server with AWS Lambda integration
- **Cloud Infrastructure**: AWS Lambda + API Gateway + DynamoDB
- **Comprehensive Testing**: Vitest with component and unit tests
- **CI/CD Pipeline**: GitHub Actions with automated testing and deployment
- **Type Safety**: Full TypeScript coverage with strict mode

## � Live Demo

**Frontend Application**: [http://appt-calendar.s3-website-ap-southeast-2.amazonaws.com/](http://appt-calendar.s3-website-ap-southeast-2.amazonaws.com/)

**GraphQL API Endpoint**: [https://v6lbg28im2.execute-api.ap-southeast-2.amazonaws.com/graphql](https://v6lbg28im2.execute-api.ap-southeast-2.amazonaws.com/graphql)

> 📍 **Region**: Asia Pacific (Sydney) - ap-southeast-2

## �🏗️ Architecture

### Frontend Stack

- **Vue 3**: Progressive framework with Composition API
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Vitest**: Testing framework with Vue Test Utils

### Backend Stack

- **AWS Lambda**: Serverless compute
- **API Gateway**: HTTP API with CORS support
- **DynamoDB**: NoSQL database
- **Apollo Server**: GraphQL server with AWS Lambda integration
- **Serverless Framework**: Infrastructure as Code

### Testing & CI/CD

- **Unit Tests**: Component and store testing with Vitest
- **GitHub Actions**: Automated testing and deployment
- **S3 Deployment**: Static site hosting
- **Test Coverage**: Comprehensive coverage reporting

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- AWS CLI (for deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/iand2x/appt-calendar.git
   cd appt-calendar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Run tests**

   ```bash
   # Run tests in watch mode
   npm run test

   # Run tests once
   npm run test:run

   # Generate coverage report
   npm run test:coverage

   # Run tests with UI
   npm run test:ui
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Component Tests**: Vue component testing with Vue Test Utils
- **Unit Tests**: Store and utility function testing
- **Timezone Handling**: UTC timezone enforcement for consistent CI/CD
- **Coverage Reports**: Automated coverage generation and artifact upload

### Running Tests

```bash
# Development testing (watch mode)
npm run test

# CI/CD testing (single run)
npm run test:run

# Coverage analysis
npm run test:coverage

# Interactive UI
npm run test:ui
```

## 🚀 Deployment

### Automated Deployment

The project uses GitHub Actions for automated deployment:

1. **Push to `main` branch** triggers deployment pipeline
2. **Tests run first** - deployment fails if tests don't pass
3. **Build verification** ensures production build works
4. **S3 deployment** publishes to AWS S3 with CloudFront

### Manual Deployment

1. **Configure AWS credentials**

   ```bash
   aws configure
   ```

2. **Build the project**

   ```bash
   npm run build
   ```

3. **Deploy to S3**
   ```bash
   # Sync built files to S3 bucket
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Vue components
│   │   └── __tests__/       # Component tests
│   ├── stores/              # Pinia stores
│   │   └── __tests__/       # Store tests
│   ├── pages/               # Page components
│   ├── router/              # Vue Router configuration
│   ├── services/            # API service layer
│   ├── features/            # Feature-specific types and logic
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── test/                # Test configuration
├── server/                  # AWS Lambda backend
├── .github/workflows/       # CI/CD pipelines
├── public/                  # Static assets
└── dist/                    # Production build output
```

## 🔧 Configuration

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.local
VITE_GRAPHQL_ENDPOINT=http://localhost:3001/graphql

# .env.production
VITE_GRAPHQL_ENDPOINT=https://v6lbg28im2.execute-api.ap-southeast-2.amazonaws.com/graphql
```

### GitHub Secrets

Configure these secrets in your GitHub repository:

- `AWS_S3_BUCKET`: S3 bucket name for deployment
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make changes and add tests**
4. **Run tests** (`npm run test:run`)
5. **Commit changes** (`git commit -m 'Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Create Pull Request**

### Development Guidelines

- Write tests for new features
- Follow TypeScript strict mode
- Use conventional commit messages
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 📊 Performance & Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code quality and consistency
- **Vitest**: Fast unit testing with HMR
- **Tree Shaking**: Optimized production bundles
- **Code Splitting**: Automatic route-based splitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vitest Documentation](https://vitest.dev/)
- [AWS Lambda Documentation](https://aws.amazon.com/lambda/)
