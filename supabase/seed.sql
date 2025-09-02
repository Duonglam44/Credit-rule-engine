
-- Insert sample data for credit approval use case
INSERT INTO facts (name, description, type, options) VALUES
('creditScore', 'Applicant credit score (300-850)', 'number', NULL),
('annualIncome', 'Annual income in USD', 'number', NULL),
('debtToIncomeRatio', 'Debt-to-income ratio (0.0-1.0)', 'number', NULL),
('employmentStatus', 'Current employment status', 'list', ARRAY['full-time', 'part-time', 'unemployed', 'self-employed']),
('bankruptcyHistory', 'Has bankruptcy history', 'boolean', NULL),
('age', 'Applicant age in years', 'number', NULL),
('existingCreditLines', 'Number of existing credit lines', 'number', NULL),
('monthsAtCurrentJob', 'Months at current job', 'number', NULL);

-- Insert sample outcomes
INSERT INTO outcomes (type, params) VALUES
('credit_approved', '{"limit": 10000, "message": "Credit approved for $10,000 limit", "interestRate": 15.99}'),
('credit_approved_low', '{"limit": 5000, "message": "Credit approved for $5,000 limit", "interestRate": 18.99}'),
('credit_rejected', '{"message": "Credit application rejected", "reason": "Does not meet minimum requirements"}'),
('manual_review', '{"message": "Application requires manual review", "reason": "Borderline case"}'),
('high_limit_approved', '{"limit": 25000, "message": "High limit credit approved", "interestRate": 12.99}');

-- Insert sample rules using separate statements to avoid CTE complexity
-- Rule 1: Standard approval criteria
INSERT INTO rules (name, json_conditions, event_id)
SELECT 
    'Standard Credit Approval',
    '{
        "all": [
            {"fact": "creditScore", "operator": "greaterThan", "value": 700},
            {"fact": "annualIncome", "operator": "greaterThan", "value": 50000},
            {"fact": "debtToIncomeRatio", "operator": "lessThan", "value": 0.3},
            {"fact": "employmentStatus", "operator": "in", "value": ["full-time", "part-time"]},
            {"fact": "bankruptcyHistory", "operator": "equal", "value": false}
        ]
    }'::jsonb,
    id
FROM outcomes 
WHERE type = 'credit_approved' 
LIMIT 1;

-- Rule 2: Automatic rejection criteria
INSERT INTO rules (name, json_conditions, event_id)
SELECT 
    'Automatic Rejection',
    '{
        "any": [
            {"fact": "creditScore", "operator": "lessThan", "value": 600},
            {"fact": "bankruptcyHistory", "operator": "equal", "value": true},
            {"fact": "age", "operator": "lessThan", "value": 18}
        ]
    }'::jsonb,
    id
FROM outcomes 
WHERE type = 'credit_rejected' 
LIMIT 1;

-- Rule 3: Manual review criteria
INSERT INTO rules (name, json_conditions, event_id)
SELECT 
    'Manual Review Required',
    '{
        "all": [
            {"fact": "creditScore", "operator": "greaterThanInclusive", "value": 600},
            {"fact": "creditScore", "operator": "lessThanInclusive", "value": 700},
            {"fact": "annualIncome", "operator": "greaterThan", "value": 30000}
        ]
    }'::jsonb,
    id
FROM outcomes 
WHERE type = 'manual_review' 
LIMIT 1;

-- Rule 4: High limit approval
INSERT INTO rules (name, json_conditions, event_id)
SELECT 
    'High Limit Approval',
    '{
        "all": [
            {"fact": "creditScore", "operator": "greaterThan", "value": 750},
            {"fact": "annualIncome", "operator": "greaterThan", "value": 100000},
            {"fact": "debtToIncomeRatio", "operator": "lessThan", "value": 0.2},
            {"fact": "employmentStatus", "operator": "equal", "value": "full-time"}
        ]
    }'::jsonb,
    id
FROM outcomes 
WHERE type = 'high_limit_approved' 
LIMIT 1;

-- Insert some sample test cases
INSERT INTO test_cases (rule_id, input_facts, expected_output) VALUES
-- Test case for standard approval rule
((SELECT id FROM rules WHERE name = 'Standard Credit Approval' LIMIT 1),
 '{"creditScore": 720, "annualIncome": 75000, "debtToIncomeRatio": 0.25, "employmentStatus": "full-time", "bankruptcyHistory": false}',
 '{"approved": true, "rule": "Standard Credit Approval"}'),

-- Test case for rejection rule
((SELECT id FROM rules WHERE name = 'Automatic Rejection' LIMIT 1),
 '{"creditScore": 580, "annualIncome": 45000, "debtToIncomeRatio": 0.4, "employmentStatus": "full-time", "bankruptcyHistory": false}',
 '{"approved": false, "rule": "Automatic Rejection"}'),

-- Test case for manual review rule
((SELECT id FROM rules WHERE name = 'Manual Review Required' LIMIT 1),
 '{"creditScore": 650, "annualIncome": 40000, "debtToIncomeRatio": 0.35, "employmentStatus": "full-time", "bankruptcyHistory": false}',
 '{"approved": null, "rule": "Manual Review Required"}'),

-- Test case for high limit approval
((SELECT id FROM rules WHERE name = 'High Limit Approval' LIMIT 1),
 '{"creditScore": 780, "annualIncome": 120000, "debtToIncomeRatio": 0.15, "employmentStatus": "full-time", "bankruptcyHistory": false}',
 '{"approved": true, "rule": "High Limit Approval"}');