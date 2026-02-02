-- Create gas_settings table for admin control of gas limits
CREATE TABLE IF NOT EXISTS gas_settings (
    id VARCHAR PRIMARY KEY DEFAULT 'default',
    max_gas_limit VARCHAR NOT NULL DEFAULT '100000',
    max_gas_cost_eth VARCHAR NOT NULL DEFAULT '0.0025',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR
);

-- Insert default settings for $10 gas limit
INSERT INTO gas_settings (id, max_gas_limit, max_gas_cost_eth, updated_by)
VALUES ('default', '100000', '0.0025', 'system')
ON CONFLICT (id) DO UPDATE SET
    max_gas_limit = EXCLUDED.max_gas_limit,
    max_gas_cost_eth = EXCLUDED.max_gas_cost_eth,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = EXCLUDED.updated_by;

-- Verify the table was created
SELECT * FROM gas_settings;






