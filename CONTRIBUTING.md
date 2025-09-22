# Contributing to LINA

Thank you for your interest in contributing to LINA (Line Analysis Assistant)! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- **Ollama** (for AI functionality)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/lina.git
   cd lina
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/lina.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Initialize the database**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

7. **Verify the setup**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

## 📋 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/add-parlay-analysis`)
- **bugfix/**: Bug fixes (`bugfix/fix-odds-mapping`)
- **hotfix/**: Critical production fixes (`hotfix/security-patch`)

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write tests** for new functionality

4. **Run the test suite**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(aggregators): add injury data collection
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
test(ai-engine): add unit tests for analysis engine
```

## 🏗️ Code Standards

### TypeScript Guidelines

- **Strict Mode**: All TypeScript must compile with strict mode enabled
- **Type Safety**: Avoid `any` types; use proper type definitions
- **Interfaces**: Define interfaces for all data structures
- **Generics**: Use generics for reusable components

```typescript
// Good
interface GameData {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  startTime: Date;
}

// Avoid
const gameData: any = { /* ... */ };
```

### Code Style

We use **BiomeJS** for linting and formatting:

```bash
# Check code style
npm run lint

# Auto-fix style issues
npm run format

# Check types
npm run type-check
```

### File Organization

```
packages/
├── package-name/
│   ├── src/
│   │   ├── index.ts          # Main exports
│   │   ├── types.ts          # Type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── services/         # Business logic
│   │   └── __tests__/        # Test files
│   ├── package.json
│   └── README.md
```

### Naming Conventions

- **Files**: kebab-case (`game-mapper.ts`)
- **Directories**: kebab-case (`ai-engine/`)
- **Classes**: PascalCase (`GameMapper`)
- **Functions**: camelCase (`mapGameData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase (`GameData`)

## 🧪 Testing Guidelines

### Test Structure

```
src/
├── services/
│   └── game-mapper.ts
└── __tests__/
    ├── unit/
    │   └── game-mapper.test.ts
    ├── integration/
    │   └── api-endpoints.test.ts
    └── e2e/
        └── full-workflow.test.ts
```

### Writing Tests

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

```typescript
// Example unit test
describe('GameMapper', () => {
  it('should map API response to game entity', () => {
    const apiResponse = mockApiResponse();
    const result = GameMapper.mapToEntity(apiResponse);
    
    expect(result.id).toBe(apiResponse.game.id);
    expect(result.homeTeam.name).toBe(apiResponse.teams.home.name);
  });
});
```

### Test Commands

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Coverage Requirements

- **Minimum Coverage**: 80% for all packages
- **Critical Paths**: 95% coverage for core business logic
- **New Features**: Must include comprehensive tests

## 📦 Package Development

### Creating New Packages

1. **Create package directory**:
   ```bash
   mkdir packages/new-package
   cd packages/new-package
   ```

2. **Initialize package.json**:
   ```json
   {
     "name": "@lina/new-package",
     "version": "0.1.0",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "scripts": {
       "build": "tsc",
       "test": "vitest"
     }
   }
   ```

3. **Add TypeScript configuration**:
   ```json
   {
     "extends": "../../tools/tsconfig.json",
     "compilerOptions": {
       "outDir": "dist"
     },
     "include": ["src/**/*"]
   }
   ```

### Package Dependencies

- **Internal Dependencies**: Use workspace protocol
  ```json
  {
    "dependencies": {
      "@lina/types": "workspace:*",
      "@lina/config": "workspace:*"
    }
  }
  ```

- **External Dependencies**: Pin to specific versions
- **Dev Dependencies**: Keep in root package.json when possible

## 🔍 Code Review Process

### Submitting Pull Requests

1. **Fill out the PR template** completely
2. **Link related issues** using keywords (`Fixes #123`)
3. **Add reviewers** from the maintainer team
4. **Ensure CI passes** before requesting review

### PR Requirements

- [ ] All tests pass
- [ ] Code coverage meets requirements
- [ ] Documentation updated (if needed)
- [ ] Breaking changes documented
- [ ] Performance impact assessed

### Review Checklist

**Functionality:**
- [ ] Code solves the intended problem
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

**Code Quality:**
- [ ] Code is readable and well-documented
- [ ] Follows established patterns
- [ ] No code duplication
- [ ] Proper error handling

**Testing:**
- [ ] Adequate test coverage
- [ ] Tests are meaningful and comprehensive
- [ ] Integration tests for new features

**Performance:**
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] Memory usage is reasonable

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Try the latest version** to see if it's already fixed
3. **Gather relevant information** about your environment

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 12.0]
- Node.js version: [e.g. 18.17.0]
- npm version: [e.g. 9.6.7]
- LINA version: [e.g. 1.2.3]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** and discussions
2. **Consider the scope** and alignment with project goals
3. **Think about implementation** complexity

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

## 📚 Documentation

### Documentation Types

- **API Documentation**: JSDoc comments for all public APIs
- **User Documentation**: README files and usage guides
- **Developer Documentation**: Architecture and design decisions
- **Inline Comments**: Complex business logic explanations

### Writing Guidelines

- **Clear and Concise**: Use simple language
- **Examples**: Provide code examples where helpful
- **Up-to-Date**: Keep documentation synchronized with code
- **Accessible**: Consider different skill levels

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped appropriately
- [ ] Release notes prepared

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be patient** with newcomers
- **Be collaborative** in problem-solving

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Discord**: Real-time community chat (if available)
- **Email**: Maintainer contact for sensitive issues

## 📞 Contact

- **Maintainers**: [List of maintainer contacts]
- **Security Issues**: [Security contact email]
- **General Questions**: [General contact information]

---

Thank you for contributing to LINA! Your efforts help make sports betting analysis more accessible and intelligent for everyone.