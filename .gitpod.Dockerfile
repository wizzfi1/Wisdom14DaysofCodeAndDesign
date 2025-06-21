FROM gitpod/workspace-postgres

# Install any additional dependencies you need
RUN sudo apt-get update && \
    sudo apt-get install -y postgresql-client && \
    sudo rm -rf /var/lib/apt/lists/*