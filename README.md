# Credit Rule Engine

A highly configurable rule engine for credit limit approvals in the finance sector, built with Next.js and powered by the json-rules-engine package.

## 🚀 Features

- **Facts Management**: Define and validate data types (number, string, boolean, list, function) with robust validation
- **Rules Engine**: Create complex business rules using logical operators (AND/OR) and various comparison operators
- **Outcomes Management**: Define possible results and actions for rule evaluation
- **Test Engine**: Interactive UI for testing rules with sample data and validating outcomes
- **Test Cases**: Save and manage test scenarios for regression testing
- **Modern UI**: Built with Next.js, Tailwind CSS, and Shadcn/UI components
- **Database**: PostgreSQL with Supabase for seamless data management
- **Validation**: Comprehensive client and server-side validation using Zod

## 🛠️ Tech Stack

- **Frontend/Backend**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Rule Engine**: json-rules-engine
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- **Node.js 18+** - JavaScript runtime
- **Docker** - For local Supabase instance
- **npm/pnpm** - Package manager

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd credit-rule-engine
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env.local
```

### 4. Start Local Supabase

```bash
pnpm supabase:start
# or
npm run supabase:start
```

This will:
- Start local PostgreSQL database
- Apply database migrations
- Seed sample data
- Start Supabase Studio at http://127.0.0.1:54323

### 5. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Quick Start Commands

```bash
# Complete local setup in 3 commands:
cp .env.example .env.local
pnpm supabase:start
pnpm dev
```

## 🔧 Production Setup (Optional)

For production deployment with hosted Supabase:

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** > **API** in your Supabase dashboard
3. Update `.env.local` with your production keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Database Schema

The application uses four main tables:

- **facts**: Data types and validation rules
- **outcomes**: Possible results of rule evaluation
- **rules**: Business logic definitions
- **test_cases**: Saved test scenarios

## 📚 Usage Guide

### 1. Create Facts

Navigate to **Facts** and define data elements like:

- `creditScore` (number): Applicant's credit score
- `employmentStatus` (list): ["full-time", "part-time", "unemployed"]
- `bankruptcyHistory` (boolean): Has bankruptcy history

### 2. Define Outcomes

Create outcomes in **Outcomes** such as:

```json
{
  "type": "credit_approved",
  "params": {
    "limit": 10000,
    "message": "Credit approved for $10,000 limit",
    "interestRate": 15.99
  }
}
```

### 3. Build Rules

In **Rules**, create business logic:

- **Conditions**: Use facts with operators (greaterThan, equal, in, etc.)
- **Logic**: Combine with ALL (AND) or ANY (OR)
- **Outcomes**: Link to predefined outcomes

### 4. Test Rules

Use the **Test Engine** to:

- Select a rule to test
- Input fact values through generated forms
- Run the rule engine and view results
- Save successful tests as reusable test cases

## 🎯 Sample Credit Approval Rules

The database comes pre-seeded with realistic examples:

1. **Standard Approval**: Credit score > 700 AND income > $50k AND debt ratio < 30%
2. **Auto Rejection**: Credit score < 600 OR bankruptcy history OR age < 18
3. **Manual Review**: Borderline cases requiring human evaluation
4. **High Limit**: Premium approvals for excellent credit profiles

## 🔍 Key Features in Detail

### Fact Validation

- **Type Safety**: Ensures data integrity across the system
- **List Validation**: Predefined options for categorical data
- **Operator Compatibility**: Only shows valid operators for each data type
- **Real-time Feedback**: Immediate validation in forms

### Rule Engine Integration

- **JSON Rules**: Uses industry-standard json-rules-engine
- **Flexible Conditions**: Support for nested AND/OR logic
- **Dynamic Facts**: Can handle computed values and API calls
- **Event-Driven**: Trigger multiple outcomes from single rule

### Test Engine

- **Dynamic Forms**: Auto-generates input forms based on rule facts
- **Result Visualization**: Clear display of triggered events and parameters
- **Test Case Management**: Save and replay test scenarios
- **Batch Testing**: Run all test cases for a rule

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

The application is optimized for Vercel's serverless environment.

## 🛡️ Security & Best Practices

- **Input Validation**: Comprehensive validation using Zod schemas
- **Type Safety**: Full TypeScript implementation
- **SQL Injection Protection**: Supabase handles query sanitization
- **Error Handling**: Graceful error handling throughout the application

## 🧪 Testing

The application includes:

- **Form Validation**: Client and server-side validation
- **API Testing**: Test all endpoints with sample data
- **Rule Testing**: Interactive rule testing interface
- **Error Scenarios**: Comprehensive error handling

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── facts/             # Facts management
│   ├── rules/             # Rules management
│   ├── outcomes/          # Outcomes management
│   └── test-engine/       # Rule testing interface
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/UI components
│   ├── fact-form.tsx     # Fact creation/editing
│   ├── rule-form.tsx     # Rule creation/editing
│   └── outcome-form.tsx  # Outcome creation/editing
├── lib/                   # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   ├── schemas.ts        # Zod validation schemas
│   ├── rule-engine.ts    # Rule engine service
│   └── utils.ts          # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your Supabase configuration
3. Ensure all environment variables are set
4. Check the database setup was completed successfully

## 🔮 Future Enhancements

- **Visual Rule Builder**: Drag-and-drop interface for rule creation
- **Rule Versioning**: Track changes and rollback capabilities
- **Advanced Analytics**: Rule performance and usage metrics
- **Integration APIs**: Connect with external credit agencies
- **Audit Logging**: Track all rule executions and decisions
- **Multi-tenant Support**: Support for multiple organizations

## 📊 Sample Data

The application comes with pre-configured sample data for credit approvals:

**Sample Facts:**
- Credit Score (300-850)
- Annual Income (USD)
- Employment Status (full-time, part-time, unemployed)
- Debt-to-Income Ratio (0.0-1.0)
- Bankruptcy History (boolean)

**Sample Rules:**
- Standard credit approval criteria
- Automatic rejection scenarios
- Manual review requirements
- High-limit approval conditions

This allows you to immediately test the application with realistic financial scenarios.
