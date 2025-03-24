# database/Dockerfile
FROM mcr.microsoft.com/mssql/server:2019-latest

# Create directory for initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Add a script to run the initialization scripts
COPY ./init.sh /

# Make the initialization script executable
USER root
RUN chmod +x /init.sh

# Change back to mssql user
USER mssql

CMD /bin/bash /init.sh