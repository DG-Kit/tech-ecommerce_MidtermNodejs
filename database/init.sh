#!/bin/bash

# Start SQL Server
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start
sleep 30

# Run the setup script to create the DB and the schema
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Kietanh1234!" -d master -i /docker-entrypoint-initdb.d/init.sql

# Verify the database was created
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Kietanh1234!" -Q "SELECT name FROM sys.databases WHERE name = 'TechStore'"

# Keep container running
tail -f /dev/null